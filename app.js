const { Client, LocalAuth, MessageMedia, Buttons, List } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const cron = require('node-cron')
const { body, validationResult } = require('express-validator');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
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
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.initialize();

//socket IO

io.on('connection', function (socket) {
  socket.emit('message', 'Connecting....')

  //barcode
  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code Recived, silahkan scan')
    });
  });

  client.on('ready', () => {
    socket.emit('message', 'Whatsapp is ready!')
  })

})


const media = MessageMedia.fromFilePath('./media/kapal.png')
const db = require('./src/config/db');


client.on('message', async msg => {
  const keyword = msg.body.toLowerCase();
  const replyMessage = await db.getReply(keyword);


  if (replyMessage !== false) {
    msg.reply(replyMessage);

  } else if (msg.body == 'Tes') {
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
    client.sendSeen();
  } else if (msg.body === 'cek') {
    client.sendMessage(msg.from, "Hey There !! Whatsapp Bot under Developmnet"),
      client.sendSeen();
  } else if (msg.body.startsWith('!sendto')) {
    let number = msg.body.split(' ')[1];
    let messageIndex = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes('@c.us') ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendMessage();
    client.searchMessages(number, message);
  } else if (msg.body == '!media') {
    client.sendMessage(msg.from, media, { caption: `Here's\n your requested media.` });
  } else if (msg.body === '!buttons') {
    let button = new Buttons(
      'Button body',
      [
        { body: 'whatsapp-web.js', url: 'https://wwebjs.dev/' },
        { body: 'Call me', number: '+62 (805) 457-4992' },
        { body: 'third special button', number: '+1 (202) 968-6161' },// Limited to 2 especial buttons, this one will be ignored
        { body: 'Some text' },
        { body: 'Another text' },
        { body: 'Another another text' },
        { body: 'Fourth button' }// Limited to 3 regular buttons, this one will be ignored
      ],
      'title',
      'footer'
    );

    client.sendMessage(msg.from, button);
    console.log('message','terkirim');
  } else if (msg.body === '!list') {
    let sections = [{

      title: 'Selamat Datang Lorem Ipsum',
      rows: [
        { title: 'Judul 2', description: 'Cara memakai Whatsapp API' },
        { title: 'Judul 3', description: 'Cara memakai Whatsapp API' }
      ]
    }];
    let list = new List('Whatsaapp', 'Button Tombol', sections, 'Title', 'footer');
    client.sendMessage(msg.from, list);
  }
});

// const {kontak, pesan} = kontak

app.post('/send-message', (req, res) => {
  let number = req.body.number;
  let message = req.body.message;

  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err,
    });
  });
});

server.listen(3000, function () {
  console.log('Running on port 3000')
})

// cron.schedule('* * * * * *', () =>{
//   console.log('Testing scheduler')
// })
