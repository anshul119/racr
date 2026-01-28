"use client";

import { signIn } from "next-auth/react";
import { Button } from "@radix-ui/themes";

export default function LoginButton() {
    return (
        <Button
            onClick={() => signIn("strava", { callbackUrl: "/dashboard" })}
            size="3"
            style={{ cursor: 'pointer' }}
        >
            Connect with Strava
        </Button>
    );
}
