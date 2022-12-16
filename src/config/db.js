const mysql = require('mysql2/promise')

let con = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jobkp'
  });
}

const getReply = async (keyword) => {
  const connection = await con();
  const [rows] = await connection.execute('SELECT COUNT(nmr_jobit) AS message FROM jobit WHERE nmr_jobit = ? ', [keyword]);
  if (rows.length > 0) return rows[0].message;
  return false;
}

module.exports = {
  con,
  getReply
}