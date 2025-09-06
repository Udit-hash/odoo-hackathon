import {Pool} from 'pg'

const pool=new Pool({
    connectionString:"postgresql://postgres:axios@localhost:5432/mydatabase?sslmode=disable"
})

export default pool;

