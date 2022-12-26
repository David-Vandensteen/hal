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
  #frame = 0;

  constructor(config) {
    this.#config = config;
    this.gameMacro = {};
  }

  add(operation, options) {
    if (Array.isArray(operation)) {
      operation.map((op) => this.add(op));
    } else {
      if (options) this.#periodic.push({ operation, ...options });
      this.#queue.unshift({ ...operation, ...{ id: idNext() } });
    }
    return this;
  }

  #next() {
    // if (this.#queue.length === 0) this.add({ op: 'emu.pause', id: 1000 }); // TODO
    return this.#queue.pop();
  }

  #response(incomingMessage) {
    // log.info('getOp');
    // log.debug('incoming message', incomingMessage);
    // log.debug('queue', this.#queue);
    if (this.#periodic) {
      this.#periodic.map((p) => {
        log.debug('PERIOD to test', p);
        log.debug('PERIOD result', p.period % this.#frame);
        log.debug('FRAME', this.#frame);
        if ((p.period % this.#frame) === 0) {
          this.add(p.operation);
        }
        return p;
      });
    }
    const sendMessage = this.#queue.find((q) => q.id === incomingMessage.id) || { op: 'emu.frameadvance', id: idNext() }; // TODO
    if (sendMessage.op === 'emu.frameadvance') this.#frame += 1;
    return sendMessage;

    /*
    if (this.#queue !== 0) {
      const sendMessage = this.#queue.find((q) => q.id === incomingMessage.id);
      socket.write(halEncode(sendMessage));
      if (sendMessage.op === 'emu.frameadvance') this.#frame += 1;
    } else if (this.#periodic) {
      this.#periodic.map((p) => {
        if ((p.period % this.#frame) === 0) {
          this.add(p.operation);
          this.#fetchGetOp(socket, incomingMessage);
        }
        return p;
      });
    }
    */
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
          // this.#handleOp(socket, message);
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
