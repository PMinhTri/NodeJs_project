const { connection } = require('mongoose');
const mysql = require('mysql');

var connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '19042001',
    database: 'testing'
});

module.exports = connect.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Connected');
    }
});
