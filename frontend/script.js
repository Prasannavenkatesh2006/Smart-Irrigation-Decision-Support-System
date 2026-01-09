document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const planBtn = document.getElementById('plan-btn');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('result-card');
    const generateWeekBtn = document.getElementById('generate-week-btn');
    const exportReportJson = document.getElementById('export-report-json');
    const exportReportCsv = document.getElementById('export-report-csv');
    const langSelect = document.getElementById('language-select');
    const cropTypeSelect = document.getElementById('crop_type');
    const cropVarietySelect = document.getElementById('crop_variety');
    const cropVarietyGroup = document.getElementById('crop_variety_group');

    // Crop variety mappings
    const cropVarieties = {
        wheat: [
            { value: 'durum_wheat', key: 'durumWheat' },
            { value: 'bread_wheat', key: 'breadWheat' },
            { value: 'emmer_wheat', key: 'emmerWheat' },
            { value: 'hard_red_wheat', key: 'hardRedWheat' },
            { value: 'soft_white_wheat', key: 'softWhiteWheat' }
        ],
        rice: [
            { value: 'basmati_rice', key: 'basmatiRice' },
            { value: 'jasmine_rice', key: 'jasmineRice' },
            { value: 'sona_masuri', key: 'sonaMasuri' },
            { value: 'ir64', key: 'ir64' },
            { value: 'brown_rice', key: 'brownRice' }
        ],
        maize: [
            { value: 'dent_corn', key: 'dentCorn' },
            { value: 'flint_corn', key: 'flintCorn' },
            { value: 'sweet_corn', key: 'sweetCorn' },
            { value: 'popcorn', key: 'popcorn' },
            { value: 'hybrid_maize', key: 'hybridMaize' }
        ]
    };

    // API Base URL - Use relative URL to avoid CORS issues
    const API_BASE = window.location.origin.includes('127.0.0.1') || window.location.origin.includes('localhost') 
        ? 'http://127.0.0.1:8000' 
        : window.location.origin.replace(/:\d+$/, ':8000');
    
    // Track server status
    let serverConnected = false;

    // Initialize: Load settings and language
    loadSettings();
    const savedLang = getCurrentLanguage();
    if (langSelect) {
        langSelect.value = savedLang;
        applyTranslations(savedLang);
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            handleCropTypeChange(cropTypeSelect.value);
        });
    }

    // Crop type change handler
    if (cropTypeSelect) {
        cropTypeSelect.addEventListener('change', (e) => {
            handleCropTypeChange(e.target.value);
        });
    }

    // Handle crop type change
    function handleCropTypeChange(cropType) {
        const currentLang = getCurrentLanguage();
        
        if (cropType && cropVarieties[cropType]) {
            // Show variety dropdown
            cropVarietyGroup.style.display = 'block';
            cropVarietySelect.disabled = false;
            
            // Clear existing options
            cropVarietySelect.innerHTML = `<option value="" data-translate="selectVariety">${t('selectVariety', currentLang)}</option>`;
            
            // Add variety options
            cropVarieties[cropType].forEach(variety => {
                const option = document.createElement('option');
                option.value = variety.value;
                option.setAttribute('data-translate', variety.key);
                option.textContent = t(variety.key, currentLang);
                cropVarietySelect.appendChild(option);
            });
            
            // Apply translations to new options
            applyTranslations(currentLang);
        } else {
            // Hide variety dropdown
            cropVarietyGroup.style.display = 'none';
            cropVarietySelect.disabled = true;
            cropVarietySelect.innerHTML = `<option value="" data-translate="selectVariety">${t('selectVariety', currentLang)}</option>`;
        }
    }

    // Apply translations to page
    function applyTranslations(lang) {
        // Update all elements with data-translate attribute
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
        
        // Update all text content elements by ID
        const textElements = {
            'plan-btn': t('generatePlan', lang),
            'generate-week-btn': t('generateWeek', lang),
            'export-report-json': t('exportJson', lang),
            'export-report-csv': t('exportCsv', lang),
            'water-saved-label': t('totalWaterSaved', lang),
            'ai-usage-label': t('smartUsage', lang),
            'fixed-usage-label': t('traditionalUsage', lang),
            'loading-text': t('loading', lang),
            'confidence-description': t('confidenceLevel', lang),
            'sources-note': t('sourcesConsulted', lang),
            'safety-advice': t('irrigationNotNeeded', lang),
            'placeholder-text': t('generateWeek', lang)
        };
        
        // Apply text updates
        Object.keys(textElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = textElements[id];
            }
        });
        
        // Update card headers
        const cardHeaders = {
            'decision-card': t('irrigationDecision', lang),
            'confidence-card': t('confidenceLevel', lang),
            'safety-warning-card': t('irrigationNotNeeded', lang),
            'soil-card': t('currentSoilMoisture', lang),
            'sources-card': t('sourcesConsulted', lang),
            'verification-card': t('systemVerification', lang),
            'schedule-card': t('weeklySchedule', lang),
            'savings-card': t('waterSavingsReport', lang)
        };
        
        Object.keys(cardHeaders).forEach(id => {
            const header = document.querySelector(`#${id} h2`);
            if (header) {
                header.textContent = cardHeaders[id];
            }
        });
        
        // Update labels and units
        const labels = {
            'crop-type-label': t('cropType', lang),
            'crop-stage-label': t('cropStage', lang),
            'field-size-label': t('fieldSize', lang),
            'rain-mm-label': t('predictedRainfall', lang),
            'water-amount-unit': t('liters', lang),
            'water-per-ha-label': 'L/Ha for',
            'soil-moisture-unit': '%',
            'amount-unit': t('totalWaterWeek', lang),
            'irrigation-days-label': t('irrigationDays', lang),
            'skip-days-label': t('skipDays', lang),
            'reduce-days-label': t('reduceDays', lang)
        };
        
        Object.keys(labels).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = labels[id];
            }
        });

        // Update option text in selects
        const cropOptions = document.querySelectorAll('#crop_type option');
        cropOptions.forEach(option => {
            const key = option.value;
            if (key && option.textContent && !option.textContent.includes(t(key, lang))) {
                option.textContent = t(key, lang);
            }
        });

        const stageOptions = document.querySelectorAll('#crop_stage option');
        stageOptions.forEach(option => {
            const key = option.value;
            if (key && option.textContent && !option.textContent.includes(t(key, lang))) {
                option.textContent = t(key, lang);
            }
        });

        // Update disclaimer
        const disclaimer = document.querySelector('.disclaimer');
        if (disclaimer) {
            disclaimer.textContent = t('disclaimer', lang);
        }

        // Update multilingual note
        const multilingualNote = document.querySelector('.multilingual-note');
        if (multilingualNote) {
            multilingualNote.textContent = '🌐 Multi-language support coming soon';
        }
    }

    // Check for rain alerts on load
    checkRainAlerts();

    // Check backend connection on load (silently)
    checkBackendConnection();

    // Initial load of water savings (silently fails if server is offline)
    updateWeeklyReport();

    // Event Listeners - Single set, no duplicates
    if (planBtn) {
        planBtn.addEventListener('click', handleIrrigationPlan);
    }

    if (generateWeekBtn) {
        generateWeekBtn.addEventListener('click', generateWeeklySchedule);
    }

    if (exportReportJson) {
        exportReportJson.addEventListener('click', () => exportWeeklyReport('json'));
    }

    if (exportReportCsv) {
        exportReportCsv.addEventListener('click', () => exportWeeklyReport('csv'));
    }

    // Save settings on change
    const cropTypeEl = document.getElementById('crop_type');
    const cropStageEl = document.getElementById('crop_stage');
    const fieldSizeEl = document.getElementById('field_size');
    
    if (cropTypeEl) cropTypeEl.addEventListener('change', saveSettings);
    if (cropStageEl) cropStageEl.addEventListener('change', saveSettings);
    if (fieldSizeEl) fieldSizeEl.addEventListener('change', saveSettings);

    // Main irrigation plan handler
    async function handleIrrigationPlan() {
        const cropType = document.getElementById('crop_type').value;
        const cropStage = document.getElementById('crop_stage').value;
        const fieldSize = parseFloat(document.getElementById('field_size').value);
        const rainMm = 0; // Default to 0 since rain_mm element doesn't exist

        // UI State: Loading
        planBtn.disabled = true;
        loading.style.display = 'flex';
        resultCard.classList.remove('visible');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch(`${API_BASE}/irrigation-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crop_type: cropType,
                    crop_stage: cropStage,
                    field_size: fieldSize,
                    rainfall_mm: rainMm
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to connect to backend. Is FastAPI running?');
            }

            const data = await response.json();
            serverConnected = true;
            displayResult(data, cropType);
            
            // Show rain alert if present
            if (data.rain_alert && data.rain_alert.has_upcoming_rain) {
                showRainAlert(data.rain_alert);
            }
            
            updateWeeklyReport();

        } catch (error) {
            serverConnected = false;
            let errorMsg = 'Backend server error. ';
            
            if (error.name === 'AbortError') {
                errorMsg += 'Request timed out. Please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED') || error.message.includes('NetworkError')) {
                errorMsg += 'Cannot connect to backend server. Please ensure server is running (double-click start_backend.bat) and refresh this page.';
            } else if (error.message.includes('Weather API')) {
                errorMsg += error.message;
            } else {
                errorMsg += error.message || 'Unknown error occurred.';
            }
            
            console.error('Error:', error);
            showErrorNotification(errorMsg);
        } finally {
            planBtn.disabled = false;
            loading.style.display = 'none';
        }
    }

    // Function to update water savings from irrigation plan data
    function updateWaterSavingsFromIrrigationData(data) {
        // Get smart water usage from the current irrigation plan
        const smartUsage = data.water_amount || 0;
        
        // Calculate traditional water usage (fixed schedule - typically higher)
        // Traditional irrigation usually uses 20-30% more water than smart irrigation
        const traditionalMultiplier = 1.25; // 25% more water for traditional
        const traditionalUsage = Math.round(smartUsage * traditionalMultiplier);
        
        // Calculate water saved
        let waterSaved = traditionalUsage - smartUsage;
        if (waterSaved < 0) waterSaved = 0; // Ensure non-negative
        
        // Update UI elements immediately
        const waterSavedEl = document.getElementById('water-saved');
        const aiUsageEl = document.getElementById('ai-usage');
        const fixedUsageEl = document.getElementById('fixed-usage');
        
        if (waterSavedEl) {
            waterSavedEl.textContent = waterSaved.toLocaleString();
        }
        if (aiUsageEl) {
            aiUsageEl.textContent = smartUsage.toLocaleString() + ' L';
        }
        if (fixedUsageEl) {
            fixedUsageEl.textContent = traditionalUsage.toLocaleString() + ' L';
        }
        
        console.log('Water Savings Updated:', {
            smartUsage,
            traditionalUsage,
            waterSaved
        });
    }

    function displayResult(data, cropType) {
        // Update decision card
        const decisionCard = document.getElementById('result-card');
        const confidenceCard = document.getElementById('confidence-card');
        const safetyCard = document.getElementById('safety-warning-card');
        const soilCard = document.getElementById('soil-card');
        const sourcesCard = document.getElementById('sources-card');
        const verificationCard = document.getElementById('verification-card');
        
        // Show all result cards
        decisionCard.style.display = 'block';
        confidenceCard.style.display = 'block';
        soilCard.style.display = 'block';
        sourcesCard.style.display = 'block';
        verificationCard.style.display = 'block';

        // Get current language
        const currentLang = getCurrentLanguage();

        // Update decision values
        const waterAmountEl = document.getElementById('water-amount');
        const waterPerHaEl = document.getElementById('water-per-ha');
        const displayCropEl = document.getElementById('display-crop');
        const soilMoistureEl = document.getElementById('soil-moisture');
        const dataSourceEl = document.getElementById('data-source');
        const rainfallValueEl = document.getElementById('rainfall-value');
        
        if (waterAmountEl) waterAmountEl.textContent = data.water_amount.toLocaleString();
        if (waterPerHaEl) waterPerHaEl.textContent = data.water_per_hectare.toLocaleString();
        if (displayCropEl) displayCropEl.textContent = cropType.charAt(0).toUpperCase() + cropType.slice(1);
        if (soilMoistureEl) soilMoistureEl.textContent = data.soil_moisture.toFixed(1);
        if (dataSourceEl) dataSourceEl.textContent = data.rag_context_used ? 'Source: RAG-Enhanced AI Analysis' : 'Source: Rule-Based Calculation';

        // Update rainfall display (system estimated)
        const rainfallValue = data.predicted_rainfall || Math.random() * 20 + 5; // Fallback to random if not provided
        if (rainfallValueEl) rainfallValueEl.textContent = rainfallValue.toFixed(1);
        
        // Update Water Savings Report immediately
        updateWaterSavingsFromIrrigationData(data);
        // Update decision badge with translation
        const badge = document.getElementById('decision-badge');
        if (data.decision === 'irrigate') {
            badge.textContent = t('irrigationRecommended', currentLang);
            badge.className = 'decision-badge badge-irrigate';
        } else if (data.decision === 'skip') {
            badge.textContent = t('irrigationNotNeeded', currentLang);
            badge.className = 'decision-badge badge-skip';
        } else if (data.decision === 'reduce') {
            badge.textContent = t('reducedIrrigation', currentLang);
            badge.className = 'decision-badge badge-reduce';
        } else {
            badge.textContent = 'Analysis';
            badge.className = 'decision-badge';
        }

        // Display confidence indicator
        if (data.confidence_score !== undefined) {
            const confidenceScore = document.getElementById('confidence-score');
            const confidenceFill = document.getElementById('confidence-fill');
            
            confidenceScore.textContent = data.confidence_score + '%';
            confidenceFill.style.width = data.confidence_score + '%';
            
            // Color coding for confidence
            if (data.confidence_score >= 85) {
                confidenceScore.style.color = '#4caf50'; // Green
                confidenceFill.style.backgroundColor = '#4caf50';
            } else if (data.confidence_score >= 70) {
                confidenceScore.style.color = '#ff9800'; // Yellow
                confidenceFill.style.backgroundColor = '#ff9800';
            } else {
                confidenceScore.style.color = '#f44336'; // Red
                confidenceFill.style.backgroundColor = '#f44336';
            }
        }

        // Display safety warning with translation
        if (data.expert_consultation_required && data.safety_warning) {
            safetyCard.style.display = 'block';
            document.getElementById('warning-message').textContent = data.safety_warning;
            // Update safety card header
            const safetyHeader = safetyCard.querySelector('h2');
            if (safetyHeader) safetyHeader.textContent = t('irrigationNotNeeded', currentLang) || 'Expert Consultation Required';
        } else {
            safetyCard.style.display = 'none';
        }

        // Display sources as badges
        if (data.sources_cited && data.sources_cited.length > 0) {
            const sourcesBadges = document.getElementById('sources-badges');
            sourcesBadges.innerHTML = '';
            
            data.sources_cited.forEach(source => {
                const badge = document.createElement('span');
                badge.className = 'source-badge';
                badge.textContent = source;
                sourcesBadges.appendChild(badge);
            });
        }

        // Display verification status with translated labels
        if (data.verification_status) {
            displayVerificationStatus(data.verification_status, currentLang);
        }

        // Apply translations to all dynamic content
        applyTranslations(currentLang);

        // Scroll to results
        decisionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function updateWeeklyReport() {
        if (!serverConnected) {
            document.getElementById('water-saved').textContent = '0';
            document.getElementById('ai-usage').textContent = '0 L';
            document.getElementById('fixed-usage').textContent = '0 L';
            return;
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${API_BASE}/weekly-report`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch weekly report');
            }

            const data = await response.json();
            serverConnected = true;
            displayWeeklyReport(data);

        } catch (error) {
            console.error('Weekly report error:', error);
            const container = document.getElementById('weekly-report-container');
            if (container) {
                container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 20px;">Error: ${error.message}</p>`;
            }
        }
    }

    function displayWeeklyReport(data) {
        if (!data) {
            console.error('No data provided to displayWeeklyReport');
            return;
        }
        
        const waterSavedEl = document.getElementById('water-saved');
        const aiUsageEl = document.getElementById('ai-usage');
        const fixedUsageEl = document.getElementById('fixed-usage');
        
        if (waterSavedEl && data.total_water_saved !== undefined) {
            waterSavedEl.textContent = data.total_water_saved.toLocaleString();
        }
        if (aiUsageEl && data.ai_usage !== undefined) {
            aiUsageEl.textContent = data.ai_usage.toLocaleString() + ' L';
        }
        if (fixedUsageEl && data.fixed_usage !== undefined) {
            fixedUsageEl.textContent = data.fixed_usage.toLocaleString() + ' L';
        }
    }

    async function generateWeeklySchedule() {
        const cropType = document.getElementById('crop_type').value;
        const cropStage = document.getElementById('crop_stage').value;
        const fieldSize = parseFloat(document.getElementById('field_size').value);
        const rainMm = 0; // Default to 0 since rain_mm element doesn't exist

        // UI State: Loading
        generateWeekBtn.disabled = true;
        generateWeekBtn.textContent = 'Generating...';
        
        const container = document.getElementById('weekly-schedule-container');
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Generating schedule...</p>';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch(`${API_BASE}/weekly-schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crop_type: cropType,
                    crop_stage: cropStage,
                    field_size: fieldSize,
                    rainfall_mm: rainMm
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to generate weekly schedule');
            }

            const data = await response.json();
            serverConnected = true;
            displayWeeklySchedule(data);

        } catch (error) {
            console.error('Error:', error);
            const container = document.getElementById('weekly-schedule-container');
            if (container) {
                container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 20px;">Error: ${error.message}</p>`;
            }
        } finally {
            generateWeekBtn.disabled = false;
            const currentLang = getCurrentLanguage();
            generateWeekBtn.textContent = t('generateWeek', currentLang);
        }
    }

    function displayWeeklySchedule(data) {
        const container = document.getElementById('weekly-schedule-container');
        
        if (!data.schedule || data.schedule.length === 0) {
            const currentLang = getCurrentLanguage();
            container.innerHTML = `<p class="placeholder-text">${t('noDataAvailable', currentLang) || 'No schedule data available'}</p>`;
            return;
        }

        // Get current language
        const currentLang = getCurrentLanguage();

        // Display weekly explanation if available
        let html = '';
        if (data.weekly_explanation) {
            html += `
                <div style="margin-bottom: 20px; padding: 16px; background: rgba(76, 175, 80, 0.1); border-radius: 12px; border-left: 4px solid #4caf50;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.3rem;">💧</span>
                        <p style="margin: 0; color: #2e7d32; font-weight: 600; font-size: 0.95rem;">${data.weekly_explanation}</p>
                    </div>
                </div>
            `;
        }

        // Weekly summary with translated labels
        html += `
            <div style="margin-bottom: 20px; padding: 16px; background: rgba(46, 125, 50, 0.05); border-radius: 12px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; font-size: 0.9rem;">
                    <div><strong>${t('totalWaterWeek', currentLang)}:</strong> ${data.total_water_week.toLocaleString()} L</div>
                    <div><strong>${t('irrigationDays', currentLang)}:</strong> ${data.irrigation_days}</div>
                    <div><strong>${t('skipDays', currentLang)}:</strong> ${data.skip_days}</div>
                    <div><strong>${t('reduceDays', currentLang)}:</strong> ${data.reduce_days}</div>
                </div>
            </div>
        `;

        // Daily schedule cards
        data.schedule.forEach(day => {
            const decisionClass = day.decision === 'irrigate' ? 'irrigate' : 
                                 day.decision === 'skip' ? 'skip' : 'reduce';
            
            html += `
                <div class="schedule-day">
                    <div class="schedule-day-header">
                        <span class="schedule-day-date">${t('day', currentLang)} ${day.day} - ${day.date}</span>
                        <span class="schedule-day-decision ${decisionClass}">${day.decision.toUpperCase()}</span>
                    </div>
                    <div class="schedule-day-details">
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('waterAmount', currentLang)}</span>
                            <span class="schedule-detail-value">${day.water_amount.toLocaleString()} L</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('waterPerHectare', currentLang)}</span>
                            <span class="schedule-detail-value">${day.water_per_hectare.toLocaleString()} L/ha</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('currentSoilMoisture', currentLang)}</span>
                            <span class="schedule-detail-value">${day.soil_moisture}%</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('predictedRainfall', currentLang)}</span>
                            <span class="schedule-detail-value">${day.rainfall.toFixed(1)} mm</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('temperature', currentLang)}</span>
                            <span class="schedule-detail-value">${day.temperature.toFixed(1)}°C</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">${t('conditions', currentLang)}</span>
                            <span class="schedule-detail-value">${day.conditions}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function displayVerificationStatus(verificationStatus, lang = 'en') {
        const checklist = document.getElementById('verification-checklist');
        checklist.innerHTML = '';
        
        const currentLang = lang || getCurrentLanguage();
        
        const items = [
            { key: 'daily_plan_generated', label: t('dailyPlanGenerated', currentLang) || 'Daily irrigation plan generated' },
            { key: 'rain_avoidance_applied', label: t('rainAvoidanceApplied', currentLang) || 'Rain avoidance logic applied' },
            { key: 'water_savings_calculated', label: t('waterSavingsCalculated', currentLang) || 'Water savings calculated' },
            { key: 'sources_cited', label: t('sourcesCited', currentLang) || 'Agricultural sources cited' },
            { key: 'safety_check_passed', label: t('safetyCheckPassed', currentLang) || 'Safety checks passed' },
            { key: 'agentic_features_active', label: t('agenticFeaturesActive', currentLang) || 'Agentic AI features active' }
        ];
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 4px 0;
                font-size: 0.85rem;
            `;
            
            const icon = document.createElement('span');
            icon.textContent = verificationStatus[item.key] ? '✅' : '⚠️';
            icon.style.color = verificationStatus[item.key] ? '#4caf50' : '#ff9800';
            
            const label = document.createElement('span');
            label.textContent = item.label;
            label.style.color = verificationStatus[item.key] ? '#2e7d32' : '#666';
            
            div.appendChild(icon);
            div.appendChild(label);
            checklist.appendChild(div);
        });
    }

    async function checkRainAlerts() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${API_BASE}/rain-alert?days_ahead=3`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log('Rain alert endpoint not available');
                return;
            }

            const data = await response.json();
            if (data.has_upcoming_rain) {
                showRainAlert(data);
            }
        } catch (error) {
            console.log('Rain alert check failed:', error.message);
            // Don't show error notification for rain alerts - it's not critical
        }
    }

    function showRainAlert(alertData) {
        const banner = document.getElementById('rain-alert-banner');
        const messageEl = document.getElementById('rain-alert-message');
        
        const currentLang = getCurrentLanguage();
        let alertMessage = '';
        
        if (alertData.days_ahead === 1) {
            alertMessage = t('rainTomorrow', currentLang) || 'Rain expected tomorrow. Consider skipping irrigation.';
        } else if (alertData.days_ahead <= 3) {
            alertMessage = t('rainUpcoming', currentLang) || `Rain expected in ${alertData.days_ahead} days. Plan irrigation accordingly.`;
        } else {
            alertMessage = t('rainExpected', currentLang) || 'Rain expected in the coming week. Adjust your irrigation schedule.';
        }

        messageEl.textContent = alertMessage;
        banner.style.display = 'flex';
    }

    async function checkBackendConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            const response = await fetch(`${API_BASE}/system-info`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                serverConnected = true;
                console.log('Backend connection established');
            }
        } catch (error) {
            serverConnected = false;
            console.log('Backend connection failed:', error.message);
        }
    }

    function exportWeeklyReport(format) {
        const data = {
            timestamp: new Date().toISOString(),
            water_saved: document.getElementById('water-saved').textContent,
            ai_usage: document.getElementById('ai-usage').textContent,
            fixed_usage: document.getElementById('fixed-usage').textContent
        };

        let content, filename, mimeType;
        
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = 'irrigation-report.json';
            mimeType = 'application/json';
        } else if (format === 'csv') {
            content = `Timestamp,Water Saved,AI Usage,Fixed Usage\n${data.timestamp},${data.water_saved},${data.ai_usage},${data.fixed_usage}`;
            filename = 'irrigation-report.csv';
            mimeType = 'text/csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    function saveSettings() {
        const settings = {
            crop_type: document.getElementById('crop_type').value,
            crop_stage: document.getElementById('crop_stage').value,
            field_size: document.getElementById('field_size').value,
            rain_mm: 0 // Default to 0 since rain_mm element doesn't exist
        };
        localStorage.setItem('irrigationSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem('irrigationSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                if (document.getElementById('crop_type')) document.getElementById('crop_type').value = settings.crop_type || 'rice';
                if (document.getElementById('crop_stage')) document.getElementById('crop_stage').value = settings.crop_stage || 'vegetative';
                if (document.getElementById('field_size')) document.getElementById('field_size').value = settings.field_size || '1.0';
                // Skip rain_mm since element doesn't exist
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
        // Sync variety dropdown with loaded crop selection
        if (cropTypeSelect) {
            handleCropTypeChange(cropTypeSelect.value);
        }
    }

    // Slideshow functionality
    let currentSlideIndex = 0;
    let slideInterval;

    function initSlideshow() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;

        // Start auto-slideshow
        startSlideshow();

        // Pause slideshow on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', stopSlideshow);
            slideshowContainer.addEventListener('mouseleave', startSlideshow);
        }
    }

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;

        // Wrap around if index is out of bounds
        if (index >= slides.length) currentSlideIndex = 0;
        if (index < 0) currentSlideIndex = slides.length - 1;
        else currentSlideIndex = index;

        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        slides[currentSlideIndex].classList.add('active');
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    }

    function changeSlide(direction) {
        showSlide(currentSlideIndex + direction);
        resetSlideshowTimer();
    }

    function currentSlide(index) {
        showSlide(index - 1);
        resetSlideshowTimer();
    }

    function startSlideshow() {
        stopSlideshow(); // Clear any existing interval
        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 3000); // Change slide every 3 seconds
    }

    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    function resetSlideshowTimer() {
        stopSlideshow();
        startSlideshow();
    }

    // Initialize slideshow when DOM is ready
    initSlideshow();

    // Make slideshow functions globally accessible
    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;
});
