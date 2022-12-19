const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const cron = require('node-cron')
const {body, validationResult } = require('express-validator');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));


const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      // '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  authStrategy: new LocalAuth()
});



app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})


client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

const db = require('./src/config/db');
const { response } = require('express');

client.on('message', async msg => {
  const keyword = msg.body.toLowerCase();
  const replyMessage = await db.getReply(keyword);

  if (replyMessage !== false ) {
    msg.reply(replyMessage);

  } else if (msg.body == 'Tes') {
    msg.sendMessage(msg.from, "Hey There !! Whatsapp Bot under Developmnet");
  }
});

// //Send Message
// app.post('/send-message', [
//   body('number').notEmpty,
//   body('message').notEmpty,
// ], (req, res) =>{
//   const error = validationResult(req).formatWith(({}) => {
//     return msg;
//   });

//   if (!error.isEmpty()){
//     return res.status(422).json({
//       status: false,
//       message: errors.mapped()
//     })
//   }

//   const number = req.body.number;
//   const message = req.body.message;

//   client.sendMessage(number, message).then(response => {
//     res.status(200).json({
//       status: true,
//       response: response
//     });
//   }).catch(err => {
//     res.status(500).json({
//       status: false,
//       response: err,
//     });
//   });
// });

client.initialize();

//socket IO

io.on('connection', function(socket){
  socket.emit('message', 'Connecting....')

  //barcode
  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr,(err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code Recived, silahkan scan')
    });
  });

  client.on('ready',()=>{
    socket.emit('message', 'Whatsapp is ready!')
  })
  
})
server.listen(3000, function () {
  console.log('Running on port 3000')
}) 

// cron.schedule('* * * * * *', () =>{
//   console.log('Testing scheduler')
// })
