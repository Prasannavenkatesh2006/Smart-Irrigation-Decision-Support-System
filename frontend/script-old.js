document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const planBtn = document.getElementById('plan-btn');
    const loading = document.getElementById('loading');
    const formContent = document.getElementById('irrigation-form');
    const resultCard = document.getElementById('result-card');
    const generateWeekBtn = document.getElementById('generate-week-btn');
    const exportReportJson = document.getElementById('export-report-json');
    const exportReportCsv = document.getElementById('export-report-csv');
    const langSelect = document.getElementById('language-select');

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
        });
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
        const rainMm = parseFloat(document.getElementById('rain_mm').value);

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
                errorMsg += 'Cannot connect to backend server. Please ensure the server is running (double-click start_backend.bat) and refresh this page.';
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
        document.getElementById('water-amount').textContent = data.water_amount.toLocaleString();
        document.getElementById('water-per-ha').textContent = data.water_per_hectare.toLocaleString();
        document.getElementById('display-crop').textContent = cropType.charAt(0).toUpperCase() + cropType.slice(1);
        document.getElementById('soil-moisture').textContent = data.soil_moisture.toFixed(1);
        document.getElementById('data-source').textContent = data.rag_context_used ? 'Source: RAG-Enhanced AI Analysis' : 'Source: Rule-Based Calculation';

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
            if (safetyHeader) safetyHeader.textContent = t('expertConsultationRequired', currentLang) || 'Expert Consultation Required';
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
            
            if (response.ok) {
                const data = await response.json();
                const savings = data.savings || {};

                document.getElementById('water-saved').textContent = (savings.water_saved || 0).toLocaleString();
                document.getElementById('ai-usage').textContent = (savings.smart_system_usage || 0).toLocaleString() + ' L';
                document.getElementById('fixed-usage').textContent = (savings.traditional_schedule || 0).toLocaleString() + ' L';
                serverConnected = true;
            }
        } catch (error) {
            if (error.name !== 'AbortError' && !error.message.includes('Failed to fetch') && !error.message.includes('ERR_CONNECTION_REFUSED')) {
                console.error('Unexpected error fetching weekly report:', error);
            }
            serverConnected = false;
            document.getElementById('water-saved').textContent = '0';
            document.getElementById('ai-usage').textContent = '0 L';
            document.getElementById('fixed-usage').textContent = '0 L';
        }
    }

    async function checkBackendConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            const response = await fetch(`${API_BASE}/`, {
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                serverConnected = true;
            }
        } catch (error) {
            serverConnected = false;
        }
    }

    function showErrorNotification(message) {
        const existing = document.getElementById('error-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'error-notification';
        notification.className = 'error-notification';
        notification.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(notification, container.firstChild);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    async function generateWeeklySchedule() {
        const cropType = document.getElementById('crop_type').value;
        const cropStage = document.getElementById('crop_stage').value;
        const fieldSize = parseFloat(document.getElementById('field_size').value);

        const generateWeekBtn = document.getElementById('generate-week-btn');
        if (!generateWeekBtn) return;

        generateWeekBtn.disabled = true;
        generateWeekBtn.textContent = 'Generating...';

        const container = document.getElementById('weekly-schedule-container');
        container.innerHTML = '<div class="loading" style="display: flex; justify-content: center; padding: 20px;"><div class="spinner"></div></div>';

        try {
            const response = await fetch(`${API_BASE}/weekly-schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    crop_type: cropType,
                    crop_stage: cropStage,
                    field_size: fieldSize,
                    rainfall_mm: null
                }),
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error('Failed to generate weekly schedule');
            }

            const data = await response.json();
            displayWeeklySchedule(data);

        } catch (error) {
            container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 20px;">Error: ${error.message}</p>`;
        } finally {
            generateWeekBtn.disabled = false;
            generateWeekBtn.textContent = 'Generate Week';
        }
    }

    function displayVerificationStatus(verificationStatus, lang = 'en') {
        const checklist = document.getElementById('verification-checklist');
        checklist.innerHTML = '';
        
        const currentLang = lang || getCurrentLanguage();
        
        const items = [
            { key: 'daily_plan_generated', label: 'Daily irrigation plan generated' },
            { key: 'rain_avoidance_applied', label: 'Rain avoidance logic applied' },
            { key: 'water_savings_calculated', label: 'Water savings calculated' },
            { key: 'sources_cited', label: 'Agricultural sources cited' },
            { key: 'safety_check_passed', label: 'Safety checks passed' },
            { key: 'agentic_features_active', label: 'Agentic AI features active' }
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

    function displayWeeklySchedule(data) {
        const container = document.getElementById('weekly-schedule-container');
        
        if (!data.schedule || data.schedule.length === 0) {
            container.innerHTML = '<p class="placeholder-text">No schedule data available</p>';
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
                            <span class="schedule-detail-label">Water Amount</span>
                            <span class="schedule-detail-value">${day.water_amount.toLocaleString()} L</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">Water per Hectare</span>
                            <span class="schedule-detail-value">${day.water_per_hectare.toLocaleString()} L/ha</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">Soil Moisture</span>
                            <span class="schedule-detail-value">${day.soil_moisture}%</span>
                        </div>
                        <div class="schedule-detail-item">
                            <span class="schedule-detail-label">Rainfall</span>
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

    async function exportWeeklyReport(format) {
        try {
            const response = await fetch(`${API_BASE}/export/weekly-report?format=${format}`, {
                method: 'GET',
                headers: {
                    'Accept': format === 'csv' ? 'text/csv' : 'application/json',
                },
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error('Failed to export report');
            }

            if (format === 'csv') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `weekly_report_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                const data = await response.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `weekly_report_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }

            showSuccessNotification(`Report exported as ${format.toUpperCase()} successfully!`);
        } catch (error) {
            showErrorNotification(`Export failed: ${error.message}`);
        }
    }

    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function saveSettings() {
        const settings = {
            cropType: document.getElementById('crop_type').value,
            cropStage: document.getElementById('crop_stage').value,
            fieldSize: document.getElementById('field_size').value
        };
        localStorage.setItem('irrigationSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem('irrigationSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                if (settings.cropType) document.getElementById('crop_type').value = settings.cropType;
                if (settings.cropStage) document.getElementById('crop_stage').value = settings.cropStage;
                if (settings.fieldSize) document.getElementById('field_size').value = settings.fieldSize;
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }

    async function checkRainAlerts() {
        try {
            const response = await fetch(`${API_BASE}/rain-alert?days_ahead=3`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.has_alerts && data.alerts.length > 0) {
                    const urgentAlert = data.alerts[0];
                    showRainAlert({
                        has_upcoming_rain: true,
                        next_rain_date: urgentAlert.date,
                        predicted_rainfall: urgentAlert.rainfall_mm,
                        alert_level: urgentAlert.alert_level,
                        message: urgentAlert.message
                    });
                }
            }
        } catch (error) {
            // Silently fail - alerts are optional
        }
    }

    function showRainAlert(alert) {
        const banner = document.getElementById('rain-alert-banner');
        const messageEl = document.getElementById('rain-alert-message');
        
        if (!banner || !messageEl) return;
        
        const lang = getCurrentLanguage();
        let message = alert.message || '';
        
        if (lang !== 'en') {
            if (alert.alert_level === 'high') {
                message = t('skipIrrigation', lang) + ': ' + 
                         t('rainPredicted', lang) + ` ${alert.predicted_rainfall.toFixed(1)}mm ` + 
                         t('date', lang).toLowerCase() + ` ${alert.next_rain_date}`;
            } else {
                message = t('reduceIrrigation', lang) + ': ' + 
                         t('rainPredicted', lang) + ` ${alert.predicted_rainfall.toFixed(1)}mm ` + 
                         t('date', lang).toLowerCase() + ` ${alert.next_rain_date}`;
            }
        }
        
        messageEl.textContent = message;
        
        banner.className = 'rain-alert-banner';
        if (alert.alert_level === 'medium') {
            banner.classList.add('medium');
        }
        
        banner.style.display = 'block';
    }
});
