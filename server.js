const express = require('express');
const { searchAlgerianLeads } = require('./bot');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Automatic RAM memory cleanup
function clearMemory() {
    if (global.gc) {
       global.gc();
       console.log('🧹 [RAM Cleaned]: Garbage collection executed.');
    } else {
       console.log('ℹ️ RAM GC is not exposed.');
    }
}

setInterval(clearMemory, 20 * 60 * 1000);

// Webhook endpoint to handle client interactions
app.post('/webhook', async (req, res) => {
    try {
       const { phone, message, businessName } = req.body;

       if (!message || !phone) {
           return res.status(400).json({ error: 'Missing phone or message' });
       }

       console.log(`📩 Incoming message from ${phone} (${businessName || 'Unknown'}): ${message}`);

       // AI model response generation
       const aiReply = `سلام خويا عزيز، راني شفت بلي عندك خطر ما عندكش واجهة رسمية تليق بيك. تخيل محل مفتوح 24/7 يجيبلك النفس حتى لعندك. واش رايك نوريك نموذج حقيقي لخدمتنا وكيفاش يقدر يغير لك المبيعات؟ 🚀`;

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

// Manual endpoint to test lead generation across 69 wilayas
app.get('/run-search', async (req, res) => {
    try {
       const wilaya = req.query.wilaya || "Oran";
       const activity = req.query.activity || "Commercial shops";

       console.log(`🚀 Triggering search for ${activity} in ${wilaya}...`);
       const leads = await searchAlgerianLeads(wilaya, activity);
       clearMemory();

       res.json({
           status: "Search completed successfully",
           wilaya: wilaya,
           foundLeadsCount: leads.length,
           leads: leads
       });
    } catch (error) {
       console.error('❌ Error in automated search:', error);
       res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('DZ Autonomous AI Agency Engine is running live, stable and optimized on Railway');
});

app.listen(PORT, () => {
    console.log(`Agency Server is running smoothly on port ${PORT}`);
});
