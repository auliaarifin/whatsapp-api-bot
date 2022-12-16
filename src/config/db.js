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
  const [rows] = await connection.query('SELECT ket FROM jobit WHERE nmr_jobit = ? ', [keyword]);
  if (rows.length > 0) return rows[0].ket;
  return false;
}

module.exports = {
  con,
  getReply
}