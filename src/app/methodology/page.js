import { Container, Heading, Text, Flex, Box, Card, Grid, Section } from "@radix-ui/themes";
import Link from "next/link";

export default function MethodologyPage() {
    return (
        <Container size="3" p="4">
            <Box py="5" mb="5">
                <Link href="/">
                    <Text color="gray" size="2" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        ← Back to Home
                    </Text>
                </Link>
            </Box>

            <Flex direction="column" gap="8" pb="9">
                <Box>
                    <Heading size="8" mb="4">How a Prediction is Made</Heading>
                    <Text size="4" color="gray" as="p" style={{ maxWidth: '65ch', lineHeight: '1.6' }}>
                        Racr gives you a realistic estimate of your finish time by combining your unique fitness profile with the specific challenges of your race course. Here is a look under the hood.
                    </Text>
                </Box>

                <Grid columns={{ initial: '1', sm: '2' }} gap="6">
                    <Card size="3" variant="surface">
                        <Heading size="4" mb="2">1. Your "Fitness Signature"</Heading>
                        <Text as="p" size="3" color="gray" mb="4">
                            We don't just look at your average pace. We scan your last 12 months of running interactions on Strava to calculate your <strong>Grade Adjusted Pace (GAP)</strong>.
                        </Text>
                        <Box p="3" style={{ backgroundColor: 'var(--gray-3)', borderRadius: 'var(--radius-3)' }}>
                            <Heading size="2" mb="1">What is GAP?</Heading>
                            <Text size="2">
                                Running uphill is harder than running on flat ground. GAP normalizes your pace to show how fast you would be running if every run was flat. This reveals your true fitness engine, regardless of terrain.
                            </Text>
                        </Box>
                    </Card>

                    <Card size="3" variant="surface">
                        <Heading size="4" mb="2">2. The Course Profile</Heading>
                        <Text as="p" size="3" color="gray" mb="4">
                            Every race is different. A 50k in the Alps is not the same as a flat city marathon.
                        </Text>
                        <ul style={{ paddingLeft: '20px', color: 'var(--gray-11)' }}>
                            <li style={{ marginBottom: '8px' }}><Text><strong>Distance:</strong> The total length of the course.</Text></li>
                            <li><Text><strong>Elevation Gain:</strong> The total amount of climbing.</Text></li>
                        </ul>
                        <Text as="p" size="3" color="gray" mt="4">
                            We analyze the .gpx file or your manual inputs to understand exactly how tough the course is.
                        </Text>
                    </Card>
                </Grid>

                <Box>
                    <Heading size="5" mb="3">3. The Prediction Formula</Heading>
                    <Text size="3" color="gray" as="p" style={{ maxWidth: '65ch', marginBottom: '16px' }}>
                        We predict your time by taking your historical GAP and slowing it down based on the course's specific elevation gain.
                    </Text>
                    <Text size="3" color="gray" as="p" style={{ maxWidth: '65ch' }}>
                        Roughly speaking, we add significant time penalties for every 100 meters of climbing, simulating the fatigue and reduced speed of uphill running. This creates a finish time that respects both your speed and gravity.
                    </Text>
                </Box>
            </Flex>
        </Container>
    );
}
