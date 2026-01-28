import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import AuthProvider from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Racr - Race Time Predictor",
  description: "Predict your race finish time based on Strava history.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="light" accentColor="orange" grayColor="slate" radius="medium">
          <AuthProvider>{children}</AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
