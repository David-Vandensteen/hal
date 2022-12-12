import chalk from 'chalk';

const { log } = console;

log.title = (...message) => { log(chalk.bgGreen.bold('-', ...message)); };
log.info = (...message) => { log(chalk.magenta.bold('  .', ...message)); };
log.debug = (...message) => { log(...message); };

export default log;
export { log };
