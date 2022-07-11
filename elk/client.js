const { Client } = require("@elastic/elasticsearch");
require('dotenv').config()

const ELK_URL = process.env.ELK_URL || 'http://localhost:49153'

const client = new Client({ node: ELK_URL });

/*Check the elasticsearch connection */
async function health() {
    let connected = false;
    while (!connected) {
        console.log("Connecting to Elasticsearch");
        try {
            const health = await client.cluster.health({});
            connected = true;
            console.log(health.body);
            await run()
            console.log(await client.indices.exists({ index: 'game-of-thrones' }))
            const body  = await client.search({
                index: 'game-of-thrones',
                body: {
                    query: {
                        match: { quote: 'Winter' }
                    }
                }
            })
            console.log(body.hits.hits)
            return health;
        } catch (err) {
            console.log("ES Connection Failed", err);
        }
    }
}

async function run() {
    await client.index({
        index: 'game-of-thrones',
        body: {
            character: 'Ned Stark',
            quote: 'Winter is coming.'
        }
    })

    await client.index({
        index: 'game-of-thrones',
        body: {
            character: 'Daenerys Targaryen',
            quote: 'I am the blood of the dragon.'
        }
    })

    await client.index({
        index: 'game-of-thrones',
        body: {
            character: 'Tyrion Lannister',
            quote: 'A mind needs books like a sword needs whetstone.'
        }
    })
console.log('after insert')
    await client.indices.refresh({ index: 'game-of-thrones' })
   
}

health();
