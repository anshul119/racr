"use client";

import { useState, useRef } from "react";
import { formatPace, formatDuration } from "@/lib/prediction";
import { uploadGpxAction, predictManualAction, syncData } from "@/app/actions";
import { Box, Button, Card, Container, Flex, Grid, Heading, Text, Tabs, TextField } from "@radix-ui/themes";
import { signOut } from "next-auth/react";

export default function DashboardView({ userMetrics, user }) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);

    // Manual Input State
    const [manualDistance, setManualDistance] = useState("");
    const [manualElevation, setManualElevation] = useState("");

    const fileInputRef = useRef(null);

    const resetState = () => {
        setPrediction(null);
        setError(null);
    };

    const handleSync = async () => {
        setSyncing(true);
        await syncData();
        setSyncing(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        resetState();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadGpxAction(formData, userMetrics.recentGap);
            if (result.success) {
                setPrediction(result);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to upload file");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        resetState();

        try {
            // Convert km to meters for the backend
            const distanceMeters = parseFloat(manualDistance) * 1000;
            const elevationMeters = parseFloat(manualElevation);

            const result = await predictManualAction(distanceMeters, elevationMeters, userMetrics.recentGap);
            if (result.success) {
                setPrediction(result);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to calculate prediction");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <Container size="3" p="4">
            <Flex justify="between" align="center" py="5" mb="5" style={{ borderBottom: '1px solid var(--gray-5)' }}>
                <Flex align="center" gap="3">
                    <Heading size="6" weight="bold">Racr</Heading>
                    <Box px="2" py="1" style={{ backgroundColor: 'var(--gray-3)', borderRadius: 'var(--radius-2)' }}>
                        <Text size="1" weight="medium" color="gray">BETA</Text>
                    </Box>
                </Flex>

                <Flex align="center" gap="4">
                    <Text size="2" color="gray" weight="medium">{user?.name}</Text>

                    <Button variant="soft" color="gray" onClick={handleSync} disabled={syncing}>
                        {syncing ? "Syncing..." : "Sync"}
                    </Button>

                    <Button variant="outline" color="gray" onClick={() => signOut({ callbackUrl: "/" })}>
                        Sign Out
                    </Button>
                </Flex>
            </Flex>

            <Grid columns={{ initial: '1', md: '2' }} gap="6">
                {/* Stats Section */}
                <Box>
                    <Heading size="4" mb="4">Performance Profile</Heading>

                    <Card variant="surface">
                        <Grid columns="2" gap="4" mb="6">
                            <Box>
                                <Text as="div" size="2" color="gray" mb="1">Annual Distance</Text>
                                <Flex align="baseline" gap="2">
                                    <Text size="6" weight="bold">{(userMetrics.totalDistance / 1000).toFixed(0)}</Text>
                                    <Text size="2" color="gray">km</Text>
                                </Flex>
                            </Box>
                            <Box>
                                <Text as="div" size="2" color="gray" mb="1">Activities</Text>
                                <Text as="div" size="6" weight="bold">{userMetrics.activityCount}</Text>
                            </Box>
                        </Grid>

                        <Box pt="4" style={{ borderTop: '1px solid var(--gray-5)' }}>
                            <Text as="div" size="1" color="orange" weight="bold" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} mb="1">Estimated GAP</Text>
                            <Text as="div" size="8" weight="medium" style={{ fontFamily: 'monospace', letterSpacing: '-0.03em' }}>
                                {formatPace(userMetrics.recentGap)}
                            </Text>
                            <Text as="p" size="2" color="gray" mt="2">
                                Your historical Grade Adjusted Pace, calculated from your last year of running.
                            </Text>
                        </Box>
                    </Card>
                </Box>

                {/* Prediction Section */}
                <Box>
                    <Heading size="4" mb="4">New Prediction</Heading>
                    <Card size="3">
                        <Tabs.Root defaultValue="file" onValueChange={resetState}>
                            <Tabs.List>
                                <Tabs.Trigger value="file">GPX Upload</Tabs.Trigger>
                                <Tabs.Trigger value="manual">Manual Input</Tabs.Trigger>
                            </Tabs.List>

                            <Box pt="4">
                                <Tabs.Content value="file">
                                    <Flex
                                        direction="column"
                                        align="center"
                                        justify="center"
                                        p="8"
                                        style={{
                                            border: '2px dashed var(--gray-6)',
                                            borderRadius: 'var(--radius-3)',
                                            cursor: 'pointer',
                                            backgroundColor: 'var(--gray-2)'
                                        }}
                                        onClick={triggerFileUpload}
                                        className="group"
                                    >
                                        {loading ? (
                                            <Text color="gray">Processing...</Text>
                                        ) : (
                                            <>
                                                <Text size="2" weight="medium">Select .gpx file</Text>
                                                <Text size="1" color="gray">Click to upload</Text>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept=".gpx"
                                            onChange={handleFileChange}
                                        />
                                    </Flex>
                                </Tabs.Content>

                                <Tabs.Content value="manual">
                                    <form onSubmit={handleManualSubmit}>
                                        <Flex direction="column" gap="4">
                                            <Box>
                                                <Text as="label" size="2" weight="medium" mb="1">Distance (km)</Text>
                                                <TextField.Root
                                                    placeholder="e.g. 21.1"
                                                    type="number"
                                                    step="0.1"
                                                    value={manualDistance}
                                                    onChange={(e) => setManualDistance(e.target.value)}
                                                    required
                                                />
                                            </Box>
                                            <Box>
                                                <Text as="label" size="2" weight="medium" mb="1">Elevation Gain (m)</Text>
                                                <TextField.Root
                                                    placeholder="e.g. 500"
                                                    type="number"
                                                    value={manualElevation}
                                                    onChange={(e) => setManualElevation(e.target.value)}
                                                    required
                                                />
                                            </Box>
                                            <Button type="submit" disabled={loading} size="3" mt="2" style={{ cursor: 'pointer' }}>
                                                {loading ? "Calculating..." : "Predict Time"}
                                            </Button>
                                        </Flex>
                                    </form>
                                </Tabs.Content>
                            </Box>
                        </Tabs.Root>

                        {error && (
                            <Box mt="4" p="3" style={{ backgroundColor: 'var(--red-3)', color: 'var(--red-11)', borderRadius: 'var(--radius-2)' }}>
                                <Text size="2">{error}</Text>
                            </Box>
                        )}

                        {prediction && prediction.success && (
                            <Box mt="5" pt="5" style={{ borderTop: '1px solid var(--gray-5)' }}>
                                <Flex direction="column" align="center">
                                    <Text size="1" weight="bold" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} mb="2">Estimated Time</Text>
                                    <Text size="9" weight="bold" style={{ lineHeight: 1 }}>
                                        {formatDuration(prediction.predictedTime)}
                                    </Text>
                                    <Flex gap="4" mt="4">
                                        <Text size="2" color="gray">{(prediction.course.distance / 1000).toFixed(1)} km</Text>
                                        <Text size="2" color="gray">|</Text>
                                        <Text size="2" color="gray">{Math.round(prediction.course.elevationGain)}m elev</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        )}
                    </Card>
                </Box>
            </Grid>
        </Container>
    );
}
