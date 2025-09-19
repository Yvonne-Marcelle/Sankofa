class SankofaApp {
    constructor() {
        this.apiUrl = 'https://lol3gha6r8.execute-api.us-east-1.amazonaws.com/prod/synthesize'; // Will be updated after deployment
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadVoices();
    }

    bindEvents() {
        document.getElementById('synthesizeBtn').addEventListener('click', () => {
            this.synthesizeSpeech();
        });

        document.getElementById('textInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.synthesizeSpeech();
            }
        });
    }

    async loadVoices() {
        const voices = [
            { id: 'Joanna', name: 'Joanna (Female)' },
            { id: 'Matthew', name: 'Matthew (Male)' },
            { id: 'Ivy', name: 'Ivy (Child)' },
            { id: 'Justin', name: 'Justin (Child)' },
            { id: 'Kendra', name: 'Kendra (Female)' },
            { id: 'Kimberly', name: 'Kimberly (Female)' }
        ];

        const voiceSelect = document.getElementById('voiceSelect');
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.id;
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });
    }

    async synthesizeSpeech() {
        const text = document.getElementById('textInput').value.trim();
        const voiceId = document.getElementById('voiceSelect').value;
        const outputFormat = document.getElementById('formatSelect').value;

        if (!text) {
            this.showError('Please enter some text to convert to speech.');
            return;
        }

        if (text.length > 3000) {
            this.showError('Text exceeds maximum length of 3000 characters.');
            return;
        }

        this.showLoading(true);
        this.hideError();
        this.hideOutput();

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voiceId: voiceId,
                    outputFormat: outputFormat,
                    engine: 'neural'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to synthesize speech');
            }

            this.displayAudio(data.audioUrl, data.filename, voiceId);

        } catch (error) {
            this.showError(error.message || 'An error occurred while processing your request.');
        } finally {
            this.showLoading(false);
        }
    }

    displayAudio(audioUrl, filename, voiceId) {
        const audioPlayer = document.getElementById('audioPlayer');
        const downloadLink = document.getElementById('downloadLink');
        const audioInfo = document.getElementById('audioInfo');
        const outputSection = document.getElementById('outputSection');

        audioPlayer.src = audioUrl;
        downloadLink.href = audioUrl;
        downloadLink.download = filename;
        audioInfo.textContent = `Voice: ${voiceId} | Generated: ${new Date().toLocaleTimeString()}`;
        outputSection.style.display = 'block';

        audioPlayer.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const synthesizeBtn = document.getElementById('synthesizeBtn');
        
        if (show) {
            loading.style.display = 'block';
            synthesizeBtn.disabled = true;
            synthesizeBtn.textContent = 'Processing...';
        } else {
            loading.style.display = 'none';
            synthesizeBtn.disabled = false;
            synthesizeBtn.textContent = '🔄 Generate Speech';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    hideOutput() {
        document.getElementById('outputSection').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.sankofaApp = new SankofaApp();
});

function updateApiUrl(apiUrl) {
    window.sankofaApp.apiUrl = apiUrl;
}
