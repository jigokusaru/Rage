const cmdHandler = require('../../util/cmdHandler'); 

module.exports = {
  name: 'test',
  description: 'Runs a test.',
  usage: 'test',
  info: 'This just test things.',

  execute(msg, args) {
      console.log(cmdHandler.getCommands); 
  },
};