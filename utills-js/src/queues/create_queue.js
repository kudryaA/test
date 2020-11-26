const {QueueService} = require('./queue_service');
const {rabbitmq} = require('./rabbitmq');

/**
 * Create queue service
 * @param {String} mode
 * @param {Object} configuration
 * @return {Promise<QueueService>}
 */
exports.createQueueService = async (mode, configuration) => {
  let queueService = new (await rabbitmq(mode, configuration));
  return queueService;
};