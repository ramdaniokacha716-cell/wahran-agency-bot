const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR code received, scan please!');
});

client.on('ready', () => {
    console.log('Client is ready!');

    cron.schedule('0 10 * * *', async () => {
       try {
          const targetNumber = '213XXXXXXXXX@c.us';
          const proactiveMessage = 'Hello! Welcome to our agency, how can we help you today?';
          await client.sendMessage(targetNumber, proactiveMessage);
          console.log('Proactive message sent successfully!');
       } catch (error) {
          console.error('Error sending proactive message:', error);
       }
    });
});

client.on('message', async msg => {
    try {
       if (msg.body) {
          const chat = await msg.getChat();
          const result = await model.generateContent(msg.body);
          const response = await result.response;
          const text = response.text();
          await chat.sendMessage(text);
       }
    } catch (error) {
       console.error('Error handling message:', error);
    }
});

client.initialize();

