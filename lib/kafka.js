const { Kafka } = require('kafkajs')

const config = process.env.RUNNING_LOCAL ? {
  clientId: 'my-app',
  brokers: process.env.KAFKA_BROKERS.split(","),
} : {
  clientId: 'my-app',
  brokers: process.env.CLOUDKARAFKA_BROKERS.split(","),
  ssl: {
    rejectUnauthorized: false,
    ca: [process.env.CLOUDKARAFKA_CA]
  },
  sasl: {
    mechanism: 'scram-sha-256', //  or scram-sha-512
    username: process.env.CLOUDKARAFKA_USERNAME,
    password: process.env.CLOUDKARAFKA_PASSWORD
  },
}

const kafka = new Kafka(config)

module.exports = kafka;
