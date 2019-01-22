const chalk = require('chalk');

module.exports = {
  step: (text) => chalk.bold.green(text),
  bold: (text) => chalk.bold(text),
  italic: (text) => chalk.italic(text),
  link: (link) => chalk.underline.bold.magenta(link),
  version: (version) => chalk.dim(version),
  red: (text) => chalk.red(text),
  green: (text) => chalk.green(text)
};
