const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron'); // مكتبة المبادرة والرسائل المجدولة

// Initialize Gemini AI client correctly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR code received, scan please!');
});

client.on('ready', () => {
    console.log('Client is ready!');

// --- ميزة الـ Proactive (المبادرة الاستباقية) ---
// مثال: إرسال رسالة تلقائية استباقية في وقت محدد (قم بتعديل الرقم والوقت حسب رغبتك)
// التوقيت الحالي هنا مبرمج ليعمل يومياً، يمكنك تعديله أو تفعيله لاحقاً
    cron.schedule('0 10 * * *', async () => {
       try {
          const targetNumber = '213XXXXXXXXX@c.us'; // ضع رقم العميل هنا مع الرمز الدولي
          const proactiveMessage = 'مرحباً! معك وكالة الخدمات، هل تحتاج إلى مساعدة في مشروعك اليوم؟';
          await client.sendMessage(targetNumber, proactiveMessage);
          console.log('Proactive message sent successfully!');
       } catch (error) {
          console.error('Error sending proactive message:', error);
       }
    });
});

// استقبال الردود والتفاعل الذكي مع العملاء
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
