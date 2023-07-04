// import pkg from 'pg';
const  Pool  = require('pg').Pool;

//Now access Pool constructor object from PG
// const { Pool } = pkg;
 
const pool = new Pool({ 
    host: 'localhost',
    user: 'postgres',
    password: 'lowkey',
    database: 'dbuser',
    port: 5432,
    max: 20,  
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool