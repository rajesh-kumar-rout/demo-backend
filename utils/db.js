import mysql from "mysql2/promise"
import { config } from "dotenv"

config()

let connection = null

mysql.createConnection({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
})
    .then(db => {
        connection = db
    })
    .finally(() => {
        connection.config.namedPlaceholders = true
    })

export const fetchAll = async (sql, bindings = []) => {
    const [result] = await connection.execute(sql, bindings)
    return result
}

export const fetch = async (sql, bindings = []) => {
    const [result] = await connection.execute(sql, bindings)
    return result[0] ?? null
}

export const insert = async (sql, bindings = []) => {
    const [result] = await connection.execute(sql, bindings)
    return result.insertId
}

export const query = async (sql, bindings = []) => {
    const [result] = await connection.execute(sql, bindings)
    return result.affectedRows
}

