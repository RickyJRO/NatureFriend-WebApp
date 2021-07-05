
const {Client, Pool} = require('pg');
require('dotenv').config();

const devConfig = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DATABASE}`


const proConfig = process.env.DATABASE_URL


const db = new Pool({connectionString : process.env.NODE_ENV === "production" ? proConfig : devConfig})
module.exports = db;