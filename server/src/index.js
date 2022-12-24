import { Hal } from '#src/lib/hal';

const hal = new Hal({ server: { host: '127.0.0.1', port: 7070 } });
hal.start();
