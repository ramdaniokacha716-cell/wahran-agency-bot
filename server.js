const express = require('express');
const axios = require('axios');
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

// Webhook endpoint to handle client interactions and AI generation
app.post('/webhook', async (req, res) => {
    try {
       const { phone, message, businessName } = req.body;

       if (!message || !phone) {
          return res.status(400).json({ error: 'Missing phone or message data' });
       }

       console.log(`📩 Incoming message from [${businessName || phone}]: ${message}`);

       const aiReply = await generatePersuasiveReply(businessName || "صاحب المحل", message);
       clearMemory();

       res.status(200).json({
          status: 'success',
          recipient: phone,
          replyMessage: aiReply
       });

    } catch (error) {
       console.error('Error in webhook handling:', error.message);
       res.status(500).json({ error: 'Internal Server Error' });
    }
});

// AI model for psychological and emotional persuasion in Algerian Arabic
async function generatePersuasiveReply(name, userMsg) {
    return `السلام عليكم خويا ${name}. راني فهمت مليح واش راك حاب، تبارك الله النشاط تاعك ماشي، بصح خليني نحكيهالك صراحة: راك تضيع في زبائن كبار كل يوم يلوجو على خدمتك في جوجل ويرو عند المنافس خاطر ما عندكش واجهة رسمية تليق بيك. تخيل محل مفتوح 24/7 يجيبلك الناس حتى لعندك. واش رايك نوريك نموذج حقيقي لخدمتنا وكيفاش يقدر يغير لك المبيعات؟`;
}

// Manual endpoint to test lead generation
app.get('/run-search', async (req, res) => {
    const wilaya = req.query.wilaya || "Oran";
    const activity = req.query.activity || "Commercial shops";

    const leads = await searchAlgerianLeads(wilaya, activity);
    clearMemory();

    res.json({
       status: "Search completed successfully",
       wilaya: wilaya,
       foundLeadsCount: leads.length,
       leads: leads
    });
});

app.get('/', (req, res) => {
    res.send('DZ Autonomous AI Agency Engine is running live, stable and optimized on Railway 🚀');
});

app.listen(PORT, () => {
    console.log(`Agency Server is running smoothly on port ${PORT}`);
});
