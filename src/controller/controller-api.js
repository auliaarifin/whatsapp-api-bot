const getReply = async (user_kode) => {
  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT user_password FROM tuser WHERE user_kode = ? ', [user_kode]);
  if (rows.length > 0) return rows[0].message; 
  return false;
}

module.exports = {
  getReply,
}