import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStravaActivities } from "@/lib/strava";
import { calculateUserMetrics } from "@/lib/prediction";
import DashboardView from "@/components/DashboardView";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    // Fetch activities (Server Side)
    // Note: session.accessToken should be populated by our callbacks in auth.js
    const activities = await getStravaActivities(session.accessToken);
    const metrics = calculateUserMetrics(activities);

    return (
        <DashboardView
            user={session.user}
            userMetrics={metrics}
        />
    );
}
