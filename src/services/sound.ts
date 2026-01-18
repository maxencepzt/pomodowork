/**
 * Sound Service
 * 
 * Handles playing audio for timer alerts and previews.
 * Uses expo-av for playback.
 */

import { Audio } from 'expo-av';

// We will use a require for the asset. 
// For now, I'll comment it out or use a dummy until the user provides the file.
// Or better: Expect 'assets/sounds/timer_alarm.mp3'
const ALARM_SOUND = require('@/../assets/sounds/timer_alarm.mp3');

let soundObject: Audio.Sound | null = null;

export async function playSound() {
    try {
        // Configure audio to play even in silent mode (important for timers)
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });

        // Load if not loaded
        if (!soundObject) {
            const { sound } = await Audio.Sound.createAsync(
                ALARM_SOUND,
                { shouldPlay: true }
            );
            soundObject = sound;
        } else {
            // Replay
            await soundObject.replayAsync();
        }
    } catch (error) {
        console.warn('Failed to play sound', error);
    }
}

export async function unloadSound() {
    if (soundObject) {
        await soundObject.unloadAsync();
        soundObject = null;
    }
}

export const soundService = {
    playSound,
    unloadSound,
};
