import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karina & Pablo | Nos casamos",
  description: "Te invitamos a celebrar nuestro casamiento el sábado 14 de noviembre a las 20 hs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
