const AWS = require('aws-sdk');


const {createLogger, createQueueService, readConfiguration} = require('utills');
const {Database, Configuration: DatabaseConfiguration} = require('database-client');
const {videoConvert} = require('./process/converter');
const {find} = require('./process/position');

/**
 *
 * @param dependencies {Object} dependencies for project
 * @param msg {String} message from rabbitmq
 * @param queue {String} queue from rabbitmq
 * @param f {Function} for execute
 */
async function executeEvents(dependencies, msg, queue, f) {
  const {logger} = dependencies;
  logger.info(`Consumer ${queue} have read message ${JSON.stringify(msg)}`);
  try {
    const { id } = msg;
    if (Array.isArray(id)) {
      id.forEach(it => {
        f(dependencies, it.toString(), msg);
      });
    } else {
      f(dependencies, id.toString(), msg);
    }
  } catch (e) {
    logger.error(`Error in mark consumer with detail ${e}`);
  }
}

async function start() {
  const configuration = readConfiguration();
  const mode = configuration.mode;
  const executors = {};
  executors[`vc`] = videoConvert;
  executors[`oa`] = find;
  const dependencies = {
    logger: createLogger(configuration.components.elasticsearch, configuration.components.rabbitmq, mode, 'queue'),
    database: new Database(new DatabaseConfiguration(mode, configuration.components.elasticsearch, configuration.aws)),
    batch: new AWS.Batch(configuration.aws),
    createQueueService: createQueueService(mode, configuration.components.rabbitmq),
    mode
  };
  const {logger} = dependencies;

  dependencies.createQueueService.then(queueService => {
    [`vc`, `oa`, `ap`].forEach(queue => {
      logger.info(`Create consumer ${queue}`)
      queueService.consume(queue, async (msg) => {
        setTimeout(async () => {
          await executeEvents(dependencies, JSON.parse(msg), queue, executors[queue]);
        }, 60 * 1000);
      }, { noAck: true });
    });
  });

  logger.info(`Video queue was started`);
}

start();