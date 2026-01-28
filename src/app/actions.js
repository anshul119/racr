"use server";

import { parseGpx } from "@/lib/gpx";
import { predictRaceTime } from "@/lib/prediction";

export async function uploadGpxAction(formData, userGap) {
    const file = formData.get("file");

    if (!file) {
        throw new Error("No file uploaded");
    }

    try {
        const text = await file.text();
        const courseData = parseGpx(text);

        let predictedTime = 0;
        if (userGap) {
            predictedTime = predictRaceTime(userGap, courseData.distance, courseData.elevationGain);
        }

        return {
            success: true,
            course: courseData,
            predictedTime: predictedTime
        };

    } catch (error) {
        console.error("Error processing GPX:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function predictManualAction(distance, elevation, userGap) {
    try {
        const courseData = {
            distance: parseFloat(distance),
            elevationGain: parseFloat(elevation)
        };

        let predictedTime = 0;
        if (userGap) {
            predictedTime = predictRaceTime(userGap, courseData.distance, courseData.elevationGain);
        }

        return {
            success: true,
            course: courseData,
            predictedTime: predictedTime
        };
    } catch (error) {
        console.error("Error processing manual input:", error);
        return {
            success: false,
            error: error.message
        };
    }
}
