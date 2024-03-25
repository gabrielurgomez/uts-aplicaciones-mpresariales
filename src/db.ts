import { createPool } from "mysql2/promise"
import { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from './config'

const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT),
    database: DB_DATABASE
})

export { pool }