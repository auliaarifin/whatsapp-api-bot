const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const { url } = require('inspector');

const app = express();
const server = http.createServer(app);
const io = socketIO(server)

const client = new Client({
  authStrategy: new LocalAuth()
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})


client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});


client.on('message', msg => {
  if (msg.body == '!ping') {
    msg.reply('Hey There !! Whatsapp Bot under Developmnet');
  } else if (msg.body == 'ul') {
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
  } else if (msg.body == 'Lek') {
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
  }
});

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