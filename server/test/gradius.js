import { Hal } from '#src/lib/hal';

import {
  fceuxMacro,
  emuFrameAdvance,
  joypadWrite,
  print,
} from '#src/lib/driver/fceuxDriver';

class Gradius extends Hal {}

const gradius = new Gradius({ server: { host: '127.0.0.1', port: 7070 } });

gradius
  .add(fceuxMacro.init({ speed: 'normal' }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { start: true }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { A: true }), { period: 1 })
  .add(emuFrameAdvance(), { period: 0 })
  .start();

/*
gradius
  .add(joypadWrite(1, { A: true }), { period: 0 })
  .add(emuFrameAdvance(), { period: 0 })
  .add(print('HELLO'), { period: 0 })
  .start();
/*
gradius
  .add(fceuxMacro.init({ speed: 'normal' }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { start: true }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { A: true }), { period: 0 })
  .add(emuFrameAdvance(), { period: 0 })
  .start();
*/

/*
gradius
  .add(fceuxMacro.init({ speed: 'normal' }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { start: true }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(emuFrameAdvance(), { period: 1, priority: 10 })
  .add(joypadWrite(1, { A: true }), { period: 1, priority: 1 })
  .start();
  */

/*
gradius
  .add(fceuxMacro.init({ speed: 'normal' }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { start: true }))
  .add(fceuxMacro.wait({ frame: 200 }))
  .add(joypadWrite(1, { A: true }))
  .add(emuFrameAdvance())
  .add(fceuxMacro.wait({ frame: 1000 }))
  .start();

*/
