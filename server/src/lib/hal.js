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

  #response(incomingMessage) {
    log.debug(this.#timed);
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
