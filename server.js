const express = require('express');
const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const { searchAlgerianLeads } = require('./bot');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Automatic RAM memory cleanup
function clearMemory() {
    if (global.gc) {
       global.gc();
       console.log('🧹 [RAM Cleaned]: Garbage collector executed successfully.');
    } else {
       console.log('ℹ️ RAM GC is not exposed. Ensure node runs with --expose-gc');
    }
}

setInterval(clearMemory, 20 * 60 * 1000);

// Initialize WhatsApp Client with Local Session Authentication
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       headless: true,
       args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Generate QR Code in Railway Logs for WhatsApp connection
client.on('qr', (qr) => {
    console.log('📱 [WHATSAPP QR]: Scan this QR code with your phone to link the agency bot:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ [WHATSAPP READY]: Agency WhatsApp bot is successfully connected and online!');
});

// Handle incoming WhatsApp messages automatically
client.on('message', async (message) => {
    try {
       // Only respond to private chats or targeted leads
       if (message.from.endsWith('@c.us')) {
          const senderPhone = message.from;
          const userMsg = message.body;

          console.log(`📩 WhatsApp Message from [${senderPhone}]: ${userMsg}`);

          // Generate persuasive reply
          const aiReply = await generatePersuasiveReply("صاحب المحل", userMsg);

          // Send reply back to client
          await message.reply(aiReply);
          console.log(`📤 Reply sent successfully to ${senderPhone}`);

          clearMemory();
       }
    } catch (error) {
       console.error('Error handling WhatsApp message:', error.message);
    }
});

// Start WhatsApp Client
client.initialize();

// AI model for psychological and emotional persuasion
async function generatePersuasiveReply(name, userMsg) {
    return `السلام عليكم خويا. راني فهمت مليح واش راك حاب، تبارك الله النشاط تاعك ماشي، بصح خليني نحكيهالك صراحة: راك تضيع في زبائن كبار كل يوم يلوجو على خدمتك في جوجل ويرو عند المنافس خاطر ما عندكش واجهة رسمية تليق بيك. تخيل محل مفتوح 24/7 يجيبلك الناس حتى لعندك. واش رايك نوريك نموذج حقيقي لخدمتنا وكيفاش يقدر يغير لك المبيعات؟`;
}

app.get('/', (req, res) => {
    res.send('DZ Autonomous AI Agency & WhatsApp Bot Engine is running live on Railway 🚀');
});

app.listen(PORT, () => {
    console.log(`Agency Server is running smoothly on port ${PORT}`);
});
