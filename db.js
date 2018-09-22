require('dotenv').config();
class db {
    constructor() {}
    connection(mysql) {

        var con = mysql.createPool({
            connectionLimit: 100,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
            multipleStatements: true
        });
        return con;
    }
}

module.exports = new db();