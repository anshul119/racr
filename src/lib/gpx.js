import { DOMParser } from "@xmldom/xmldom";
import toGeoJSON from "@mapbox/togeojson";

export function parseGpx(gpxString) {
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxString, "text/xml");
    const act = toGeoJSON.gpx(gpxDoc);

    // act is a GeoJSON FeatureCollection
    // We expect a LineString feature for the track
    const track = act.features.find(f => f.geometry.type === "LineString");

    if (!track) {
        throw new Error("No track found in GPX file");
    }

    const coordinates = track.geometry.coordinates; // [lon, lat, ele, time?]

    // Calculate total distance and elevation gain
    let totalDistance = 0;
    let totalElevationGain = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const p1 = coordinates[i];
        const p2 = coordinates[i + 1];

        // Distance (Haversine or simple approximation)
        const d = getDistanceFromLatLonInM(p1[1], p1[0], p2[1], p2[0]);
        totalDistance += d;

        // Elevation (index 2)
        const ele1 = p1[2] || 0;
        const ele2 = p2[2] || 0;

        if (ele2 > ele1) {
            totalElevationGain += (ele2 - ele1);
        }
    }

    return {
        distance: totalDistance, // meters
        elevationGain: totalElevationGain, // meters
        points: coordinates.length // just for info
    };
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000; // meters
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
