import { useEffect, useState } from 'react';
import ttsService from '../services/ttsService';

export default function useTTS() {
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const fetchVoices = () => {
            setVoices(ttsService.voices);
        };

        setTimeout(fetchVoices, 200);

        // Warm-up only on first user interaction
        const handleClick = () => {
            ttsService.warmUp?.();
            window.removeEventListener('click', handleClick);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return {
        speak: ttsService.speak.bind(ttsService),
        cancel: ttsService.cancel.bind(ttsService),
        voices,
    };
}
