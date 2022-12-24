let id = -1;

const idNext = () => {
  id += 1;
  return id;
};

const halEncode = (message) => `${JSON.stringify(message)}\n`;
const halDecode = (message) => JSON.parse(message.toString());

class Protocol {
  static emuPowerOn() {
    return { op: 'emu.poweron', id: idNext() };
  }

  static emuSpeedMode(speed) {
    return { op: 'emu.speedmode', data: [speed], id: idNext() };
  }

  static print(message) {
    return { op: 'print', data: [message], id: idNext() };
  }

  static joypadWrite(deviceId, options) {
    return { op: 'joypad.write', data: [deviceId, options], id: idNext() };
  }
}

const {
  emuPowerOn,
  emuSpeedMode,
  joypadWrite,
  print,
} = Protocol;

export default Protocol;
export {
  Protocol,
  emuPowerOn,
  emuSpeedMode,
  joypadWrite,
  print,
  halDecode,
  halEncode,
};
