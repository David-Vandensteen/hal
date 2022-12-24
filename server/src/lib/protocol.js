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
}

const {
  emuPowerOn,
  emuSpeedMode,
  print,
} = Protocol;

export default Protocol;
export {
  Protocol,
  emuPowerOn,
  emuSpeedMode,
  print,
  halDecode,
  halEncode,
};
