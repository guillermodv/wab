const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', msg => {
    console.log('MESSAGE RECEIVED', msg.body);
    const {waveform} = msg._data;
    if (waveform) {
        msg.reply('No! escucho audio gracias.');
    }
});

let rejectCalls = true;

client.on('call', async (call) => {
    if (rejectCalls) await call.reject();
    //const media = await MessageMedia.fromUrl('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTspjbS2voxdjnG6sYxChAlTZ6a_4_kBs30dg&usqp=CAU');
    //client.sendMessage(media);
    await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected.' : ''}`);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.initialize();
