// Multilingual Translations
const translations = {
    en: {
        // Header
        title: "𝚂𝚖𝚊𝚛𝚝𝙵𝚕𝚘𝚠",
        subtitle: "Smart Water Management System",
        
        // Form
        cropType: "Crop Type",
        cropStage: "Crop Stage",
        fieldSize: "Field Size (Hectares)",
        predictedRainfall: "Predicted Rainfall (mm)",
        generatePlan: "Generate Irrigation Plan",
        generateWeek: "Generate Week",
        selectCrop: "Select crop",
        
        // Crop types
        rice: "Rice",
        wheat: "Wheat",
        maize: "Maize",
        
        // Crop variety
        cropVariety: "Crop Variety",
        selectVariety: "Select variety",
        
        // Wheat varieties
        durumWheat: "Durum Wheat",
        breadWheat: "Bread Wheat",
        emmerWheat: "Emmer Wheat",
        hardRedWheat: "Hard Red Wheat",
        softWhiteWheat: "Soft White Wheat",
        
        // Rice varieties
        basmatiRice: "Basmati Rice",
        jasmineRice: "Jasmine Rice",
        sonaMasuri: "Sona Masuri",
        ir64: "IR64",
        brownRice: "Brown Rice",
        
        // Maize varieties
        dentCorn: "Dent Corn",
        flintCorn: "Flint Corn",
        sweetCorn: "Sweet Corn",
        popcorn: "Popcorn",
        hybridMaize: "Hybrid Maize",
        
        // Crop stages
        early: "Early Stage",
        vegetative: "Vegetative Growth",
        flowering: "Flowering",
        
        // Results
        irrigationDecision: "Irrigation Decision",
        confidenceLevel: "Confidence Level",
        currentSoilMoisture: "Current Soil Moisture",
        sourcesConsulted: "Sources Consulted",
        systemVerification: "System Verification",
        irrigationRecommended: "Irrigation Recommended",
        irrigationNotNeeded: "Irrigation Not Needed",
        reducedIrrigation: "Reduced Irrigation",
        skip: "Skip",
        liters: "Liters",
        waterAmount: "Water Amount",
        waterPerHectare: "Water per Hectare",
        aiExplanation: "AI Explanation",
        recommendation: "Recommendation",
        dailyPlanGenerated: "Daily irrigation plan generated",
        rainAvoidanceApplied: "Rain avoidance logic applied",
        waterSavingsCalculated: "Water savings calculated",
        sourcesCited: "Agricultural sources cited",
        safetyCheckPassed: "Safety checks passed",
        agenticFeaturesActive: "Agentic AI features active",
        noDataAvailable: "No schedule data available",
        waterAmount: "Water Amount",
        waterPerHectare: "Water per Hectare",
        
        // Weekly Schedule
        weeklySchedule: "7-Day Irrigation Schedule",
        totalWaterWeek: "Total Water (Week)",
        irrigationDays: "Irrigation Days",
        skipDays: "Skip Days",
        reduceDays: "Reduce Days",
        day: "Day",
        
        // Reports
        waterSavingsReport: "Water Savings Report",
        totalWaterSaved: "Total Water Saved",
        smartUsage: "Smart System Usage",
        traditionalUsage: "Traditional Schedule",
        exportJson: "JSON",
        exportCsv: "CSV",
        
        // Rain Alerts
        rainAlert: "Rain Alert",
        upcomingRain: "Upcoming Rain",
        skipIrrigation: "Skip Irrigation",
        reduceIrrigation: "Reduce Irrigation",
        rainPredicted: "Rain Predicted",
        
        // Common
        loading: "Loading...",
        error: "Error",
        success: "Success",
        source: "Source",
        date: "Date",
        temperature: "Temperature",
        conditions: "Conditions",
        
        // Disclaimer
        disclaimer: "This system is a decision-support tool and does not replace agricultural experts. No chemical or medical recommendations provided.",
        
        // Agriculture News Slideshow
        news1Title: "PM Kisan Samman Nidhi Extended",
        news1Desc: "Government extends ₹6000 crore assistance to 11 crore farmers under PM-Kisan scheme for 2024-25.",
        news2Title: "Monsoon Alert: Above Normal Rainfall",
        news2Desc: "IMD predicts 106% above normal monsoon rainfall, beneficial for Kharif crops across central India.",
        news3Title: "MSP Hike for Rabi Crops",
        news3Desc: "Government increases MSP for wheat by ₹150 to ₹2275 per quintal, pulses see 5-7% increase.",
        news4Title: "Drip Irrigation Subsidy Enhanced",
        news4Desc: "Center increases micro-irrigation subsidy to 55% for small farmers, 45% for others.",
        news5Title: "Organic Farming Mission Launched",
        news5Desc: "New ₹3000 crore mission to promote organic farming in 10,000 clusters across 15 states.",
        news6Title: "Crop Insurance Claims Fast-Tracked",
        news6Desc: "PMFBY claims to be settled within 30 days for weather-related crop losses in affected districts.",
        news7Title: "e-NAM Platform Expands",
        news7Desc: "National Agriculture Market now connects 1000 mandis, benefiting 1.5 crore farmers nationwide.",
        news8Title: "Solar Pump Scheme Extended",
        news8Desc: "KUSUM scheme to install 20 lakh solar pumps by 2026, 30% subsidy for farmers.",
        news9Title: "Wheat Procurement Record High",
        news9Desc: "Food Corporation procures 430 lakh tonnes wheat, 15% higher than previous season at MSP rates.",
        news10Title: "Soil Health Cards Distributed",
        news10Desc: "11 crore soil health cards issued, farmers save 15-20% on fertilizer costs with recommendations.",
        news11Title: "Agricultural Credit Target Met",
        news11Desc: "Banks disburse ₹18.5 lakh crore farm credit, exceeding target of ₹16.5 lakh crore for FY24.",
        news12Title: "Cold Storage Capacity Boost",
        news12Desc: "Government adds 500 lakh tonnes cold storage capacity to reduce post-harvest losses by 40%."
    },
    
    hi: {
        // Header
        title: "𝚂𝚖𝚊𝚛𝚝𝙵𝚕𝚘𝚠",
        subtitle: "स्मार्ट जल प्रबंधन प्रणाली",
        
        // Form
        cropType: "फसल प्रकार",
        cropStage: "फसल अवस्था",
        fieldSize: "खेत का आकार (हेक्टेयर)",
        predictedRainfall: "अनुमानित वर्षा (मिमी)",
        generatePlan: "सिंचाई योजना बनाएं",
        generateWeek: "सप्ताह बनाएं",
        selectCrop: "फसल चुनें",
        cropVariety: "फसल किस्म",
        selectVariety: "किस्म चुनें",
        
        // Crop types
        rice: "चावल",
        wheat: "गेहूं",
        maize: "मक्का",

        // Crop variety
        durumWheat: "ड्यूरम गेहूं",
        breadWheat: "ब्रेड गेहूं",
        emmerWheat: "एमर गेहूं",
        hardRedWheat: "हार्ड रेड गेहूं",
        softWhiteWheat: "सॉफ्ट व्हाइट गेहूं",
        
        basmatiRice: "बासमती चावल",
        jasmineRice: "जैस्मिन चावल",
        sonaMasuri: "सोना मसूरी",
        ir64: "IR64",
        brownRice: "भूरा चावल",
        
        dentCorn: "डेंट कॉर्न",
        flintCorn: "फ्लिंट कॉर्न",
        sweetCorn: "मीठा कॉर्न",
        popcorn: "पॉपकॉर्न",
        hybridMaize: "हाइब्रिड मक्का",
        
        // Crop variety
        cropVariety: "फसल की किस्म",
        selectVariety: "किस्म चुनें",
        
        // Wheat varieties
        durumWheat: "ड्यूरम गेहूं",
        breadWheat: "ब्रेड गेहूं",
        emmerWheat: "एमर गेहूं",
        hardRedWheat: "हार्ड रेड गेहूं",
        softWhiteWheat: "सॉफ्ट व्हाइट गेहूं",
        
        // Rice varieties
        basmatiRice: "बासमती चावल",
        jasmineRice: "जैस्मिन चावल",
        sonaMasuri: "सोना मसूरी",
        ir64: "आईआर64",
        brownRice: "ब्राउन चावल",
        
        // Maize varieties
        dentCorn: "डेंट मक्का",
        flintCorn: "फ्लिंट मक्का",
        sweetCorn: "स्वीट मक्का",
        popcorn: "पॉपकॉर्न",
        hybridMaize: "हाइब्रिड मक्का",
        
        // Crop stages
        early: "प्रारंभिक अवस्था",
        vegetative: "वनस्पति वृद्धि",
        flowering: "फूल आना",
        
        // Results
        irrigationRecommended: "सिंचाई की सिफारिश",
        irrigationNotNeeded: "सिंचाई की आवश्यकता नहीं",
        reducedIrrigation: "कम सिंचाई",
        waterAmount: "पानी की मात्रा",
        waterPerHectare: "प्रति हेक्टेयर पानी",
        currentSoilMoisture: "वर्तमान मिट्टी की नमी",
        systemReasoning: "सिस्टम तर्क",
        aiExplanation: "AI स्पष्टीकरण",
        sourcesConsulted: "स्रोत परामर्श",
        recommendation: "सिफारिश",
        
        // Weekly Schedule
        weeklySchedule: "7-दिवसीय सिंचाई अनुसूची",
        totalWaterWeek: "कुल पानी (सप्ताह)",
        irrigationDays: "सिंचाई दिवस",
        skipDays: "छोड़े गए दिन",
        reduceDays: "कम दिन",
        day: "दिन",
        
        // Reports
        waterSavingsReport: "जल बचत रिपोर्ट",
        totalWaterSaved: "कुल बचाया गया पानी (लीटर)",
        smartSystemUsage: "स्मार्ट सिस्टम उपयोग",
        traditionalSchedule: "पारंपरिक अनुसूची",
        exportJson: "JSON",
        exportCsv: "CSV",
        
        // Rain Alerts
        rainAlert: "वर्षा चेतावनी",
        upcomingRain: "आगामी वर्षा",
        skipIrrigation: "सिंचाई छोड़ें",
        reduceIrrigation: "सिंचाई कम करें",
        rainPredicted: "वर्षा की भविष्यवाणी",
        
        // Common
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफलता",
        source: "स्रोत",
        date: "तारीख",
        temperature: "तापमान",
        conditions: "स्थितियां",
        
        // Disclaimer
        disclaimer: "यह प्रणाली एक निर्णय-सहायक उपकरण है और कृषि विशेषज्ञों का विकल्प नहीं है। कोई रासायनिक या चिकित्सा सिफारिशें प्रदान नहीं की जाती हैं।",
        
        // Agriculture News Slideshow
        news1Title: "पीएम किसान सम्मान निधि विस्तार",
        news1Desc: "सरकार ने 2024-25 के लिए पीएम-किसान योजना के तहत 11 करोड़ किसानों को ₹6000 करोड़ की सहायता बढ़ाई।",
        news2Title: "मॉनसून चेतावनी: सामान्य से अधिक वर्षा",
        news2Desc: "आईएमडी ने 106% सामान्य से अधिक मॉनसून वर्षा की भविष्यवाणी की, केंद्रीय भारत में खरीफ फसलों के लिए फायदेमंद।",
        news3Title: "रबी फसलों के लिए एमएसपी वृद्धि",
        news3Desc: "सरकार ने गेहूं का एमएसपी ₹150 बढ़ाकर ₹2275 प्रति क्विंटल कर दिया, दालों में 5-7% की वृद्धि।",
        news4Title: "ड्रिप सिंचाई सब्सिडी बढ़ी",
        news4Desc: "केंद्र ने छोटे किसानों के लिए सूक्ष्म-सिंचाई सब्सिडी 55% और अन्य के लिए 45% कर दी।",
        news5Title: "ऑर्गेनिक खेती मिशन लॉन्च",
        news5Desc: "15 राज्यों में 10,000 क्लस्टरों में ऑर्गेनिक खेती को बढ़ावा देने के लिए नई ₹3000 करोड़ की मिशन।",
        news6Title: "फसल बीमा दावे तेज",
        news6Desc: "पीएमएफबीवाई दावे प्रभावित जिलों में मौसम संबंधी फसल नुकसान के लिए 30 दिनों में निपटाए जाएंगे।",
        news7Title: "ई-एनएएम प्लेटफॉर्म का विस्तार",
        news7Desc: "राष्ट्रीय कृषि बाजार अब 1000 मंडियों को जोड़ता है, देश भर में 1.5 करोड़ किसानों को लाभ।",
        news8Title: "सोलर पंप योजना विस्तार",
        news8Desc: "कुसुम योजना 2026 तक 20 लाख सोलर पंप लगाएगी, किसानों के लिए 30% सब्सिडी।",
        news9Title: "गेहूं खरीद रिकॉर्ड उच्च",
        news9Desc: "फूड कॉर्पोरेशन ने 430 लाख टन गेहूं खरीदा, एमएसपी दरों पर पिछले सीजन से 15% अधिक।",
        news10Title: "मृदा स्वास्थ्य कार्ड वितरित",
        news10Desc: "11 करोड़ मृदा स्वास्थ्य कार्ड जारी, सिफारिशों के साथ किसान उर्वरक लागत पर 15-20% बचाते हैं।",
        news11Title: "कृषि ऋण लक्ष्य पूरा",
        news11Desc: "बैंकों ने ₹18.5 लाख करोड़ कृषि ऋण वितरित किया, वित्त वर्ष 24 के लक्ष्य ₹16.5 लाख करोड़ से अधिक।",
        news12Title: "कोल्ड स्टोरेज क्षमता बढ़ी",
        news12Desc: "सरकार ने कटाई-बाद के नुकसान को 40% कम करने के लिए 500 लाख टन कोल्ड स्टोरेज क्षमता जोड़ी।"
    },
    
    es: {
        // Header
        title: "𝚂𝚖𝚊𝚛𝚝𝙵𝚕𝚘𝚠",
        subtitle: "Sistema Inteligente de Gestión del Agua",
        
        // Form
        cropType: "Tipo de Cultivo",
        cropStage: "Etapa del Cultivo",
        fieldSize: "Tamaño del Campo (Hectáreas)",
        predictedRainfall: "Lluvia Prevista (mm)",
        generatePlan: "Generar Plan de Riego",
        generateWeek: "Generar Semana",
        selectCrop: "Seleccionar cultivo",
        
        // Crop types
        rice: "Arroz",
        wheat: "Trigo",
        maize: "Maíz",
        
        // Crop variety
        cropVariety: "Variedad de Cultivo",
        selectVariety: "Seleccionar variedad",
        
        // Wheat varieties
        durumWheat: "Trigo Durum",
        breadWheat: "Trigo Pan",
        emmerWheat: "Trigo Espelta",
        hardRedWheat: "Trigo Rojo Duro",
        softWhiteWheat: "Trigo Blanco Suave",
        
        // Rice varieties
        basmatiRice: "Arroz Basmati",
        jasmineRice: "Arroz Jazmín",
        sonaMasuri: "Sona Masuri",
        ir64: "IR64",
        brownRice: "Arroz Integral",
        
        // Maize varieties
        dentCorn: "Maíz Duro",
        flintCorn: "Maíz Flint",
        sweetCorn: "Maíz Dulce",
        popcorn: "Palomitas de Maíz",
        hybridMaize: "Maíz Híbrido",
        
        // Crop stages
        early: "Etapa Temprana",
        vegetative: "Crecimiento Vegetativo",
        flowering: "Floración",
        
        // Results
        irrigationRecommended: "Riego Recomendado",
        irrigationNotNeeded: "Riego No Necesario",
        reducedIrrigation: "Riego Reducido",
        waterAmount: "Cantidad de Agua",
        waterPerHectare: "Agua por Hectárea",
        currentSoilMoisture: "Humedad del Suelo Actual",
        systemReasoning: "Razonamiento del Sistema",
        aiExplanation: "Explicación de IA",
        sourcesConsulted: "Fuentes Consultadas",
        recommendation: "Recomendación",
        
        // Weekly Schedule
        weeklySchedule: "Calendario de Riego de 7 Días",
        totalWaterWeek: "Agua Total (Semana)",
        irrigationDays: "Días de Riego",
        skipDays: "Días Omitidos",
        reduceDays: "Días Reducidos",
        day: "Día",
        
        // Reports
        waterSavingsReport: "Informe de Ahorro de Agua",
        totalWaterSaved: "Agua Total Ahorrada (L)",
        smartSystemUsage: "Uso del Sistema Inteligente",
        traditionalSchedule: "Calendario Tradicional",
        exportJson: "JSON",
        exportCsv: "CSV",
        
        // Rain Alerts
        rainAlert: "Alerta de Lluvia",
        upcomingRain: "Lluvia Próxima",
        skipIrrigation: "Omitir Riego",
        reduceIrrigation: "Reducir Riego",
        rainPredicted: "Lluvia Prevista",
        
        // Common
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        source: "Fuente",
        date: "Fecha",
        temperature: "Temperatura",
        conditions: "Condiciones",
        
        // Disclaimer
        disclaimer: "Este sistema es una herramienta de apoyo a la decisión y no reemplaza a los expertos agrícolas. No se proporcionan recomendaciones químicas o médicas.",
        
        // Agriculture News Slideshow
        news1Title: "PM Kisan Samman Nidhi Extendido",
        news1Desc: "Gobierno extiende asistencia de ₹6000 crore a 11 crore agricultores bajo esquema PM-Kisan para 2024-25.",
        news2Title: "Alerta de Monzón: Lluvia Por Encima de lo Normal",
        news2Desc: "IMD predice 106% de lluvia monzónica por encima de lo normal, beneficiosa para cultivos Kharif en India central.",
        news3Title: "Aumento de MSP para Cultivos Rabi",
        news3Desc: "Gobierno aumenta MSP para trigo en ₹150 a ₹2275 por quintal, legumbres ven aumento de 5-7%.",
        news4Title: "Subsidio de Riego por Goteo Mejorado",
        news4Desc: "Centro aumenta subsidio de micro-riego a 55% para pequeños agricultores, 45% para otros.",
        news5Title: "Misión de Agricultura Orgánica Lanzada",
        news5Desc: "Nueva misión de ₹3000 crore para promover agricultura orgánica en 10,000 clústeres en 15 estados.",
        news6Title: "Reclamaciones de Seguro de Cultivos Aceleradas",
        news6Desc: "Reclamaciones PMFBY serán liquidadas dentro de 30 días para pérdidas de cultivos relacionadas con clima en distritos afectados.",
        news7Title: "Plataforma e-NAM se Expande",
        news7Desc: "Mercado Nacional de Agricultura ahora conecta 1000 mandis, beneficiando a 1.5 crore agricultores nacionalmente.",
        news8Title: "Esquema de Bombas Solares Extendido",
        news8Desc: "Esquema KUSUM instalará 20 lakh bombas solares para 2026, 30% de subsidio para agricultores.",
        news9Title: "Compra de Trigo Récord Alta",
        news9Desc: "Corporación de Alimentos compra 430 lakh toneladas de trigo, 15% más que temporada anterior a tasas MSP.",
        news10Title: "Tarjetas de Salud del Suelo Distribuidas",
        news10Desc: "11 crore tarjetas de salud del suelo emitidas, agricultores ahorran 15-20% en costos de fertilizantes con recomendaciones.",
        news11Title: "Objetivo de Crédito Agrícola Cumplido",
        news11Desc: "Bancos desembolsan ₹18.5 lakh crore crédito agrícola, excediendo objetivo de ₹16.5 lakh crore para FY24.",
        news12Title: "Aumento de Capacidad de Almacenamiento Frío",
        news12Desc: "Gobierno añade 500 lakh toneladas capacidad de almacenamiento frío para reducir pérdidas post-cosecha en 40%."
    },
    
    ta: {
        // Header
        title: "𝚂𝚖𝚊𝚛𝚝𝙵𝚕𝚘𝚠",
        subtitle: "ஸ்மார்ட் நீர் மேலாண்மை அமைப்பு",
        
        // Form
        cropType: "பயிர் வகை",
        cropStage: "பயிர் நிலை",
        fieldSize: "வயல் அளவு (ஹெக்டேர்)",
        predictedRainfall: "முன்னறிவிக்கப்பட்ட மழை (மிமீ)",
        generatePlan: "பாசனத் திட்டத்தை உருவாக்கு",
        generateWeek: "வாரத்தை உருவாக்கு",
        selectCrop: "பயிரை தேர்ந்தெடுக்கவும்",
        
        // Crop types
        rice: "நெல்",
        wheat: "கோதுமை",
        maize: "சோளம்",
        
        // Crop variety
        cropVariety: "பயிர் இனம்",
        selectVariety: "இனத்தை தேர்ந்தெடுக்கவும்",
        
        // Wheat varieties
        durumWheat: "டூரம் கோதுமை",
        breadWheat: "ரொட்டி கோதுமை",
        emmerWheat: "எம்மர் கோதுமை",
        hardRedWheat: "ஹார்ட ரெட் கோதுமை",
        softWhiteWheat: "சாப்ட் வைட் கோதுமை",
        
        // Rice varieties
        basmatiRice: "பாஸ்மதி நெல்",
        jasmineRice: "ஜாஸ்மின் நெல்",
        sonaMasuri: "சோனா மசூரி",
        ir64: "ஐஆர64",
        brownRice: "பிரௌன் நெல்",
        
        // Maize varieties
        dentCorn: "டென்ட் சோளம்",
        flintCorn: "ஃபிளின்ட் சோளம்",
        sweetCorn: "ஸ்வீட் சோளம்",
        popcorn: "பாப்கார்ன்",
        hybridMaize: "ஹைப்ரிட் சோளம்",
        
        // Crop stages
        early: "ஆரம்ப நிலை",
        vegetative: "வேகமான வளர்ச்சி",
        flowering: "பூத்தல்",
        
        // Results
        irrigationDecision: "பாசன தீர்மானம்",
        confidenceLevel: "நம்பகத்தன்மை அளவு",
        currentSoilMoisture: "தற்போதைய மண் ஈரப்பதம்",
        sourcesConsulted: "பயன்படுத்தப்பட்ட ஆதாரங்கள்",
        systemVerification: "அமைப்பு சரிபார்ப்பு",
        irrigationRecommended: "பாசனம் பரிந்துரைக்கப்படுகிறது",
        irrigationNotNeeded: "பாசனம் தேவையில்லை",
        reducedIrrigation: "குறைக்கப்பட்ட பாசனம்",
        skip: "தவிர்",
        liters: "லிட்டர்",
        waterAmount: "நீர் அளவு",
        waterPerHectare: "ஹெக்டேருக்கு நீர்",
        aiExplanation: "AI விளக்கம்",
        recommendation: "பரிந்துரை",
        
        // Weekly Schedule
        weeklySchedule: "7 நாள் பாசன அட்டவணை",
        totalWaterWeek: "மொத்த நீர் (வாரம்)",
        irrigationDays: "பாசன நாட்கள்",
        skipDays: "தவிர்க்கப்பட்ட நாட்கள்",
        reduceDays: "குறைக்கப்பட்ட நாட்கள்",
        day: "நாள்",
        
        // Reports
        waterSavingsReport: "நீர் சேமிப்பு அறிக்கை",
        totalWaterSaved: "மொத்த சேமிக்கப்பட்ட நீர்",
        smartUsage: "ஸ்மார்ட் அமைப்பு பயன்பாடு",
        traditionalUsage: "பாரம்பரிய அட்டவணை",
        exportJson: "JSON",
        exportCsv: "CSV",
        
        // Rain Alerts
        rainAlert: "மழை எச்சரிக்கை",
        upcomingRain: "வரவிருக்கும் மழை",
        skipIrrigation: "பாசனத்தை தவிர்க்கு",
        reduceIrrigation: "பாசனத்தை குறைக்கு",
        rainPredicted: "மழை முன்னறிவிக்கப்பட்டது",
        
        // Common
        loading: "ஏற்றுகிறது...",
        error: "பிழை",
        success: "வெற்றி",
        source: "ஆதாரம்",
        date: "தேதி",
        temperature: "வெப்பநிலை",
        conditions: "நிலைமைகள்",
        
        // Disclaimer
        disclaimer: "இந்த அமைப்பு ஒரு முடிவு-ஆதரவு கருவியாகும் மற்றும் வேளாண் நிபுணர்களை மாற்றாது. எந்த வேதியில் அல்லது மருத்துவ பரிந்துரைகளும் வழங்கப்படவில்லை.",
        
        // Agriculture News Slideshow
        news1Title: "பிஎம் கிசான் ஸம்மான் நிதி நீட்டிவது",
        news1Desc: "2024-25க்கு பிஎம்-கிசான் திட்டத்தின் கீழ் 11 கோடி விவசாயிகளுக்கு ₹6000 கோடி உதவியை அரசு நீட்டியது.",
        news2Title: "மான்சூன் எச்சரிக்கை: சாதாரணத்திற்கு மேல் மழை",
        news2Desc: "ஐஎம்டி 106% சாதாரணத்திற்கு மேல் மான்சூன் மழையை கணிக்கிறது, மத்திய இந்தியாவில் காரிஃப் பயிர்களுக்கு நன்மை பயக்கும்.",
        news3Title: "ரபி பயிர்களுக்கு எம்எஸ்பி உயர்வு",
        news3Desc: "அரசு கோதுமையின் எம்எஸ்பியை ₹150 உயர்த்தி ₹2275 க்வின்டலுக்கு செய்தது, பருப்புகளில் 5-7% உயர்வு.",
        news4Title: "டிரிப் பாசன மானியம் மேம்படுத்தப்பட்டது",
        news4Desc: "சிறிய விவசாயிகளுக்கு 55% மற்றும் மற்றவர்களுக்கு 45% மைக்ரோ-பாசன மானியத்தை மையம் உயர்த்தியது.",
        news5Title: "ஆர்கானிக் பண்ணை திட்டம் தொடங்கியது",
        news5Desc: "15 மாநிலங்களில் 10,000 கிளஸ்டர்களில் ஆர்கானிக் பண்ணையை ஊக்குவிக்க புதிய ₹3000 கோடி திட்டம்.",
        news6Title: "பயிர் காப்பீடு கோரிக்கைகள் வேகமாக்கப்பட்டன",
        news6Desc: "பாதிக்கப்பட்ட மாவட்டங்களில் வானிலை தொடர்பான பயிர் இழப்புகளுக்கு பிஎம்எஃபிஒய் கோரிக்கைகள் 30 நாட்களுக்குள் நிறைவேற்றப்படும்.",
        news7Title: "ஈ-என்ஏஎம் தளம் விரிவடைந்தது",
        news7Desc: "தேசிய வேளாண் சந்தை இப்போது 1000 மண்டிகளை இணைக்கிறது, நாடு முழுவதும் 1.5 கோடி விவசாயிகளுக்கு நன்மை பயக்கிறது.",
        news8Title: "சோலார் பம்ப் திட்டம் நீட்டிவது",
        news8Desc: "குசும் திட்டம் 2026க்குள் 20 லட்சம் சோலார் பம்புகளை நிறுவவும், விவசாயிகளுக்கு 30% மானியம்.",
        news9Title: "கோதுமை கொள்முதல் சாதனை உயர்ந்தது",
        news9Desc: "உணவு கழகம் 430 லட்சம் டன் கோதுமையை எம்எஸ்பி விலைகளில் கொண்டது, முந்தைய பருவத்தை விட 15% அதிகமாக.",
        news10Title: "மண் ஆரோக்கியம் கார்டுகள் வழங்கப்பட்டன",
        news10Desc: "11 கோடி மண் ஆரோக்கியம் கார்டுகள் வழங்கப்பட்டன, பரிந்துரைகளுடன் விவசாயிகள் உரவரச் செலவில் 15-20% சேமிக்கிறார்கள்.",
        news11Title: "வேளாண் கடன் இலக்கு நிறைவேற்றப்பட்டது",
        news11Desc: "வங்கிகள் ₹18.5 லட்சம் கோடி வேளாண் கடனை வழங்கினர், நிதியாண்டு 24க்கான இலக்கு ₹16.5 லட்சம் கோடியை மிஞ்சியது.",
        news12Title: "கோல்ட் ஸ்டோரேஜ் திறன் அதிகரிக்கப்பட்டது",
        news12Desc: "அறுவடை-பிந்தை இழப்புகளை 40% குறைக்க 500 லட்சம் டன் கோல்ட் ஸ்டோரேஜ் திறனை அரசு சேர்த்தது."
    }
};

// Translation helper function
function t(key, lang = 'en') {
    return translations[lang]?.[key] || translations['en'][key] || key;
}

// Get current language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('irrigationLanguage') || 'en';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('irrigationLanguage', lang);
    applyTranslations(lang);
}

// Apply translations to the page
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        el.textContent = t(key, lang);
    });
    
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        el.placeholder = t(key, lang);
    });
}

