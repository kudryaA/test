const bunyan = require('bunyan');
const Elasticsearch = require('bunyan-elasticsearch');
const bunyanamqp = require('bunyan-amqp-logger');

/**
 * Method for create logger
 * @param {Object} elasticsearch conf of elasticsearch
 * @param {string} rabbitmq conf of rabbitmq
 * @param {string} mode server mode
 * @param {string} name server name
 * @return {Logger}
 */
exports.createLogger = (elasticsearch, rabbitmq, mode, name) => {
  console.log(`Create logger for ${name} in ${mode}`);
  return bunyan.createLogger({
    src: true,
    name,
    streams: [
      {
        level: 'info',
        stream: process.stdout
      },
      {
        level: 'debug',
        stream: createElasticsearchLogger(elasticsearch, mode, name)
      },
      {
        level: 'error',
        type: 'raw',
        stream: createRabbitmqLogger(rabbitmq, mode)
      }
    ]
  });
};

/**
 * Elasticsearch logger config
 * @param {Object} conf configuration for elasticsearch
 * @param {string} mode server mode
 * @param {string} name server name
 */
function createElasticsearchLogger(conf, mode, name) {
  return new Elasticsearch({
    indexPattern: `[${mode}-log_${name}-]DD-MM-YYYY`,
    ...conf
  });
}

/**
 * Rabbimq logger config
 * @param {object} conf configuration for rabbitmq
 * @param {string} mode server mode
 */
function createRabbitmqLogger(conf, mode) {
  return bunyanamqp.createStream({
    ...conf,
    exchange : {
      routingKey : `${mode}-notification`
    }
  }).on('connect', () => {
    console.log('Connected to amqp');
  }).on('close', (e) => {
    console.log(`Closed connection to amqp ${e}`);
  }).on('error', console.log);
}