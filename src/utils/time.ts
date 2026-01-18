/**
 * Time Formatting Utilities
 */

/**
 * Format milliseconds to MM:SS display
 */
export function formatTimeDisplay(ms: number): string {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format milliseconds to human-readable duration
 * e.g., "25 min", "1h 30min"
 */
export function formatDuration(ms: number): string {
    const totalMinutes = Math.round(ms / (60 * 1000));

    if (totalMinutes < 60) {
        return `${totalMinutes} min`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${minutes}min`;
}

/**
 * Format hours to display string
 */
export function formatHours(hours: number): string {
    if (hours === Math.floor(hours)) {
        return `${hours}h`;
    }
    return `${hours}h`;
}
