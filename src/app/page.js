import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import { Flex, Heading, Text, Container, Box } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Container size="1">
        <Flex direction="column" align="center" gap="5">
          <Heading size="9" weight="bold">Racr</Heading>
          <Text size="5" color="gray" align="center">
            Minimalist race time prediction. <br />
            Data-driven insights from your Strava history.
          </Text>

          <Box mt="4">
            <LoginButton />
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

