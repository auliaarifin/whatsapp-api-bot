const { Client, LocalAuth, MessageMedia, Buttons, List } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const cron = require('node-cron')
const { body, validationResult } = require('express-validator');
const {phoneNumberFormatter} = require('./helpers/formater');



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

client.on('message', (msg) => {
  console.log(` berkata : ${msg.body}`)
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
  });
})

client.on('message', async (msg) => {
  if (msg.body.startsWith('!sticker') && msg.type === 'image') {
    const media = await msg.downloadMedia();
    client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: 'My-WA-BOT'
    })
  }
});


const media = MessageMedia.fromFilePath('./media/kapal.png')
const db = require('./src/config/db');
const { response } = require('express');


client.on('message', async msg => {
  const keyword = msg.body.toLowerCase();
  const replyMessage = await db.getReply(keyword);
  const media = await msg.downloadMedia;

  //Database
  if (replyMessage !== false) {
    msg.reply(replyMessage);

  } else if (msg.body == 'Tes') {
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
    client.sendSeen();
  } else if (msg.body.toLocaleLowerCase === 'cek') {
    client.sendMessage(msg.from, "Hey There !! Whatsapp Bot under Developmnet"),
      client.sendSeen();

    //media

  } else if (msg.body == '!media') {
    client.sendMessage(msg.from, media, { caption: `Here's\n your requested media.` });

    //list

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
  } else if (msg.body === '!groupinfo') {
    let chat = await msg.getChat();
    if(chat.isGroup){
      msg.reply(`

      Name        : ${chat.name},
      Description : ${chat.description},
      created At  : ${chat.createdAt.toString()},
      Participant : ${chat.participants.length},
      "Testing Whatsapp Gateway"
      `);
    } else {
      msg.reply('This command can only be used in Group')
    }
  } else if (msg.body === '!info'){
    let info = client.info;
    client.sendMessage(msg.from, `
      *Connection info*
      User name: ${info.pushname}
      My number: ${info.wid.user}
      Platform: ${info.platform}
    `)
  } 
}
);

// const {kontak, pesan} = kontak



//send-message
app.post('/send-message', (req, res) => {
  let number = phoneNumberFormatter(req.body.number);
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

// //send-media
// app.post('/send-media', async (req, res) => {
//   let number = phoneNumberFormatter(req.body.number);
//   let caption = req.body.caption;
//   let fileUrl = req.body.file;

//   let mimetype;
//   const attachment = await axios.get(fileUrl, {
//     responseType: 'arraybuffer'
//   }).then(response => {
//     mimetype = response.headers['content-type'];
//     return response.data.toString(base64);
//   });

//   const media = new MessageMedia(mimetype, attachment, 'Media');

//   client.sendMessage(number, media, {
//     caption: caption
//   }).then(response => {
//     res.status(200).json({
//       status : true,
//       respones: response
//     });
//   }).catch(err => {
//     res.status(500).json({
//       status: false,
//       respones: err
//     });
//   });
// })



// //send group
// const findGroupByName = async function(name) {
//   const group = await client.getChats().then(chats => {
//     return chats.find(chat => 
//       chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
//     );
//   });
//   return group;
// }

// // Send message to group
// // You can use chatID or group name, yea!
// app.post('/send-group-message', [
//   body('id').custom((value, { req }) => {
//     if (!value && !req.body.name) {
//       throw new Error('Invalid value, you can use `id` or `name`');
//     }
//     return true;
//   }),
//   body('message').notEmpty(),
// ], async (req, res) => {
//   const errors = validationResult(req).formatWith(({
//     msg
//   }) => {
//     return msg;
//   });

//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       status: false,
//       message: errors.mapped()
//     });
//   }

//   let chatId = req.body.id;
//   const groupName = req.body.name;
//   const message = req.body.message;

//   // Find the group by name
//   if (!chatId) {
//     const group = await findGroupByName(groupName);
//     if (!group) {
//       return res.status(422).json({
//         status: false,
//         message: 'No group found with name: ' + groupName
//       });
//     }
//     chatId = group.id._serialized;
//   }

//   client.sendMessage(chatId, message).then(response => {
//     res.status(200).json({
//       status: true,
//       response: response
//     });
//   }).catch(err => {
//     res.status(500).json({
//       status: false,
//       response: err
//     });
//   });
// });



server.listen(3000, function () {
  console.log('Running on port 3000')
})

// cron.schedule('* * * * * *', () =>{
//   console.log('Testing scheduler')
//   app.post('/kirim-pesan')
// })
