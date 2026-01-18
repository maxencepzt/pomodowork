/**
 * Notifications Service
 * 
 * Handles scheduling and managing local notifications.
 * Uses expo-notifications for iOS/Android support.
 * Web platform is not supported - notifications are silently skipped.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationMode } from '@/types/settings';

const isWeb = Platform.OS === 'web';

// Configure how notifications are handled when app is in foreground
if (!isWeb) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

// Notification identifiers for cancellation
const NOTIFICATION_IDS = {
    BREAK_START: 'break-start',
    WORK_RESUME: 'work-resume',
} as const;

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
    if (isWeb) {
        return true; // Skip on web
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
        return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

/**
 * Schedule a notification for when a phase ends
 */
export async function schedulePhaseEndNotification(
    phase: 'work' | 'break',
    endTime: number,
    mode: NotificationMode
): Promise<string | null> {
    if (isWeb || mode === 'none') {
        return null;
    }

    const now = Date.now();
    const secondsUntil = Math.max(0, Math.floor((endTime - now) / 1000));

    if (secondsUntil <= 0) {
        return null;
    }

    const isBreakNotification = phase === 'work';
    const identifier = isBreakNotification ? NOTIFICATION_IDS.BREAK_START : NOTIFICATION_IDS.WORK_RESUME;

    // Cancel any existing notification with this identifier
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => { });

    const content: Notifications.NotificationContentInput = {
        title: isBreakNotification ? 'Break Time!' : 'Back to Work',
        body: isBreakNotification
            ? 'Great focus session. Take a well-deserved break.'
            : 'Break is over. Ready for another focused session?',
        sound: mode === 'sound' ? 'default' : false,
    };

    // Configure vibration based on mode
    if (Platform.OS === 'ios') {
        if (mode === 'vibration' || mode === 'repeatingVibration') {
            // iOS handles haptics differently, we'll trigger via haptics service
        }
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
        identifier,
        content,
        trigger: { seconds: secondsUntil, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
    });

    return notificationId;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    if (isWeb) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel a specific notification
 */
export async function cancelNotification(identifier: string): Promise<void> {
    if (isWeb) return;
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

/**
 * Add a listener for received notifications
 */
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription | null {
    if (isWeb) return null;
    return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add a listener for notification responses (user tapped notification)
 */
export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription | null {
    if (isWeb) return null;
    return Notifications.addNotificationResponseReceivedListener(callback);
}

export const notifications = {
    requestPermissions,
    schedulePhaseEndNotification,
    cancelAllNotifications,
    cancelNotification,
    addNotificationReceivedListener,
    addNotificationResponseListener,
    testNotification,
};

/**
 * Schedule a test notification for previewing sound
 */
export async function testNotification(mode: NotificationMode): Promise<void> {
    if (isWeb || mode === 'none') return;

    // For vibration, we just use haptics directly locally (no banner needed for preview)
    // But for sound, we need the banner to trigger the system sound
    if (mode === 'vibration') {
        return;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Sound Check',
            body: 'This is your notification sound.',
            sound: mode === 'sound' ? 'default' : false,
        },
        trigger: null, // Immediate
    });
}
