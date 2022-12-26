import { Hal, Protocol } from '#src/lib/hal';

const { print } = Protocol;

class Gradius extends Hal {
  init() {
    super.init();
    this.gameMacro.custom = () => {
      this.add(print('CUSTOM 1'));
      this.add(Protocol.print('CUSTOM 2'));
      return this;
    };
    this.gameMacro.start = () => {
      this.add(Protocol.print('START'));
      return this;
    };
    return this;
  }
}

const gradius = new Gradius({ server: { host: '127.0.0.1', port: 7070 } });

gradius
  .init()
  .gameMacro.start()
  .gameMacro.custom()
  .gameMacro.init({ speed: 'normal' })
  .gameMacro.wait({ frame: 10 })
  .start();
