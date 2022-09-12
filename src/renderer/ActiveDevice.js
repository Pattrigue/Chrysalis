// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
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

import Focus from "@api/focus";

export function ActiveDevice() {
  this.port = undefined;
  this.connected = false;
  this.focusConnection = undefined;

  this.focus = new Focus();

  this.devicePath = async () => {
    return this.focus._port?.settings.path;
  };

  this.plugins = () => {
    return this.focus.plugins();
  };

  this.supported_commands = () => {
    return this.focus.supported_commands();
  };

  this.focusDetected = () => {
    if (this.hasCustomizableKeymaps() || this.hasCustomizableLEDMaps()) {
      return true;
    } else {
      return false;
    }
  };
  this.hasCustomizableKeymaps = () => {
    this.focus.supported_commands().then((commands) => {
      if (
        commands.includes("keymap.custom") > 0 ||
        commands.includes("keymap.map") > 0
      ) {
        return true;
      } else {
        return false;
      }
    });
  };

  this.hasCustomizableLEDMaps = () => {
    this.focus.supported_commands().then((commands) => {
      if (
        commands.includes("colormap.map") > 0 &&
        commands.includes("palette") > 0
      ) {
        return true;
      } else {
        return false;
      }
    });
  };
}
