import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://karina-pablo-invitacion.netlify.app"),
  title: "Karina & Pablo | Nos casamos",
  description: "Con mucha alegría queremos compartir este día tan especial con vos. Abrí nuestra invitación y acompañanos a celebrar el amor.",
  openGraph: {
    title: "Karina & Pablo | Nos casamos",
    description: "Con mucha alegría queremos compartir este día tan especial con vos. Abrí nuestra invitación y acompañanos a celebrar el amor.",
    url: "/",
    siteName: "Casamiento de Karina y Pablo",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/karina-pablo-whatsapp.png",
        width: 1731,
        height: 909,
        alt: "Karina y Pablo se casan el 14 de noviembre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karina & Pablo | Nos casamos",
    description: "Con mucha alegría queremos compartir este día tan especial con vos. Abrí nuestra invitación y acompañanos a celebrar el amor.",
    images: ["/karina-pablo-whatsapp.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
