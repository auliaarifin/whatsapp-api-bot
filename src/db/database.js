const mysql = require('mysql2/promise');


const createConnection = async () => {
  return await mysql.createConnection({
    host : '192.168.1.70',
    user : 'root',
    password : 'password',
    database : 'kencanaprint'
  });
}

const getReply = async (Brg_kode) => {
  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT * FROM tbarang WHERE Brg_kode = ? ', [Brg_kode]);
  if (rows.length > 0) return rows[0].message; 
  return false;
}


module.exports = {
createConnection,
getReply
}