/**
 * Class QueueService
 * @type {QueueService}
 */
exports.QueueService = class {

  /**
   * Consume from queue
   * @param {string} queue
   * @param {function} fun
   */
  consume(queue, fun) {
    throw 'Not initial method';
  }


  /**
   * Produce to queue
   * @param {string} queue
   * @param {string} string
   */
  produce(queue, string) {
    throw 'Not initial method';
  }
};