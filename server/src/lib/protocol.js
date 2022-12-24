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

  static print(message) {
    return { op: 'print', data: [message], id: idNext() };
  }
}

export default Protocol;
export { Protocol, halDecode, halEncode };
