const { Client, LocalAuth } = require('whatsapp-web.js');
 
const qrcode = require('qrcode-terminal');


const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr);
});

client.on('authenticated', () =>{
  console.log('AUTHENTICATED');
});

client.on('ready', () => {
  console.log('Client is ready!');
});


client.on('message', msg => {
  if (msg.body == '!ping') {
    msg.reply('Hey There !! Whatsapp Bot under Developmnet');
  } else if (msg.body == 'ul'){
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
  } else if (msg.body == 'Lek'){
    msg.reply("Hey There !! Whatsapp Bot under Developmnet");
  }
});

client.initialize();