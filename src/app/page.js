import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import { Flex, Heading, Text, Container, Box } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

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

          <Box mt="6">
            <Link href="/methodology">
              <Text size="2" color="gray" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                See how it works
              </Text>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
