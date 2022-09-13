/* 
Based on keycode_converter_data.inc from the Chromium source as of 2022-09-12
https://chromium.googlesource.com/chromium/src/+/refs/heads/main/ui/events/keycodes/dom/dom_code_data.inc
blob: ad13cbdc26b6c17b010f8d84423ffe9c57f84557 [file] [log] [blame]
*/

// Chrome internal hid keypress events we're not using
//"Hyper": { 0x000010},
//"Super": { 0x000011},
//"Fn": { 0x000012},
//"FnLock": { 0x000013},
//"Suspend": { 0x000014},
//"Resume": { 0x000015},
//"Turbo": { 0x000016},
//"PrivacyScreenToggle": { 0x000017},
//"MicrophoneMuteToggle": { 0x000018},
//"KeyboardBacklightToggle": { 0x000019},
//"Sleep": { 0x010082},
//"WakeUp": { 0x010083},
//"DisplayToggleIntExt": { 0x0100b5},

const domEventMappingTable = {
  KeyA: { page: "keyboard", code: 0x0004 },
  KeyB: { page: "keyboard", code: 0x0005 },
  KeyC: { page: "keyboard", code: 0x0006 },
  KeyD: { page: "keyboard", code: 0x0007 },
  KeyE: { page: "keyboard", code: 0x0008 },
  KeyF: { page: "keyboard", code: 0x0009 },
  KeyG: { page: "keyboard", code: 0x000a },
  KeyH: { page: "keyboard", code: 0x000b },
  KeyI: { page: "keyboard", code: 0x000c },
  KeyJ: { page: "keyboard", code: 0x000d },
  KeyK: { page: "keyboard", code: 0x000e },
  KeyL: { page: "keyboard", code: 0x000f },
  KeyM: { page: "keyboard", code: 0x0010 },
  KeyN: { page: "keyboard", code: 0x0011 },
  KeyO: { page: "keyboard", code: 0x0012 },
  KeyP: { page: "keyboard", code: 0x0013 },
  KeyQ: { page: "keyboard", code: 0x0014 },
  KeyR: { page: "keyboard", code: 0x0015 },
  KeyS: { page: "keyboard", code: 0x0016 },
  KeyT: { page: "keyboard", code: 0x0017 },
  KeyU: { page: "keyboard", code: 0x0018 },
  KeyV: { page: "keyboard", code: 0x0019 },
  KeyW: { page: "keyboard", code: 0x001a },
  KeyX: { page: "keyboard", code: 0x001b },
  KeyY: { page: "keyboard", code: 0x001c },
  KeyZ: { page: "keyboard", code: 0x001d },
  Digit1: { page: "keyboard", code: 0x001e },
  Digit2: { page: "keyboard", code: 0x001f },
  Digit3: { page: "keyboard", code: 0x0020 },
  Digit4: { page: "keyboard", code: 0x0021 },
  Digit5: { page: "keyboard", code: 0x0022 },
  Digit6: { page: "keyboard", code: 0x0023 },
  Digit7: { page: "keyboard", code: 0x0024 },
  Digit8: { page: "keyboard", code: 0x0025 },
  Digit9: { page: "keyboard", code: 0x0026 },
  Digit0: { page: "keyboard", code: 0x0027 },
  Enter: { page: "keyboard", code: 0x0028 },
  Escape: { page: "keyboard", code: 0x0029 },
  Backspace: { page: "keyboard", code: 0x002a },
  Tab: { page: "keyboard", code: 0x002b },
  Space: { page: "keyboard", code: 0x002c },
  Minus: { page: "keyboard", code: 0x002d },
  Equal: { page: "keyboard", code: 0x002e },
  BracketLeft: { page: "keyboard", code: 0x002f },
  BracketRight: { page: "keyboard", code: 0x0030 },
  Backslash: { page: "keyboard", code: 0x0031 },
  Semicolon: { page: "keyboard", code: 0x0033 },
  Quote: { page: "keyboard", code: 0x0034 },
  Backquote: { page: "keyboard", code: 0x0035 },
  Comma: { page: "keyboard", code: 0x0036 },
  Period: { page: "keyboard", code: 0x0037 },
  Slash: { page: "keyboard", code: 0x0038 },
  CapsLock: { page: "keyboard", code: 0x0039 },
  F1: { page: "keyboard", code: 0x003a },
  F2: { page: "keyboard", code: 0x003b },
  F3: { page: "keyboard", code: 0x003c },
  F4: { page: "keyboard", code: 0x003d },
  F5: { page: "keyboard", code: 0x003e },
  F6: { page: "keyboard", code: 0x003f },
  F7: { page: "keyboard", code: 0x0040 },
  F8: { page: "keyboard", code: 0x0041 },
  F9: { page: "keyboard", code: 0x0042 },
  F10: { page: "keyboard", code: 0x0043 },
  F11: { page: "keyboard", code: 0x0044 },
  F12: { page: "keyboard", code: 0x0045 },
  PrintScreen: { page: "keyboard", code: 0x0046 },
  ScrollLock: { page: "keyboard", code: 0x0047 },
  Pause: { page: "keyboard", code: 0x0048 },
  Insert: { page: "keyboard", code: 0x0049 },
  Home: { page: "keyboard", code: 0x004a },
  PageUp: { page: "keyboard", code: 0x004b },
  Delete: { page: "keyboard", code: 0x004c },
  End: { page: "keyboard", code: 0x004d },
  PageDown: { page: "keyboard", code: 0x004e },
  ArrowRight: { page: "keyboard", code: 0x004f },
  ArrowLeft: { page: "keyboard", code: 0x0050 },
  ArrowDown: { page: "keyboard", code: 0x0051 },
  ArrowUp: { page: "keyboard", code: 0x0052 },
  NumLock: { page: "keyboard", code: 0x0053 },
  NumpadDivide: { page: "keyboard", code: 0x0054 },
  NumpadMultiply: { page: "keyboard", code: 0x0055 },
  NumpadSubtract: { page: "keyboard", code: 0x0056 },
  NumpadAdd: { page: "keyboard", code: 0x0057 },
  NumpadEnter: { page: "keyboard", code: 0x0058 },
  Numpad1: { page: "keyboard", code: 0x0059 },
  Numpad2: { page: "keyboard", code: 0x005a },
  Numpad3: { page: "keyboard", code: 0x005b },
  Numpad4: { page: "keyboard", code: 0x005c },
  Numpad5: { page: "keyboard", code: 0x005d },
  Numpad6: { page: "keyboard", code: 0x005e },
  Numpad7: { page: "keyboard", code: 0x005f },
  Numpad8: { page: "keyboard", code: 0x0060 },
  Numpad9: { page: "keyboard", code: 0x0061 },
  Numpad0: { page: "keyboard", code: 0x0062 },
  NumpadDecimal: { page: "keyboard", code: 0x0063 },
  IntlBackslash: { page: "keyboard", code: 0x0064 },
  ContextMenu: { page: "keyboard", code: 0x0065 },
  Power: { page: "keyboard", code: 0x0066 },
  NumpadEqual: { page: "keyboard", code: 0x0067 },
  F13: { page: "keyboard", code: 0x0068 },
  F14: { page: "keyboard", code: 0x0069 },
  F15: { page: "keyboard", code: 0x006a },
  F16: { page: "keyboard", code: 0x006b },
  F17: { page: "keyboard", code: 0x006c },
  F18: { page: "keyboard", code: 0x006d },
  F19: { page: "keyboard", code: 0x006e },
  F20: { page: "keyboard", code: 0x006f },
  F21: { page: "keyboard", code: 0x0070 },
  F22: { page: "keyboard", code: 0x0071 },
  F23: { page: "keyboard", code: 0x0072 },
  F24: { page: "keyboard", code: 0x0073 },
  Open: { page: "keyboard", code: 0x0074 },
  Help: { page: "keyboard", code: 0x0075 },
  Select: { page: "keyboard", code: 0x0077 },
  Again: { page: "keyboard", code: 0x0079 },
  Undo: { page: "keyboard", code: 0x007a },
  Cut: { page: "keyboard", code: 0x007b },
  Copy: { page: "keyboard", code: 0x007c },
  Paste: { page: "keyboard", code: 0x007d },
  Find: { page: "keyboard", code: 0x007e },
  AudioVolumeMute: { page: "keyboard", code: 0x007f },
  AudioVolumeUp: { page: "keyboard", code: 0x0080 },
  AudioVolumeDown: { page: "keyboard", code: 0x0081 },
  NumpadComma: { page: "keyboard", code: 0x0085 },
  IntlRo: { page: "keyboard", code: 0x0087 },
  KanaMode: { page: "keyboard", code: 0x0088 },
  IntlYen: { page: "keyboard", code: 0x0089 },
  Convert: { page: "keyboard", code: 0x008a },
  NonConvert: { page: "keyboard", code: 0x008b },
  Lang1: { page: "keyboard", code: 0x0090 },
  Lang2: { page: "keyboard", code: 0x0091 },
  Lang3: { page: "keyboard", code: 0x0092 },
  Lang4: { page: "keyboard", code: 0x0093 },
  Lang5: { page: "keyboard", code: 0x0094 },
  Abort: { page: "keyboard", code: 0x009b },
  Props: { page: "keyboard", code: 0x00a3 },
  NumpadParenLeft: { page: "keyboard", code: 0x00b6 },
  NumpadParenRight: { page: "keyboard", code: 0x00b7 },
  NumpadBackspace: { page: "keyboard", code: 0x00bb },
  NumpadMemoryStore: { page: "keyboard", code: 0x00d0 },
  NumpadMemoryRecall: { page: "keyboard", code: 0x00d1 },
  NumpadMemoryClear: { page: "keyboard", code: 0x00d2 },
  NumpadMemoryAdd: { page: "keyboard", code: 0x00d3 },
  NumpadMemorySubtract: { page: "keyboard", code: 0x00d4 },
  NumpadClear: { page: "keyboard", code: 0x00d8 },
  NumpadClearEntry: { page: "keyboard", code: 0x00d9 },
  ControlLeft: { page: "keyboard", code: 0x00e0 },
  ShiftLeft: { page: "keyboard", code: 0x00e1 },
  AltLeft: { page: "keyboard", code: 0x00e2 },
  MetaLeft: { page: "keyboard", code: 0x00e3 },
  ControlRight: { page: "keyboard", code: 0x00e4 },
  ShiftRight: { page: "keyboard", code: 0x00e5 },
  AltRight: { page: "keyboard", code: 0x00e6 },
  MetaRight: { page: "keyboard", code: 0x00e7 },
  BrightnessUp: { page: "consumer", code: 0x006f },
  BrightnessDown: { page: "consumer", code: 0x0070 },
  MediaPlay: { page: "consumer", code: 0x00b0 },
  MediaPause: { page: "consumer", code: 0x00b1 },
  MediaRecord: { page: "consumer", code: 0x00b2 },
  MediaFastForward: { page: "consumer", code: 0x00b3 },
  MediaRewind: { page: "consumer", code: 0x00b4 },
  MediaTrackNext: { page: "consumer", code: 0x00b5 },
  MediaTrackPrevious: { page: "consumer", code: 0x00b6 },
  MediaStop: { page: "consumer", code: 0x00b7 },
  Eject: { page: "consumer", code: 0x00b8 },
  MediaPlayPause: { page: "consumer", code: 0x00cd },
  MediaSelect: { page: "consumer", code: 0x0183 },
  LaunchMail: { page: "consumer", code: 0x018a },
  LaunchApp2: { page: "consumer", code: 0x0192 },
  LaunchApp1: { page: "consumer", code: 0x0194 },
  LaunchControlPanel: { page: "consumer", code: 0x019f },
  SelectTask: { page: "consumer", code: 0x01a2 },
  LaunchScreenSaver: { page: "consumer", code: 0x01b1 },
  LaunchAssistant: { page: "consumer", code: 0x01cb },
  BrowserSearch: { page: "consumer", code: 0x0221 },
  BrowserHome: { page: "consumer", code: 0x0223 },
  BrowserBack: { page: "consumer", code: 0x0224 },
  BrowserForward: { page: "consumer", code: 0x0225 },
  BrowserStop: { page: "consumer", code: 0x0226 },
  BrowserRefresh: { page: "consumer", code: 0x0227 },
  BrowserFavorites: { page: "consumer", code: 0x022a },
  ZoomToggle: { page: "consumer", code: 0x0232 },
  MailReply: { page: "consumer", code: 0x0289 },
  MailForward: { page: "consumer", code: 0x028b },
  MailSend: { page: "consumer", code: 0x028c },
  KeyboardLayoutSelect: { page: "consumer", code: 0x029d },
  ShowAllWindows: { page: "consumer", code: 0x029f },
};

export const lookupDomKey = (name) => {
  return domEventMappingTable[name];
};
