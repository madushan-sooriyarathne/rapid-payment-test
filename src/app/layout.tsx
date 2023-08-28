import { type ReactNode } from "react";
import { TRPCProvider } from "@components/trpc-provider";
import "@styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <main className="flex min-h-screen flex-col items-stretch justify-start supports-[min-height:1dvh]:min-h-[100dvh]">
            {children}
          </main>
        </TRPCProvider>
      </body>
    </html>
  );
}
