// src/services/ttsService.js

class TTSService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.defaultOptions = {
            rate: 1,
            pitch: 1,
            volume: 1,
            voice: null,
        };

        this._loadVoices();
    }

    _loadVoices() {
        const load = () => {
            this.voices = this.synth.getVoices();

            // Strict match: includes "Male" but not "Female"
            const maleVoice = this.voices.find((voice) => {
                const name = voice.name.toLowerCase();
                return name.includes('male') && !name.includes('female');
            });

            if (maleVoice) {
                this.defaultOptions.voice = maleVoice;
                console.log('✅ Default male voice set to:', maleVoice.name);
            } else {
                this.defaultOptions.voice = null; // fallback to browser default
                console.warn('⚠️ No male voice found. Using system default voice.');
            }
        };

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = load;
        }

        // Fallback call if onvoiceschanged doesn't fire
        setTimeout(load, 100);
    }


    speak(text, options = {}) {
        // if (!text) return;
        this.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const opts = { ...this.defaultOptions, ...options };

        utterance.rate = opts.rate;
        utterance.pitch = opts.pitch;
        utterance.volume = opts.volume;
        if (opts.voice) utterance.voice = opts.voice;

        this.synth.speak(utterance);
    }

    cancel() {
        this.synth.cancel();
    }

    warmUp() {
        const utterance = new SpeechSynthesisUtterance(' ');
        utterance.volume = 0;
        this.synth.speak(utterance);
    }
}

const ttsService = new TTSService();
export default ttsService;
