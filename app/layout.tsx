import { Providers } from "./providers";
import Nav from "./nav";
import "./globals.css";

export const metadata = {
  title: "monkey-no-type",
  description: "Multiplayer typing game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
