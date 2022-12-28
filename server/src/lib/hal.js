/* eslint-disable lines-between-class-members */
import { TCPServer } from '#src/lib/tcpServer';
import { log } from '#src/lib/log';

const halEncode = (message) => `${JSON.stringify(message)}\n`;
const halDecode = (message) => JSON.parse(message.toString());

let id = -1;

const idNext = () => {
  id += 1;
  return id;
};

class Hal {
  #config;
  #tcpServer;
  #queue = [];
  #periodic = [];
  #timed = [];
  #frame = 0;
  #joypadSate = {
    1: {
      A: false,
      B: false,
      up: false,
      down: false,
      left: false,
      right: false,
      start: false,
      select: false,
    },
    2: {
      A: false,
      B: false,
      up: false,
      down: false,
      left: false,
      right: false,
      start: false,
      select: false,
    },
  };

  constructor(config) {
    this.#config = config;
    this.gameMacro = {};
  }

  add(operation, options) {
    if (Array.isArray(operation)) {
      operation.map((op) => this.add(op));
    } else {
      if (options?.period) this.#periodic.push({ operation, ...options });
      if (options?.time) this.#timed.push({ operation, ...options });
      this.#queue.unshift({ ...operation, ...{ id: idNext() } });
    }
    return this;
  }

  joypad(options) {
    const processOptions = this.#joypadSate;
    for (let index = 1; index <= 2; index += 1) {
      if (options[index]?.up) processOptions[index].up = options[index].up;
      if (options[index]?.down) processOptions[index].down = options[index].down;
      if (options[index]?.left) processOptions[index].left = options[index].left;
      if (options[index]?.right) processOptions[index].right = options[index].right;
      if (options[index]?.A) processOptions[index].A = options[index].A;
      if (options[index]?.B) processOptions[index].B = options[index].B;
      if (options[index]?.start) processOptions[index].start = options[index].start;
      if (options[index]?.select) processOptions[index].select = options[index].select;

      if (options[index]?.up === false) processOptions[index].up = false;
      if (options[index]?.down === false) processOptions[index].down = false;
      if (options[index]?.left === false) processOptions[index].left = false;
      if (options[index]?.right === false) processOptions[index].right = false;
      if (options[index]?.A === false) processOptions[index].A = false;
      if (options[index]?.B === false) processOptions[index].B = false;
      if (options[index]?.start === false) processOptions[index].start = false;
      if (options[index]?.select === false) processOptions[index].select = false;
    }
    this.#joypadSate = processOptions;
    log.debug(this.#getJoypad(1));
    return this;
  }

  #getJoypad(deviceId) { return { op: 'joypad.write', data: [deviceId, this.#joypadSate[deviceId]] }; }

  #response(incomingMessage) {
    if (this.#timed) {
      this.#timed.map((t) => {
        if (t.time > 0) this.add(t.operation);
        return t;
      });
    }
    if (this.#periodic) {
      this.#periodic.map((p) => {
        if (((this.#frame % p.period) === 0) && p.operation.op !== 'emu.frameadvance') this.add(p.operation);
        return p;
      });
      this.#periodic.map((p) => {
        if (((this.#frame % p.period) === 0) && p.operation.op === 'emu.frameadvance') this.add(p.operation);
        return p;
      });
    }
    const sendMessage = this.#queue.find((q) => q.id === incomingMessage.id) || { op: 'emu.frameadvance', id: idNext() }; // TODO
    if (sendMessage.op === 'emu.frameadvance') {
      this.add(this.#getJoypad(1));
      log.debug(this.#joypadSate);
      this.#timed.map((t, index) => {
      // eslint-disable-next-line no-param-reassign
        t.time -= 1;
        if (t.time <= 0) delete this.#timed[index];
        return t;
      });
      this.#frame += 1;
    }
    return sendMessage;
  }

  start() {
    const { host, port } = this.#config.server;
    this.#tcpServer = new TCPServer({ host, port });
    this.#tcpServer.on('data', (socket, data) => {
      const message = halDecode(data);
      switch (message.op) {
        case 'connect':
          log.info('connect');
          socket.write(halEncode({ op: 'connect', data: ['pong'] }));
          break;

        case 'getOp':
          socket.write(halEncode(this.#response(message)));
          break;

        default:
          break;
      }
    });
    this.#tcpServer.start();
    return this;
  }
}

export default Hal;
export { Hal };
