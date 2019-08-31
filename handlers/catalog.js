const {kafka, prefix} = require('../lib/kafka');

const topic = `${prefix}UpsertProduct`;
const consumer = kafka.consumer({groupId: 'catalog'})
const products = {};

const startup = async () => {
  
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
      "foo": "bar",
      "test": Object.values(products).length,
      products
    })
  }
}
