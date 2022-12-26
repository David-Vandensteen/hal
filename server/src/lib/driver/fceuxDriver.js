class FceuxDriver {
  static emuPowerOn() {
    return { op: 'emu.poweron' };
  }

  static emuSpeedMode(speed) {
    return { op: 'emu.speedmode', data: [speed] };
  }

  static emuFrameAdvance() {
    return { op: 'emu.frameadvance' };
  }

  static emuPause() {
    return { op: 'emu.pause' };
  }

  static print(message) {
    return { op: 'print', data: [message] };
  }

  static joypadWrite(deviceId, options) {
    return { op: 'joypad.write', data: [deviceId, options] };
  }
}

const {
  emuPowerOn,
  emuSpeedMode,
  emuFrameAdvance,
  emuPause,
  joypadWrite,
  print,
} = FceuxDriver;

const fceuxMacro = {};

fceuxMacro.init = ({ speed }) => {
  const queue = [];
  queue.push(emuPowerOn());
  queue.push(emuSpeedMode(speed));
  return queue;
};

fceuxMacro.wait = ({ frame }) => {
  const queue = [];
  for (let i = 0; i < frame; i += 1) queue.push(emuFrameAdvance());
  return queue;
};

export default FceuxDriver;
export {
  FceuxDriver,
  fceuxMacro,
  emuPowerOn,
  emuSpeedMode,
  emuFrameAdvance,
  emuPause,
  joypadWrite,
  print,
};
