/**
 * Haptics Service
 * 
 * Provides tactile feedback for timer events.
 */

import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';
import type { NotificationMode } from '@/types/settings';

/**
 * Trigger haptic feedback based on notification mode
 */
export async function triggerHaptic(mode: NotificationMode): Promise<void> {
    if (mode === 'none' || mode === 'sound') {
        return;
    }

    if (mode === 'vibration') {
        // User requested "grosse vibration" (strong buzzer), not "clac-clac" (haptics)
        // Vibration.vibrate() uses the standard motor which feels stronger/longer
        // On iOS, this triggers a standard vibration (~400ms). We can loop it to make it feel "heavy".
        // Pattern: Wait 0ms, Vibrate 1000ms, Wait 1000ms, Vibrate 1000ms (Android)
        // iOS ignores duration, so we just call it.

        Vibration.vibrate([0, 800, 200, 800]);
    } else if (mode === 'repeatingVibration') {
        // Legacy/Unused
    }
}

/**
 * Light haptic for button presses
 */
export async function lightImpact(): Promise<void> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Medium haptic for significant actions
 */
export async function mediumImpact(): Promise<void> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Selection haptic for toggles and pickers
 */
export async function selectionFeedback(): Promise<void> {
    await Haptics.selectionAsync();
}

export const haptics = {
    triggerHaptic,
    lightImpact,
    mediumImpact,
    selectionFeedback,
};
