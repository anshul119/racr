/**
 * Calculate Grade Adjusted Pace (GAP) from a set of activities.
 * For MVP, we'll use the average speed as a proxy if GAP isn't directly available.
 * Strava provides 'average_speed' (m/s).
 * 
 * Future improvement: Use elevation gain/loss to adjust the pace manually if Strava
 * doesn't provide GAP in the summary activity object (it often doesn't).
 */
export function calculateUserMetrics(activities) {
    if (!activities || activities.length === 0) {
        return {
            totalDistance: 0, // meters
            averagePace: 0, // seconds per km
            recentGap: 0, // seconds per km
            activityCount: 0,
        };
    }

    let totalDistance = 0;
    let totalTime = 0;
    let weightedSpeedSum = 0;

    activities.forEach(activity => {
        totalDistance += activity.distance;
        totalTime += activity.moving_time;
        // user's average speed in m/s
        weightedSpeedSum += activity.average_speed * activity.distance;
    });

    const averageSpeed = totalDistance > 0 ? weightedSpeedSum / totalDistance : 0; // m/s

    // Convert m/s to Pace (min/km) for display, but keep seconds/km for internal math
    const paceSecondsPerKm = averageSpeed > 0 ? 1000 / averageSpeed : 0;

    return {
        totalDistance,
        averagePace: paceSecondsPerKm,
        // For now, assuming GAP is similar to average pace on flat-ish terrain
        // In a real app, we'd fetch detailed activity streams to calculate GAP properly
        recentGap: paceSecondsPerKm,
        activityCount: activities.length,
    };
}

/**
 * Predict finish time for a course based on distance and elevation.
 * This is a naive implementation for the MVP.
 * 
 * @param {number} userGap - User's Grade Adjusted Pace (seconds/km)
 * @param {number} courseDistance - Course distance in meters
 * @param {number} courseElevationGain - Course elevation gain in meters
 */
export function predictRaceTime(userGap, courseDistance, courseElevationGain) {
    if (!userGap || !courseDistance) return 0;

    const distanceKm = courseDistance / 1000;

    // Naive Tobler's Hiking Function adaptation or similar rule of thumb:
    // Add time for elevation. Common rule: +1 min per 100m gain?
    // Let's use a simple modifier: +X seconds per meter of gain.
    // Standard implementation: 4s slowing per meter of gain (very rough approximation for running)

    // Base time on flat ground
    const baseTimeSeconds = userGap * distanceKm;

    // Elevation penalty
    // A common trail running estimation: roughly 100m gain ~= 1km flat distance equivalent.
    // So for every 100m gain, add "userGap" seconds.
    // elevationFactor = (Elevation / 100) * userGap

    const elevationPenalty = (courseElevationGain / 100) * userGap;
    const predictedSeconds = baseTimeSeconds + elevationPenalty;

    return predictedSeconds;
}

export function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

export function formatPace(secondsPerKm) {
    const m = Math.floor(secondsPerKm / 60);
    const s = Math.floor(secondsPerKm % 60);
    return `${m}:${s.toString().padStart(2, '0')}/km`;
}
