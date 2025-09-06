const {Pool}= require("pg");

const pool=new Pool({
    connectionString:"postgresql://postgres:axios@localhost:5432/Odoo1?sslmode=disable"
})

module.exports=pool;

