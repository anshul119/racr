export async function getStravaActivities(accessToken) {
    const activities = [];
    let page = 1;
    const perPage = 50; // Fetch 50 at a time
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const afterTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

    // Safety limit to prevent infinite loops or hitting rate limits too hard
    const MAX_PAGES = 10;

    while (page <= MAX_PAGES) {
        try {
            const response = await fetch(
                `https://www.strava.com/api/v3/athlete/activities?after=${afterTimestamp}&per_page=${perPage}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.error("Strava API Error:", response.status, response.statusText);
                throw new Error(`Failed to fetch activities: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                break; // No more activities
            }

            activities.push(...data);
            page++;
        } catch (error) {
            console.error("Error fetching Strava activities:", error);
            break;
        }
    }

    // Filter for Run and TrailRun
    return activities.filter(
        (activity) => activity.type === "Run" || activity.type === "TrailRun"
    );
}

export function calculateUserGap(activities) {
    // Simple average of average_speed for now, can be more complex later
    // Strava activities have 'average_speed' in meters/second
    if (!activities || activities.length === 0) return 0;

    let totalSpeed = 0;
    let count = 0;

    activities.forEach(activity => {
        if (activity.average_speed) {
            totalSpeed += activity.average_speed;
            count++;
        }
    });

    return count > 0 ? totalSpeed / count : 0;
}
