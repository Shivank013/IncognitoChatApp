import "./globals.css";
import { SocketProvider } from "../context/SocketProvider";

export const metadata = {
  title: "Incognito Chat",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <SocketProvider>
          <>
            {children}
          </>
      </SocketProvider>
      </body>
    </html>
  );
}
