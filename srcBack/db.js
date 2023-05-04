const {Pool} = require("pg");

const db = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5433,
    database: "TerniumTalentDB",
});

module.exports = db;