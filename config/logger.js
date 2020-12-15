const {
  createLogger,
  transports,
  format
} = require('winston');
require('winston-mongodb');

var logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.simple())
    }),

    new transports.MongoDB({
      level: 'info',
      db: 'mongodb+srv://aureliacarissaa:0L2ncVscMiIHc31K@cluster0.besvt.mongodb.net/todo-app?retryWrites=true&w=majority',
      format: format.combine(format.timestamp(), format.json())
    })
  ]
})

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;