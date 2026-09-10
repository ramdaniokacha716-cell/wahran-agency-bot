const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenAI } = require('@google/genai');
const cron = require('node-cron');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Clear old session data on startup to generate a new QR code automatically
const authDir = path.join(__dirname, '.wwebjs_auth');
if (fs.existsSync(authDir)) {
    try {
       fs.rmSync(authDir, { recursive: true, force: true });
       console.log('✔ Old session cleaned successfully to generate a new QR.');
    } catch (err) {
       console.log('⚠ Notice regarding cleaning old session:', err.message);
    }
}

// Gemini API Configuration
const GEMINI_API_KEY = "AQ.AbBRN6L2NqkhS4VAFudTH-gGEc28oYga1WwavU2ro2vex11Big";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
       headless: false,
       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

// Temporary memory for client conversations
const conversationHistory = {};

// Default website price configuration
const WEBSITE_PRICE = "80000ZD";

async function scrapeGoogleMaps(query) {
    const browser = await puppeteer.launch({
       headless: true,
       args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      await page.waitForTimeout(5000);

      let leads = await page.evaluate(() => {
           let results = [];
           let items = document.querySelectorAll('div[role="feed"] > div > div[jsaction]');
           items.forEach(item => {
              let nameElement = item.querySelector('.fontHeadlineSmall');
              let phoneElement = item.querySelector('[data-item-id^="phone:tel:"]');
              if (nameElement) {
                 results.push({
                    name: nameElement.innerText,
                    phone: phoneElement ? phoneElement.getAttribute('data-item-id').replace('phone:tel:', '') : null
                });
             }
          });
          return results;
       });

       await browser.close();

       if (leads.length === 0) {
          leads = [
             { name: "مطعم الوجبات السريعة وهران", phone: "213XXXXXXXXX" },
             { name: "مجوهرات الباهية", phone: "213XXXXXXXXX" }
          ];
      }

       return leads;
    } catch (error) {
       console.error('Error during scraping:', error.message);
       await browser.close();
       return [
          { name: "مطعم الوجبات السريعة وهران", phone: "213XXXXXXXXX" },
          { name: "مجوهرات الباهية", phone: "213XXXXXXXXX" }
       ];
    }
}

// Automatically generate and print QR code in the terminal
client.on('qr', (qr) => {
    console.log('\n--------------------------------------------------');
    console.log('✔ New QR generated automatically. Scan it with your phone to link the agency!');
    console.log('--------------------------------------------------\n');
    qrcode.generate(qr, { small: false });
});

client.on('ready', () => {
    console.log('\n✔ System is now fully operational with AI and Auto-Pricing linked successfully to Webcraft Agency.');

    // Scheduled automated task (9:30 AM to 12:30 PM and 1:30 PM to 00:00 AM)
    cron.schedule('0 10 * * *', async () => {
       console.log('...Starting daily automated scraping across Algerian territory and sending proposals with prices.');
       const targetLeads = await scrapeGoogleMaps("مطاعم, وهران, شركات, مطاعم, فنادق");

       for (const lead of targetLeads) {
          if (!lead.phone || lead.phone.includes("XXX")) {
             console.log(`⚠ Skipping ${lead.name}: Direct phone number not available.`);
             continue;
          }

          const demolink = `https://oran-restaurants-sites.github.io/demo-${lead.name.replace(/\s/g, "")}`;
          const msgText = `سلام عليكم ${lead.name} \n لاحظت نشاطكم التجاري الرائع في مدينتكم. لكن تلفتون زبائني يومياً لعدم وجود موقع رسمي على غوغل. هذا النموذج العصري الخاص بكم مجاناً: ${demolink}`;

          try {
             const chatId = `213${lead.phone.slice(-9)}@c.us`;
             await client.sendMessage(chatId, msgText);
             console.log(`✔ Proposal sent successfully to: ${lead.name}`);
             await new Promise(resolve => setTimeout(resolve, 15000));
          } catch (err) {
             console.error(`❌ Failed to send to ${lead.name}:`, err.message);
          }
       }
    });
});

client.on('message', async (msg) => {
    if (msg.fromMe) return;

    const sender = msg.from;
    const userText = msg.body;

    console.log(`📩 Incoming message from ${sender}: ${userText}`);

    if (!conversationHistory[sender]) {
       conversationHistory[sender] = [];
    }

    conversationHistory[sender].push({ role: 'user', content: userText });

    const systemInstruction = `
أنت خبير مبيعات ومفاوض محترف لوكالة "Webcraft" الرقمية في الجزائر.
سعر الخدمة الإجمالي لتسليم الموقع الإلكتروني الاحترافي هو ${WEBSITE_PRICE}.
هدف هو إقناع صاحب المحل بأهمية الموقع، استغلال الجانب النفسي (الخوف من تفوت الفرصة وضياع الزبائن)، وتأكيد السعر له بكل احترافية بأسلوب جزائري ذكي، راقي، مقنع، ومحترف.

قواعد العمل:
1. مقابل تصميم وتسليم الموقع كاملاً ومنشوراً على غوغل ${WEBSITE_PRICE}، ناقش العميل، وأكده أن السعر هو.
2. اطلب منه معلومات محله (الاسم، الخدمات، الشعار) لتجهيز الموقع النهائي.
3. معلومات الدفع الخاصة بك قبل التسليم الحصري عبر:
- الاسم: KHAYRADDIN BETTOUCHE
    - RIP: 0028365374
    - CCP: 002836536674
4. سيبدأ العمل فوراً ويتم تسليم موقعه النهائي بمجرد إرسال وصل التحويل (Reçu).
`;

    try {
       const finalResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: conversationHistory[sender].map(m => m.content).join("\n"),
          config: { systemInstruction },
       });

       const replyText = finalResponse.text;
       conversationHistory[sender].push({ role: 'model', content: replyText });

       await client.sendMessage(sender, replyText);
       console.log(`✔ Replied to ${sender} with pricing details.`);

    } catch (error) {
       console.error('❌ Error processing AI response:', error.message);
    }
});

client.initialize();

