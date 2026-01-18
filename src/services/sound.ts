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
const SILENCE_SOUND = require('@/../assets/sounds/silence.mp3');

let alarmSound: Audio.Sound | null = null;
let silenceSound: Audio.Sound | null = null;

export async function playSound() {
    try {
        await configureAudio();

        // Stop silence if running, to ensure clean audio
        await stopSilence();

        // Load if not loaded
        if (!alarmSound) {
            const { sound } = await Audio.Sound.createAsync(
                ALARM_SOUND,
                { shouldPlay: true }
            );
            alarmSound = sound;
        } else {
            await alarmSound.replayAsync();
        }
    } catch (error) {
        console.warn('Failed to play sound', error);
    }
}

export async function playSilence() {
    try {
        await configureAudio();

        if (!silenceSound) {
            const { sound } = await Audio.Sound.createAsync(
                SILENCE_SOUND,
                { shouldPlay: true, isLooping: true, volume: 0.0 } // Silent volume just in case
            );
            silenceSound = sound;
        } else {
            await silenceSound.playAsync();
        }
    } catch (error) {
        console.warn('Failed to play silence', error);
    }
}

export async function stopSilence() {
    try {
        if (silenceSound) {
            await silenceSound.stopAsync();
            // Optional: unload if we want to save memory, but keeping it loaded is faster
        }
    } catch (error) {
        console.warn('Failed to stop silence', error);
    }
}

export async function stopAll() {
    if (alarmSound) await alarmSound.stopAsync();
    if (silenceSound) await silenceSound.stopAsync();
}

async function configureAudio() {
    await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        // Ensure mixing is allowed if needed, though we stop silence before alarm
    });
}

export const soundService = {
    playSound,
    playSilence,
    stopSilence,
    stopAll,
};
