/**
 * Haptics Service
 * 
 * Provides tactile feedback for timer events.
 */

import * as Haptics from 'expo-haptics';
import type { NotificationMode } from '@/types/settings';

/**
 * Trigger haptic feedback based on notification mode
 */
export async function triggerHaptic(mode: NotificationMode): Promise<void> {
    if (mode === 'none' || mode === 'sound') {
        return;
    }

    if (mode === 'vibration') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (mode === 'repeatingVibration') {
        // Trigger multiple haptics with delay for "alarm" effect
        for (let i = 0; i < 3; i++) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
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
