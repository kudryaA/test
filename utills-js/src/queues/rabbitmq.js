const amqp = require('amqplib/callback_api');
const amqplib = require('amqplib');

const {QueueService} = require('./queue_service');

/**
 * Create rabbitmq class
 * @param {String} mode
 * @param {object} configuration
 * @return {Promise<{new(): {consume(*)}, prototype: {consume(*)}}>}
 */
exports.rabbitmq = async (mode, configuration) => {
  const opt = {
    credentials: amqplib.credentials.plain(configuration.login, configuration.password)
  };
  const channel = await new Promise((resolve, reject) => {
    amqp.connect(`amqp://${configuration.host}`, opt, (error0, connection) => {
      if (error0) {
        const message = `Error in creation connection to rabbitmq with ${JSON.stringify(error0)}`;
        console.log(message);
        reject(message);
      }
      console.log('Create connection to rabbitmq successful');
      connection.createChannel(async (error1, channel) => {
        if (error1) {
          const message = `Error in creation channel to rabbitmq with ${JSON.stringify(error1)}`;
          console.log(message);
          reject(message);
        }
        console.log('Create channel to rabbitmq successful');
        resolve(channel);
      });
    });
  });
  return class extends QueueService {
    consume(queu, func) {
      const queue = `${mode}-${queu}`;
      channel.assertQueue(queue, {
        durable: true
      });
      channel.consume(queue, async (msg) => {
        await func(msg.content.toString());
      }, {
        noAck: true
      });
    }
    produce(queu, string) {
      const queue = `${mode}-${queu}`;
      channel.assertQueue(queue, {
        durable: true
      });
      return channel.sendToQueue(queue, Buffer.from(string), { persistent: true });
    }
  };
};