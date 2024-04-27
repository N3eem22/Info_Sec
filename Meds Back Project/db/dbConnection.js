const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    timezone: 'utc',
    user: 'root',
    password: '',
    database: 'meds_project',
    port: '3306',
});

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connected to mysql");
});

module.exports = connection;