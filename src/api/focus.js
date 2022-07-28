/* chrysalis-focus -- Chrysalis Focus protocol library
 * Copyright (C) 2018-2022  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { ipcRenderer } = require("electron");
const { SerialPort } = require("serialport");

import Hardware from "@api/hardware";

import fs from "fs";
import stream from "stream";

import { logger } from "@api/log";

import Colormap from "./focus/colormap";
import Macros from "./focus/macros";
import Keymap, { OnlyCustom } from "./focus/keymap";
import LayerNames from "./focus/layernames";

global.chrysalis_focus_instance = null;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class FocusParser extends stream.Transform {
  constructor({ interval, ...transformOptions }) {
    super(transformOptions);

    if (!interval) {
      throw new TypeError('"interval" is required');
    }

    if (typeof interval !== "number" || Number.isNaN(interval)) {
      throw new TypeError('"interval" is not a number');
    }

    if (interval < 1) {
      throw new TypeError('"interval" is not greater than 0');
    }

    this.interval = interval;
    this.stopSignal = Buffer.from("\r\n.\r\n");
    this.buffer = Buffer.alloc(0);
  }

  startTimer() {
    this.endTimer();
    this.timerId = setTimeout(() => {
      this.emit("timeout");
    }, this.interval);
  }

  endTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  _transform(chunk, encoding, cb) {
    this.endTimer();

    let data = Buffer.concat([this.buffer, chunk]);
    let position;
    while ((position = data.indexOf(this.stopSignal)) !== -1) {
      const pushData = data.slice(0, position);
      if (pushData.length == 0) {
        this.push(".");
      } else {
        this.push(pushData);
      }
      data = data.slice(position + this.stopSignal.length);
    }
    this.buffer = data;

    if (this.buffer.length != 0) {
      this.startTimer();
    }
    cb();
  }

  _flush(cb) {
    this.push(this.buffer);
    this.buffer = Buffer.alloc(0);
    cb;
  }
}

class Focus {
  constructor() {
    if (!global.chrysalis_focus_instance) {
      global.chrysalis_focus_instance = this;
      this.commands = {
        help: this._help,
      };
      this.timeout = 30000;
      this._supported_commands = [];
      this._plugins = [];
      this._request_id = 0;
    }

    return global.chrysalis_focus_instance;
  }

  async listDevices() {
    const portList = (await SerialPort.list())
      .map((port) => ({
        path: port.path,
        vendorId: parseInt(`0x${port.vendorId}`),
        productId: parseInt(`0x${port.productId}`),
      }))
      .filter((port) => port.vendorId && port.productId)
      .reduce((coll, port) => {
        const key = `${port.vendorId}:${port.productId}`;
        return Object.assign({}, coll, {
          [key]: port,
        });
      }, {});
    const connectionTypeMap = Hardware.devices.reduce((coll, device) => {
      const deviceKey = `${device.usb.vendorId}:${device.usb.productId}`,
        bootKey = `${device.usb.bootloader.vendorId}:${device.usb.bootloader.productId}`;

      return Object.assign({}, coll, {
        [deviceKey]: "kaleidoscope",
        [bootKey]: "bootloader",
      });
    }, {});
    const connectedDevices = (await ipcRenderer.invoke("usb.scan-for-devices"))
      .filter((device) => {
        const desc = device.deviceDescriptor;
        return connectionTypeMap[`${desc.idVendor}:${desc.idProduct}`];
      })
      .map((device) => {
        const vid = device.deviceDescriptor.idVendor,
          pid = device.deviceDescriptor.idProduct,
          path = portList[`${vid}:${pid}`]?.path,
          connType = connectionTypeMap[`${vid}:${pid}`],
          displayName = Hardware.getDeviceDescriptorByUsbIds(vid, pid).info
            .displayName;

        return {
          displayName: displayName,
          path: path,
          connectionType:
            connType == "kaleidoscope"
              ? path
                ? connType
                : "default"
              : connType,
          vendorId: vid,
          productId: pid,
        };
      });

    return connectedDevices;
  }

  async checkSerialDevice(focusDeviceDescriptor, usbInfo) {
    const portList = await SerialPort.list();
    logger("focus").debug("serial port list obtained", {
      portList: portList,
      device: usbInfo,
      function: "checkForSerialDevice",
    });

    for (const port of portList) {
      const pid = parseInt("0x" + port.productId),
        vid = parseInt("0x" + port.vendorId);

      if (pid == usbInfo.productId && vid == usbInfo.vendorId) {
        const newPort = Object.assign({}, port);
        newPort.focusDeviceDescriptor = focusDeviceDescriptor;
        newPort.focusDeviceDescriptor.bootloader = true;
        logger("focus").info("serial port found", {
          port: newPort,
          device: usbInfo,
          function: "checkForSerialDevice",
        });
        return newPort;
      }
    }
    logger("focus").debug("serial device not found", {
      function: "checkForSerialDevice",
      device: usbInfo,
    });

    return null;
  }

  async checkSerialBootloader(focusDeviceDescriptor) {
    return await this.checkSerialDevice(
      focusDeviceDescriptor,
      focusDeviceDescriptor.usb.bootloader
    );
  }

  async checkNonSerialBootloader(focusDeviceDescriptor) {
    const bootloader = focusDeviceDescriptor.usb.bootloader;

    const deviceList = await ipcRenderer.invoke(
      "usb.scan-for-devices",
      bootloader.productId,
      bootloader.vendorId
    );

    for (const device of deviceList) {
      const pid = device.deviceDescriptor.idProduct,
        vid = device.deviceDescriptor.idVendor;

      if (pid == bootloader.productId && vid == bootloader.vendorId) {
        const newPort = Object.assign({}, device);
        newPort.focusDeviceDescriptor = focusDeviceDescriptor;
        newPort.focusDeviceDescriptor.bootloader = true;

        logger("focus").info("bootloader found", {
          device: bootloader,
          function: "checkNonSerialBootloader",
        });
        return newPort;
      }
    }

    logger("focus").debug("bootloader not found", {
      function: "checkNonSerialBootloader",
      device: bootloader,
    });

    return null;
  }

  async checkBootloader(focusDeviceDescriptor) {
    if (!focusDeviceDescriptor.usb.bootloader) {
      logger().warn("No bootloader defined in the device descriptor", {
        descriptor: focusDeviceDescriptor,
      });
      return false;
    }
    logger("focus").info("checking bootloader presence", {
      descriptor: focusDeviceDescriptor,
    });

    if (focusDeviceDescriptor.usb.bootloader.protocol !== "avr109") {
      return await this.checkNonSerialBootloader(focusDeviceDescriptor);
    } else {
      return await this.checkSerialBootloader(focusDeviceDescriptor);
    }
  }

  async reconnectToKeyboard(focusDeviceDescriptor) {
    logger("focus").info("reconnecting to keyboard", {
      descriptor: focusDeviceDescriptor,
    });
    const usbDeviceDescriptor = await this.checkSerialDevice(
      focusDeviceDescriptor,
      focusDeviceDescriptor.usb
    );
    if (!usbDeviceDescriptor) return false;

    await this.open(usbDeviceDescriptor.path, usbDeviceDescriptor);
    await this.supported_commands();
    await this.plugins();

    return true;
  }

  async open(device_identifier, info) {
    if (typeof device_identifier == "string") {
      if (!info) throw new Error("Device descriptor argument is mandatory");
      this._port = new SerialPort({
        path: device_identifier,
        baudRate: 9600,
      });
    } else if (typeof device_identifier == "object") {
      if (device_identifier.hasOwnProperty("binding")) {
        if (!info) throw new Error("Device descriptor argument is mandatory");
        this._port = device_identifier;
      } else {
        const devices = await this.find(device_identifier);
        if (devices && devices.length >= 1) {
          this._port = new SerialPort({
            path: devices[0].path,
            baudRate: 9600,
          });
        }
        info = device_identifier;
      }
    } else {
      throw new Error("Invalid argument");
    }

    this.focusDeviceDescriptor = info;
    this._parser = this._port.pipe(new FocusParser({ interval: this.timeout }));

    this.callbacks = [];
    this._parser.on("data", (data) => {
      data = data.toString("utf-8");
      logger("focus").debug("incoming data", { data: data });

      const [resolve] = this.callbacks?.shift();
      this._parser.endTimer();
      if (data == ".") {
        resolve();
      } else {
        resolve(data.trim());
      }
    });
    this._parser.on("timeout", () => {
      while (this.callbacks.length > 0) {
        const [_, reject] = this.callbacks.shift();
        reject("Communication timeout");
      }
      this.close();
    });
    this._port.on("close", (error) => {
      if (this._parser) {
        this._parser.endTimer();
      }
      while (this.callbacks.length > 0) {
        const [_, reject] = this.callbacks.shift();
        reject("Device disconnected");
      }
      this.close();
    });

    this._supported_commands = [];
    this._plugins = [];
    return this._port;
  }

  close() {
    if (this._port && this._port.isOpen) {
      this._port.close();
    }
    this._port = null;
    this._parser = null;
    this.focusDeviceDescriptor = null;
    this._supported_commands = [];
    this._plugins = [];
  }

  async isDeviceAccessible(port) {
    if (process.platform !== "linux") return true;

    try {
      fs.accessSync(port.path, fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
      return false;
    }
    return true;
  }

  async isDeviceSupported(port) {
    if (!port.focusDeviceDescriptor.isDeviceSupported) {
      return true;
    }
    const supported = await port.focusDeviceDescriptor.isDeviceSupported(port);
    logger("focus").debug("isDeviceSupported?", {
      port: port,
      supported: supported,
    });
    return supported;
  }

  async supported_commands() {
    if (this._supported_commands.length == 0) {
      this._supported_commands = await this.request("help");
    }
    return this._supported_commands;
  }

  async plugins() {
    if (this._plugins.length == 0) {
      this._plugins = await this.request("plugins");
    }
    return this._plugins;
  }

  async _write_parts(request) {
    for (let index = 0; index < request.length; index += 32) {
      this._port.write(request.slice(index, index + 32));
      await new Promise((timeout) => setTimeout(timeout, 50));
      await this._port.drain();
    }
  }

  request(cmd, ...args) {
    if (
      this._supported_commands.length > 0 &&
      !this._supported_commands.includes(cmd)
    ) {
      logger("focus").verbose("request (noop)", {
        command: cmd,
        args: args,
      });
      return new Promise((resolve) => {
        resolve("");
      });
    }

    const rid = this._request_id;
    this._request_id += 1;
    logger("focus").verbose("request", {
      request: {
        id: rid,
        command: cmd,
        args: args,
      },
    });

    return new Promise((resolve, reject) => {
      this._request(cmd, ...args)
        .then((data) => {
          logger("focus").verbose("response", {
            request: {
              id: rid,
              command: cmd,
              args: args,
            },
            response: data,
          });
          resolve(data);
        })
        .catch((error) => {
          logger("focus").error("request timed out", {
            request: {
              id: rid,
              command: cmd,
              args: args,
            },
            error: error,
          });
          reject("Communication timeout");
        });
    });
  }

  async _request(cmd, ...args) {
    if (!this._port) throw "Device not connected!";

    let request = cmd;
    if (args && args.length > 0) {
      request = request + " " + args.join(" ");
    }
    request += "\n";

    // TODO(anyone): This is a temporary measure until #985 gets fixed.
    await delay(250);

    return new Promise((resolve, reject) => {
      this._parser.startTimer();
      this.callbacks.push([resolve, reject]);
      if (process.platform == "darwin") {
        /*
         * On macOS, we need to stagger writes, otherwise we seem to overwhelm the
         * system, and the host will receive garbage. If we send in smaller
         * chunks, with a slight delay between them, we can avoid this problem.
         *
         * We may be able to do this smarter, if we figure out the rough chunk
         * size that is safe to send. That'd speed up writes on macOS. Until then,
         * we split at each space, and send tiny chunks.
         */
        this._write_parts(request);
      } else {
        this._port.write(request);
      }
    });
  }

  async command(cmd, ...args) {
    if (typeof this.commands[cmd] == "function") {
      return this.commands[cmd](this, ...args);
    } else if (typeof this.commands[cmd] == "object") {
      return this.commands[cmd].focus(this, ...args);
    } else {
      return this.request(cmd, ...args);
    }
  }

  addCommands(cmds) {
    Object.assign(this.commands, cmds);
  }

  addMethod(methodName, command) {
    if (this[methodName]) {
      const tmp = this[methodName];
      this[methodName] = (...args) => {
        tmp(...args);
        this.commands[command][methodName](...args);
      };
    } else {
      this[methodName] = (...args) => {
        this.commands[command][methodName](...args);
      };
    }
  }

  async _help(s) {
    const data = await s.request("help");
    return data.split(/\r?\n/).filter((v) => v.length > 0);
  }

  eepromRestoreCommands = [
    "keymap",
    "colormap",
    "settings.defaultLayer",
    "escape_oneshot.cancel_key",
    "idleleds.time_limit",
    "layernames",
    "led.brightness",
    "led_mode.auto_save",
    "led_mode.default",
    "macros",
    "tapdance.map",
    "hostos.type",
    "autoshift.enabled",
    "autoshift.timeout",
    "autoshift.categories",
    "typingbreaks.idleTimeLimit",
    "typingbreaks.lockTimeOut",
    "typingbreaks.lockLength",
    "typingbreaks.leftMaxKeys",
    "typingbreaks.rightMaxKeys",
  ];

  eepromBackupCommands = [
    ...this.eepromRestoreCommands,
    "help",
    "plugins",
    "eeprom.contents",
    "eeprom.free",
    "settings.valid?",
    "settings.version",
    "settings.crc",
  ];
  async readKeyboardConfiguration() {
    const backup = {};
    for (const cmd of this.eepromBackupCommands) {
      const dump = await this.command(cmd);
      backup[cmd] = dump;
    }
    return backup;
  }
  async writeKeyboardConfiguration(backup) {
    for (const cmd of this.eepromRestoreCommands) {
      await this.command(cmd, backup[cmd]);
    }
  }
}

const focus = new Focus();
focus.addCommands({ colormap: new Colormap() });
focus.addMethod("setLayerSize", "colormap");
focus.addCommands({ layernames: new LayerNames() });
focus.addCommands({ macros: new Macros() });
focus.addCommands({
  keymap: new Keymap(),
  "keymap.onlyCustom": new OnlyCustom(),
});
focus.addMethod("setLayerSize", "keymap");

export default Focus;
