/* eslint-disable lines-between-class-members */
import { TCPServer } from '#src/lib/tcpServer';

import {
  Protocol,
  emuPowerOn,
  emuSpeedMode,
  print,
  halDecode,
  halEncode,
} from '#src/lib/protocol';

class Hal {
  #config;
  #tcpServer;
  #queue = [];
  #operation = {};

  constructor(config) {
    this.#config = config;
    this.gameMacro = {};
  }

  init() {
    this.gameMacro.init = ({ speed }) => {
      this.add(emuPowerOn());
      this.add(emuSpeedMode(speed));
      return this;
    };
    return this;
  }

  add(operation) {
    this.#queue.unshift(operation);
    return this;
  }

  addJoypad(
    {
      id,
      B,
      A,
      right,
      left,
      down,
      up,
      start,
      select,
    },
  ) {
    return this;
  }

  next() {
    return this.#queue.pop();
  }

  start() {
    const { host, port } = this.#config.server;

    this.#tcpServer = new TCPServer({ host, port });
    this.#tcpServer.on('data', (socket, data) => {
      // console.log('HAL RECEIVE DATA', halDecode(data));
      // socket.write(halEncode(this.#operations.pop()));
      socket.write(halEncode(this.next()));
    });
    this.#tcpServer.start();
    return this;
  }
}

export default Hal;
export { Hal, Protocol };
