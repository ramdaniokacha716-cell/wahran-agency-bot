const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
let latestQR = '';

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// إعداد عميل واتساب مع حفظ الجلسة لكي لا يطلب مسح الرمز كل مرة
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       headless: true,
       args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
       ]
    }
});

client.on('qr', (qr) => {
latestQR = qr; // حفظ الرمز لعرضه كصورة واضحة في المتصفح
    console.log('[📱] WhatsApp QR Code Generated! Scan it from your web browser link.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ [WhatsApp Connected]: Your phone is successfully linked to DZ AI Agency!');
// يمكنك تشغيل دورة البحث الآلي هنا فور اتصال الواتساب إذا رغبت
    // runNational69Search();
});

client.initialize();

// خطة تغطية الـ 69 ولاية كاملة
const all69WilayasSchedule = {
    Saturday: { wilayas: ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Aflou"], activities: ["Startups & Tech", "Hotels & Tourism", "Pharmacies"] },
    Sunday: { wilayas: ["Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Barika", "El Kantara"], activities: ["Pizzerias & Restaurants", "Tailoring Workshops", "Wedding Halls"] },
    Monday: { wilayas: ["Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Bir El Ater", "El Aricha"], activities: ["Bazaars", "Women clothing stores", "Real Estate"] },
    Tuesday: { wilayas: ["Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Ksar El Boukhari", "Ain Oussera"], activities: ["Factories & Industries", "Showrooms", "Supermarkets"] },
    Wednesday: { wilayas: ["Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Messaad", "Boussaada"], activities: ["Clinics", "Hotels", "Cafes & Decor"] },
    Thursday: { wilayas: ["Souk Ahras", "Tipasa", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "El Abiodh Sidi Cheikh"], activities: ["Local businesses", "Craftsmen", "Traditional markets"] },
    Friday: { wilayas: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Setif"], activities: ["Tech Startups", "Wedding Halls", "Hotels"] }
};

// دالة تأخير عشوائي ذكية (لتفادي الحظر تماماً ومحاكاة السرعة البشرية بين 45 إلى 120 ثانية)
    function smartRandomDelay() {
    const minSeconds = 45;
    const maxSeconds = 120;
    const randomMs = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
    return new Promise(resolve => setTimeout(resolve, randomMs));
}

// دالة التحقق من أوقات العمل
function checkWorkingHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;

    const morningStart = 9 * 60 + 30; // 09:30
    const morningEnd = 13 * 60; // 13:00
    const eveningStart = 14 * 60; // 14:00
    const nightEnd = 24 * 60; // 00:00

    return (currentTimeVal >= morningStart && currentTimeVal <= morningEnd) ||
       (currentTimeVal >= eveningStart && currentTimeVal < nightEnd);
}

// دالة صيانة الذاكرة الليلية
function runNightMaintenanceRoutine() {
    console.log(`🌙 [Night Maintenance]: Purging uninterested leads, optimizing RAM, and cleaning database...`);
    if (global.gc) {
       global.gc();
       console.log(`🧹 [RAM Cleaned]: Garbage collector executed successfully.`);
    }
}

// الوظيفة الرئيسية: جلب العملاء، إنشاء مواقع 3D، وإرسال الرسائل عبر واتساب بفاصل زمني آمن
async function runNational69Search() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;
    const morningStart = 9 * 60 + 30;

    if (currentTimeVal < morningStart) {
       runNightMaintenanceRoutine();
       return { status: "Night maintenance mode active", sentMessages: 0 };
    }

    if (!checkWorkingHours()) {
       console.log(`⏳ [Paused]: Shift break (13:00 - 14:00).`);
       return { status: "Paused for shift break", sentMessages: 0 };
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[now.getDay()];
    const plan = all69WilayasSchedule[todayName];

    if (!plan) return { status: "Rest day", sentMessages: 0 };

    console.log(`🚀 [DZ Autonomous Agency Engine]: Starting WhatsApp outreach for [${todayName}]...`);
    let sentCount = 0;

    for (const wilaya of plan.wilayas) {
     for (const activity of plan.activities) {
       if (!checkWorkingHours()) break;

       console.log(`📍 Scanning Wilaya: ${wilaya} | Sector: ${activity}`);
       const realLeads = await fetchRealBusinessLeads(wilaya, activity);

       for (const lead of realLeads) {
          const clientWebsiteUrl = `https://webcraft-dz.github.io/client-${lead.id}-3d`;
          const clientQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(clientWebsiteUrl)}`;
          const persuasiveMessage = generateElitePitch(lead.name, lead.activity, clientWebsiteUrl, clientQrCodeUrl);

// محاولة إرسال الرسالة عبر الواتساب مع تطبيق الحماية الزمنية
          try {
              const chatId = `${lead.phone.replace(/[^0-9]/g, '')}@c.us`;

              console.log(`🛡️ [Anti-Ban Protection]: Waiting for random safety delay before sending...`);
              await smartRandomDelay();

              await client.sendMessage(chatId, persuasiveMessage);
              sentCount++;
              console.log(`✅ [WhatsApp Sent]: Successfully messaged ${lead.name} in ${wilaya}`);
            } catch (error) {
              console.error(`❌ [WhatsApp Error]: Failed to send to ${lead.name}:`, error.message);
            }
          }
       }
    }

    console.log(`🎉 Completed batch. Sent ${sentCount} secure WhatsApp pitches.`);
    return { status: "Completed", sentMessages: sentCount };
}

async function fetchRealBusinessLeads(wilaya, activity) {
    return [
       {
          id: Math.floor(Math.random() * 100000),
          name: `${activity} Al-Baraka ${wilaya}`,
          activity: activity,
          phone: "213500000000" // استبدلها لاحقاً برقم حقيقي للاختبار
       }
    ];
}

function generateElitePitch(businessName, activity, websiteUrl, qrUrl) {
    return `السلام عليكم خويا صاحب ${businessName} (${activity}). تبارك الله النشاط تاعك راهو ماشيي، بصح خليني نحكيهالك صراحة وعينك تشوف: راك تضيع في عشرات الزبائن الكبار كل يوم يلوجو على خدمتك في غوغل وما يصيبوكش، ويرو عند المنافس خاطر ما عندكش واجهة رسمية.
حنا في وكالة "Webcraft" خدمنالك خصيصاً **موقع إلكتروني عصري بتصاميم وأزرار ثلاثية الأبعاد (3D)** يليق بمقدار نشاطك باش يبان المحل تاعك فخم ومفتوح 24/7!
🔗 تقدر تدخل تشوف نموذج موقعك الحصري هنا:
${websiteUrl}
📱 وهذ هو رمز الـ QR الخاص بموقعة تقدر تطبعو وتحطو في المحل باش الزبون يسكانيه برك يدخل عندك:
${qrUrl}
واش رايك نفعلو لك نهائياً اليوم ونجيبولك الزبائن حتى لباب محلك؟`;
}

// --- صفحة الويب لعرض رمز الـ QR كصورة نقية وكاملة ---
app.get('/', (req, res) => {
    if (!latestQR) {
      return res.send(`
          <div style="text-align:center; font-family:Tahoma; margin-top:50px;">
               <h2>🤖 البوت يعمل الآن، جاري توليد رمز الـ QR... يرجى تحديث الصفحة بعد ثوانٍ.</h2>
          </div>
       `);
    }
    res.send(`
       <div style="text-align:center; font-family:Tahoma; margin-top:40px;">
            <h2>📱 امسح رمز الـ QR الخاص بوكالة وهران بسهولة</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(latestQR)}" alt="QR Code" style="border: 5px solid #007bff; border-radius: 15px; padding: 15px; background: white;" />
            <p style="margin-top:20px; color:#555; font-size:18px;">وجه كاميرا هاتفك نحو هذه الصورة المباشرة لتتصل الوكالة وتهب لخدمة العملاء فورا!</p>
       </div>
    `);
});

// تشغيل سيرفر الويب على المنفذ المخصص للمنصة
app.listen(8080, '0.0.0.0', () => {
    console.log(`Agency Web Server is running on port ${8080`);
});

module.exports = {
    searchAlgerianLeads: runNational69Search
};
