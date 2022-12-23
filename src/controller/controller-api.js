// const config = require('../config/db');
// const mysql = require('mysql');
// const pool = mysql.createPool(config);

// pool.on('error', (err) => {
//   console.log(err);
// })



// module.exports = {
//   getReply,
//   reply(req, res) {
//     let Brg_kode = req.params.Brg_kode;
//     pool.getConnection(function (err, connection) {
//       if (err) throw err;
//       connection.query(
//         `
//         SELECT * FROM tbarang WHERE Brg_kode = ?
//         `
//         , [Brg_kode],
//         function (error, results) {
//           if (error) throw error;
//           res.send({
//             success: true,
//             message: "Berhasil",
//             data: results
//           })
//         })
//         connection.release();
//     })
//   }

// }

