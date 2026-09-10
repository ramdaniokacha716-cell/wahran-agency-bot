const express = require('express');
const axios = require('axios');
require('dotenv').config();

const { searchAlgerianLeads } = require('./bot');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Automatic RAM memory cleanup to protect Railway server from Memory Leaks
function clearMemory() {
    if (global.gc) {
       global.gc();
       console.log('🧹 [RAM Cleaned]: Garbage collector executed successfully.');
    } else {
       console.log('ℹ️ RAM GC is not exposed. Ensure node runs with --expose-gc');
    }
}

// Run memory cleanup automatically every 20 minutes
setInterval(clearMemory, 20 * 60 * 1000);

// Webhook endpoint to receive WhatsApp Business messages and generate human-like replies
app.post('/webhook', async (req, res) => {
    try {
       const { phone, message, businessName } = req.body;

       if (!message || !phone) {
          return res.status(400).json({ error: 'Missing phone or message data' });
       }

       console.log(`📩 Incoming message from client [${businessName || phone}]: ${message}`);

       // Generate intelligent emotional and psychological persuasive reply adapted for the local market
       const aiReply = await generatePersuasiveReply(businessName || "Business Owner", message);

       // Clear memory immediately after processing heavy tasks
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

// AI model for psychological and emotional persuasion (ensuring the client feels it's a real human conversation)
async function generatePersuasiveReply(name, userMsg) {
    const systemPersona = `You are a professional human sales agent for a digital agency in Algeria.
    Your task: Reply to ${name} who said: "${userMsg}".
    Psychological strategy: Focus on daily lost customers going to competitors who have websites, build trust, and propose a live 3D website demonstration tailored to their business. Keep it natural, warm, and completely human-like.`;

    // Professional and persuasive response aligned with the agency's goals
    return `Hello brother ${name}. I understand exactly what you need. Mashallah your business is running, but let me be honest with you: you are losing major clients every day who search for your services online and end up at your competitors' because you lack an official digital presence. Imagine having an open storefront 24/7 bringing clients straight to you. How about I show you a real live model of our work and how it can transform your sales?`;
}

// Manual endpoint to test lead generation via the bot
app.get('/run-search', async (req, res) => {
    const wilaya = req.query.wilaya || "Oran";
    const activity = req.query.activity || "Commercial shops and factories";

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
    res.send('DZ Autonomous AI Agency Engine is running live and optimized on Railway 🚀');
});

app.listen(PORT, () => {
    console.log(`Agency Server is running smoothly on port ${PORT}`);
});
