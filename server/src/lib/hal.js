/* eslint-disable lines-between-class-members */
import { TCPServer } from '#src/lib/tcpServer';
import { Protocol, halDecode, halEncode } from '#src/lib/protocol';

class Hal {
  #config;
  #tcpServer;
  #operations = [];
  #operation = {};

  constructor(config) {
    this.#config = config;
    this.#operation.next = () => this.#operations.pop();
    this.#operation.add = (op) => this.#operations.unshift(op);
  }

  start() {
    const { host, port } = this.#config.server;
    const { add, next } = this.#operation;
    const { print, emuPowerOn } = Protocol;

    add(emuPowerOn());
    add(print('OP1'));
    add(print('OP2'));
    add(print('OP3'));
    add(print('OP4'));
    add(print('OP5'));
    add(print('OP6'));
    add(print('OP7'));
    add(print('OP8'));
    add(print('OP9'));

    this.#tcpServer = new TCPServer({ host, port });
    this.#tcpServer.on('data', (socket, data) => {
      // console.log('HAL RECEIVE DATA', halDecode(data));
      // socket.write(halEncode(this.#operations.pop()));
      socket.write(halEncode(next()));
    });
    this.#tcpServer.start();
  }
}

export default Hal;
export { Hal };
