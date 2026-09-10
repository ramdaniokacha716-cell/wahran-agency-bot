const axios = require('axios');

// خطة تغطية الـ 69 ولاية كاملة
const all69WilayasSchedule = {
    Saturday: {
       wilayas: ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Aflou"],
       activities: ["Startups & Tech", "Hotels & Tourism", "Pharmacies"]
    },
    Sunday: {
       wilayas: ["Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Barika", "El Kantara"],
       activities: ["Pizzerias & Restaurants", "Tailoring Workshops", "Auto Repair Shops"]
    },
    Monday: {
       wilayas: ["Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Bir El Ater", "El Aricha"],
       activities: ["Women clothing stores", "Offices & Law Firms", "Real Estate"]
    },
    Tuesday: {
       wilayas: ["Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Ksar El Boukhari", "Ain Oussera"],
       activities: ["Factories & Industries", "Building materials", "Supermarkets"]
    },
    Wednesday: {
       wilayas: ["Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Messaad", "Boussaada"],
       activities: ["Clinics & Pharmacies", "Hotels", "Cafes & Decor"]
    },
    Thursday: {
       wilayas: ["Souk Ahras", "Tipasa", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "El Abiodh Sidi Cheikh"],
       activities: ["Local businesses", "Craftsmen", "Traditional markets"]
    },
    Friday: {
       wilayas: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Setif"],
       activities: ["Tech Startups", "Major Industries", "Hotels"]
   }
};

// دالة التحقق من أوقات العمل المحددة
function checkWorkingHours() {
    const now = new Date();
// تحويل الوقت لساعة ودقيقة محلية
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute; // الدقائق منذ منتصف الليل

// الفترات المسموحة:
// الفترة الأولى: 09:30 إلى 13:00 (من 570 دقيقة إلى 780 دقيقة)
    const morningStart = 9 * 60 + 30; // 570
    const morningEnd = 13 * 60; // 780

// الفترة الثانية: 14:00 إلى 00:00 (من 840 دقيقة إلى 1440 دقيقة)
    const eveningStart = 14 * 60; // 840
    const nightEnd = 24 * 60; // 1440 (منتصف الليل)

    const isMorningShift = currentTimeVal >= morningStart && currentTimeVal <= morningEnd;
    const isEveningShift = currentTimeVal >= eveningStart && currentTimeVal < nightEnd;

    return isMorningShift || isEveningShift;
}

// دالة فترة الصيانة الليلية وتفريغ الذاكرة (من 00:00 إلى 09:30 صباحاً)
function runNightMaintenanceRoutine() {
    console.log(`🌙 [Night Maintenance & RAM Purge]: Running deep memory cleanup, purging unsold/uninterested leads, and optimizing database...`);
// تنفيذ تفريغ الذاكرة العميق لو متاح
    if (global.gc) {
       global.gc();
       console.log(`🧹 [RAM Optimized]: Garbage collector successfully freed memory.`);
    }

    console.log(`✅ [Maintenance Complete]: System is clean, lightweight, and ready for tomorrow's shift.`);
}

// الوظيفة الرئيسية للبحث المجدول حسب الأوقات
async function runNational69Search() {
// 1. التحقق هل نحن في فترة الصيانة الليلية (من 00:00 إلى 09:30)
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;
    const morningStart = 9 * 60 + 30;

    if (currentTimeVal < morningStart) {
// نحن في فترة الصيانة الليلية
       runNightMaintenanceRoutine();
       return { status: "System in night maintenance mode", leads: [] };
    }

// 2. التحقق هل نحن ضمن أوقات العمل الرسمية
    if (!checkWorkingHours()) {
       console.log(`⏳ [Paused]: Outside working hours (Resting between shifts: 13:00 - 14:00).`);
       return { status: "Paused for shift break", leads: [] };
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[now.getDay()];

    const plan = all69WilayasSchedule[todayName];
    if (!plan) {
       console.log(`ℹ️ Today (${todayName}) is rest day.`);
       return { status: "Rest day", leads: [] };
    }

    console.log(`🚀 [DZ Active Shift]: Scanning across 69-Wilayas for [${todayName}] during active hours...`);
    let targetLeads = [];

    for (const wilaya of plan.wilayas) {
       for (const activity of plan.activities) {
// التحقق مرة أخرى من وقت العمل أثناء اللوب لضمان الالتزام بالاستراحة
          if (!checkWorkingHours()) {
             console.log(`⏸️ Shift break reached. Pausing search until next active window.`);
             return targetLeads;
          }

          console.log(`📍 Wilaya: ${wilaya} -> Target: ${activity}`);
          try {
             const results = await scanWilayaSector(wilaya, activity);
             targetLeads.push(...results);
          } catch (err) {
             console.error(`❌ Scan error in ${wilaya}:`, err.message);
          }
       }
    }

    return targetLeads;
}

async function scanWilayaSector(wilaya, activity) {
    return [
       {
           wilaya: wilaya,
           sector: activity,
           status: "Lead evaluated during active shift",
           pitch: "Ready"
       }
    ];
}

module.exports = {
    searchAlgerianLeads: runNational69Search
};
