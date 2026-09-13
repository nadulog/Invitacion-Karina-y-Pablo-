"use client";

import { FormEvent, useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-11-14T20:00:00-03:00").getTime();
const ADDRESS = "Gorriti 950, Lomas de Zamora, Buenos Aires";
const GALLERY_IMAGES = [
  {
    src: "/galeria-01.jpg",
    alt: "Karina y Pablo celebrando entre papelitos a la salida del civil",
    orientation: "landscape",
  },
  {
    src: "/galeria-02-bn.png",
    alt: "Karina y Pablo junto a sus hijos en el marco de Nos casamos",
    orientation: "landscape",
  },
  {
    src: "/galeria-03.png",
    alt: "Karina y Pablo besándose dentro del marco de Nos casamos",
    orientation: "portrait",
  },
] as const;

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const distance = Math.max(0, EVENT_DATE - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export default function Home() {
  const [introOpening, setIntroOpening] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [songOpen, setSongOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof GALLERY_IMAGES)[number] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (introDismissed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [introDismissed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLocationOpen(false);
        setRsvpOpen(false);
        setSongOpen(false);
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(ADDRESS);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openInvitation = () => {
    if (introOpening) return;
    setIntroOpening(true);
    window.setTimeout(() => {
      setIntroDismissed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1450);
  };

  const shareMessage = (message: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const guests = String(data.get("guests") || "1");
    shareMessage(`¡Hola Karina y Pablo! Soy ${name}. Confirmo asistencia al casamiento para ${guests} persona${guests === "1" ? "" : "s"}.`);
    setRsvpOpen(false);
  };

  const submitSong = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    shareMessage(`Para la fiesta de Karina y Pablo sugiero: ${String(data.get("song") || "")} — ${String(data.get("artist") || "")}.`);
    setSongOpen(false);
  };

  return (
    <main>
      {!introDismissed && (
        <section className={`invitation-intro${introOpening ? " invitation-intro--opening" : ""}`} aria-label="Sobre de entrada a la invitación">
          <div className="intro-botanical intro-botanical--left" aria-hidden="true">
            <img src="/eucalyptus-leaf.png" alt="" />
          </div>
          <div className="intro-botanical intro-botanical--right" aria-hidden="true">
            <img src="/eucalyptus-leaf.png" alt="" />
          </div>
          <button className="envelope-trigger" type="button" onClick={openInvitation} disabled={introOpening} aria-label="Abrir el sobre y entrar a la invitación">
            <span className="envelope" aria-hidden="true">
              <span className="envelope-back" />
              <span className="envelope-card">
                <small>NOS CASAMOS</small>
                <strong>Karina <i>&amp;</i> Pablo</strong>
                <span>14 · 11 · 2026</span>
              </span>
              <span className="envelope-flap" />
              <span className="envelope-front" />
              <span className="envelope-seal">K <i>&amp;</i> P</span>
            </span>
            <span className="envelope-instruction">TOCÁ PARA ABRIR</span>
          </button>
        </section>
      )}

      <section className="visual-section hero" aria-label="Portada de la invitación">
        <img src="/portada-bn.png" alt="Karina y Pablo anuncian su casamiento el 14 de noviembre" />
      </section>

      <section id="cuenta-regresiva" className="visual-section countdown-section" aria-label="Cuenta regresiva">
        <img src="/countdown-background-clean-v2.png" alt="Falta cada vez menos" />
        <div className="falling-leaves" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <img key={index} src="/eucalyptus-single-leaf.png" alt="" />)}
        </div>
        <div className="countdown-heading">
          <p>FALTA CADA VEZ MENOS</p>
          <span />
        </div>
        <div className="countdown" aria-live="polite">
          {([
            [timeLeft?.days ?? "—", "DÍAS"],
            [timeLeft?.hours ?? "—", "HORAS"],
            [timeLeft?.minutes ?? "—", "MINUTOS"],
            [timeLeft?.seconds ?? "—", "SEGUNDOS"],
          ] as const).map(([value, label]) => (
            <div className="countdown-unit" key={label}>
              <strong>{typeof value === "number" ? String(value).padStart(2, "0") : value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="visual-section date-section" aria-label="Fecha y hora">
        <img src="/fecha-hora.png" alt="Sábado 14 de noviembre, ceremonia y celebración a las 20 horas" />
      </section>

      <section className="visual-section action-section" aria-label="Ubicación">
        <img src="/ubicacion-placa-v2.png" alt="Nos encontramos en Jano's Boutique, Gorriti 950, Lomas de Zamora" />
        <button className="image-action location-action" onClick={() => setLocationOpen(true)}>CÓMO LLEGAR</button>
      </section>

      <section className="visual-section" aria-label="Código de vestimenta">
        <img src="/dress-code.png" alt="Dress code elegante sport" />
      </section>

      <section className="visual-section action-section music-section" aria-label="Música">
        <img src="/musica.png" alt="Música: qué canción no puede faltar" />
        <div className="music-vinyl" aria-hidden="true">
          <img src="/vinilo.png" alt="" />
          <span />
        </div>
        <img className="music-tonearm" src="/tonearm-clean-v2.png" alt="" aria-hidden="true" />
        <a className="image-action song-action" href="https://open.spotify.com/playlist/1FXHVDtqhLjzpM5gungnyy?si=RpqP-6KkSya6Knr2zw-4Mw&utm_source=whatsapp&pt=1a8b25fca192a26abe6e84e615ed7242&pi=P7t6HVtNTbGfi" target="_blank" rel="noreferrer">SUGERIR CANCIÓN</a>
      </section>

      <section className="visual-section gallery-section" aria-labelledby="gallery-title">
        <header className="gallery-heading">
          <h2 id="gallery-title">Ya pasó lo formal, ahora queda celebrar con todos ustedes</h2>
          <span />
        </header>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((photo, index) => (
            <button className={`gallery-card gallery-card--${photo.orientation}`} key={photo.src} onClick={() => setSelectedPhoto(photo)} aria-label={`Ampliar foto ${index + 1} de la galería`}>
              <img src={photo.src} alt={photo.alt} />
            </button>
          ))}
        </div>
        <p className="gallery-signature">Karina <i>&amp;</i> Pablo</p>
      </section>

      <section className="visual-section" aria-label="Regalos">
        <img src="/regalos.png" alt="Lo más importante es compartir este día con vos. Cualquier presente será recibido con mucho cariño" />
      </section>

      <section className="visual-section action-section finale" aria-label="Cierre y confirmación">
        <img src="/cierre.png" alt="Karina y Pablo, te esperamos" />
        <a className="image-action rsvp-action" href="https://bloomdate-rsvp.netlify.app/r/boda-karina-y-pablo" target="_blank" rel="noreferrer">CONFIRMAR ASISTENCIA</a>
      </section>

      <footer className="visual-section site-footer" aria-label="BloomDate">
        <img src="/footer-bloomdate-clean.png" alt="Hecho con amor por BloomDate" />
        <nav className="footer-links" aria-label="Contacto de BloomDate">
          <a className="footer-link footer-link-instagram" href="https://www.instagram.com/bloomdate.invitaciones/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram de BloomDate" />
          <a className="footer-link footer-link-whatsapp" href="https://wa.me/541140436324" target="_blank" rel="noreferrer" aria-label="Contactar a BloomDate por WhatsApp" />
          <a className="footer-link footer-link-web" href="https://bloomdate-site.netlify.app/" target="_blank" rel="noreferrer" aria-label="Abrir el sitio web de BloomDate" />
        </nav>
      </footer>

      {locationOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setLocationOpen(false)}>
          <div className="modal location-modal" role="dialog" aria-modal="true" aria-labelledby="location-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setLocationOpen(false)} aria-label="Cerrar">CERRAR</button>
            <div className="modal-rule" />
            <p className="eyebrow">UBICACIÓN</p>
            <h2 id="location-title">JANO’S BOUTIQUE</h2>
            <p className="address"><strong>GORRITI 950</strong><br />LOMAS DE ZAMORA</p>
            <a className="modal-button olive" href="https://www.google.com/maps/search/?api=1&query=Gorriti%20950%2C%20Lomas%20de%20Zamora" target="_blank" rel="noreferrer">GOOGLE MAPS</a>
            <a className="modal-button terracotta" href="https://www.waze.com/ul?q=Gorriti%20950%2C%20Lomas%20de%20Zamora&navigate=yes" target="_blank" rel="noreferrer">WAZE</a>
            <button className="modal-button outline" onClick={copyAddress}>{copied ? "¡DIRECCIÓN COPIADA!" : "COPIAR DIRECCIÓN"}</button>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="gallery-lightbox" role="presentation" onMouseDown={() => setSelectedPhoto(null)}>
          <div className="gallery-lightbox-content" role="dialog" aria-modal="true" aria-label="Foto ampliada" onMouseDown={(event) => event.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="Cerrar foto">CERRAR</button>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
          </div>
        </div>
      )}

      {rsvpOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setRsvpOpen(false)}>
          <form className="modal form-modal" onSubmit={submitRsvp} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setRsvpOpen(false)} aria-label="Cerrar">CERRAR</button>
            <p className="eyebrow">CONFIRMACIÓN</p>
            <h2>¿NOS ACOMPAÑÁS?</h2>
            <label>Tu nombre<input name="name" required autoFocus /></label>
            <label>Cantidad de personas<select name="guests" defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label>
            <button className="modal-button olive" type="submit">ENVIAR POR WHATSAPP</button>
          </form>
        </div>
      )}

      {songOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSongOpen(false)}>
          <form className="modal form-modal" onSubmit={submitSong} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSongOpen(false)} aria-label="Cerrar">CERRAR</button>
            <img className="mini-vinyl" src="/vinilo.png" alt="" />
            <p className="eyebrow">MÚSICA</p>
            <h2>SUMÁ TU CANCIÓN</h2>
            <label>Canción<input name="song" required autoFocus /></label>
            <label>Artista<input name="artist" required /></label>
            <button className="modal-button olive" type="submit">ENVIAR SUGERENCIA</button>
          </form>
        </div>
      )}
    </main>
  );
}
