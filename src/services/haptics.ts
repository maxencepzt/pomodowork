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
        // User requested "powerful" vibration implies strong feedback
        // Error provides a distinct triple-pulse on iOS
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        // Add a follow-up heavy impact for extra "power"
        setTimeout(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 300);
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
