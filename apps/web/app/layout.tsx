import SocketProvider from "./context/socket.context";
import RoomContextProvider from "./context/room.context";
import UsernameContextProvider from "./context/username.context";
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "point8factor.webxprojects.com",
  description: "A unbalanced number guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SocketProvider>
          <RoomContextProvider>
            <UsernameContextProvider>
              {children}
              <Toaster />
            </UsernameContextProvider>
          </RoomContextProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
