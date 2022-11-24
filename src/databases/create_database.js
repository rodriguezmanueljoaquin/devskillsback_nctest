const fs = require('fs');
const { Client } = require('pg');
const { exit } = require('process');

let postgres;

init();

function init(){
    (async() => {
        await createDatabase().then(async() =>{
            postgres.end();
        })
    })();
}

async function getDBConnection(){
    let credentials = JSON.parse(fs.readFileSync('src/databases/credentials.json'));
    console.log(credentials)
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

async function createDatabase(){
    postgres = await getDBConnection();
    
    console.log('Connection succesfully to PostgreSQL database');
    
    //creation of tables
    var createTablesQuery = fs.readFileSync('src/databases/create_tables.sql').toString();
    await postgres.query(createTablesQuery)

    .catch((e) => {
        console.log(`Error creating import tables: ${e}`);
        postgres.end();
        process.exit(-1);
    });

    console.log('Tables succesfully created');
}
