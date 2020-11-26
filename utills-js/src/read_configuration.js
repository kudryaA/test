/**
 * Get properties
 */
exports.readConfiguration = () => {
    return {
      mode: process.env.MODE,
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      },
      telegram: {
        token: process.env.TELEGRAM_TOKEN
      },
      components: {
        elasticsearch: {
          host: process.env.ELASTICSEARCH_HOST,
          port: Number(process.env.ELASTICSEARCH_PORT),
          protocol: process.env.ELASTICSEARCH_PROTOCOL,
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
        rabbitmq: {
          host: process.env.RABBITMQ_HOST,
          login: process.env.RABBITMQ_USERNAME,
          password: process.env.RABBITMQ_PASSWORD
        }
      }
    };
  };