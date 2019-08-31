const {kafka, prefix} = require('../lib/kafka');

const topic = `${prefix}UpsertProduct2`;
const products = {};

let _processName = "";

const startup = async (processName) => {
    _processName = processName
    const consumer = kafka.consumer({groupId: processName})
    await consumer.subscribe({ topic, fromBeginning: true })    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const product = JSON.parse(message.value)
          products[product.sku] = product;
        },
    })    
    await consumer.seek({ topic, partition:0, offset: 0 })
}

module.exports = {
  startup,
  handler: (req, res) => {
    res.json({
      "foo": _processName,
      "test": Object.values(products).length,
      products
    })
  }
}
