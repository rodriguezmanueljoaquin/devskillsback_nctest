const fs = require('fs');
const { Client } = require('pg');
const { exit } = require('process');

let _client;

function getDB() {
    if (_client) {
      return _client;
    }
    throw new Error("PostgreSQL: No database found!");
};

async function closeConnection() {
    if(_client) {
        await _client.close();
        return;
    }
    throw new Error("PostgreSQL: No connection was found!");
}

async function startDBConnection(){
    let credentials = JSON.parse(fs.readFileSync('src/databases/credentials.json'));
    const client = new Client(credentials);

    try{
        await client.connect();
        return client;
    }
    catch(e){
        console.error(`Failed to connect ${e}`)
        exit(-1)
    }

}

async function connect(){
    _client = await startDBConnection();
    
    console.log('Connection succesfully to PostgreSQL database');
    
    //creation of tables
    var createTablesQuery = fs.readFileSync('src/databases/create_tables.sql').toString();
    await _client.query(createTablesQuery)

    .catch((e) => {
        console.log(`Error creating import tables: ${e}`);
        _client.end();
        _client.exit(-1);
    });

    console.log('Tables succesfully created');
}

module.exports = {
    connect,
    getDB,
    closeConnection
}