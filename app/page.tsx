"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

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

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function EnvelopeIntro({ onComplete, onStartMusic }: { onComplete: () => void; onStartMusic: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [opening, setOpening] = useState(false);

  const drawEnvelope = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const envelopeX = width * 0.055;
    const envelopeW = width * 0.89;
    const envelopeH = envelopeW / 1.48;
    const envelopeY = (height - envelopeH) / 2 + progress * 15;
    const cardProgress = easeInOutCubic(Math.max(0, Math.min(1, (progress - 0.38) / 0.48)));
    const flapProgress = easeInOutCubic(Math.min(1, progress / 0.45));
    const cardY = envelopeY + envelopeH * 0.08 - cardProgress * envelopeH * 0.38;
    const cardX = envelopeX + envelopeW * 0.06;
    const cardW = envelopeW * 0.88;
    const cardH = envelopeH * 0.84;

    ctx.save();
    ctx.shadowColor = "rgba(62, 50, 39, .27)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 18;
    ctx.fillStyle = "#606d53";
    ctx.beginPath();
    ctx.roundRect(envelopeX, envelopeY, envelopeW, envelopeH, 6);
    ctx.fill();
    ctx.restore();

    if (flapProgress > 0.52) {
      const backLift = (flapProgress - 0.52) / 0.48;
      ctx.fillStyle = "#89937a";
      ctx.beginPath();
      ctx.moveTo(envelopeX, envelopeY);
      ctx.lineTo(envelopeX + envelopeW, envelopeY);
      ctx.lineTo(envelopeX + envelopeW / 2, envelopeY - envelopeH * 0.56 * backLift);
      ctx.closePath();
      ctx.fill();
    }

    ctx.save();
    ctx.shadowColor = "rgba(48, 43, 36, .18)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = "#fbf7ee";
    ctx.strokeStyle = "#ded2bd";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const centerX = width / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = "#606b50";
    ctx.font = `600 ${Math.max(9, envelopeW * 0.025)}px Arial`;
    ctx.fillText("NOS CASAMOS", centerX, cardY + cardH * 0.33);
    ctx.fillStyle = "#5f5046";
    ctx.font = `${Math.max(27, envelopeW * 0.088)}px Georgia`;
    ctx.fillText("Karina & Pablo", centerX, cardY + cardH * 0.55);
    ctx.fillStyle = "#ad6848";
    ctx.fillRect(centerX - cardW * 0.09, cardY + cardH * 0.64, cardW * 0.18, 1.5);
    ctx.fillStyle = "#5f5046";
    ctx.font = `${Math.max(11, envelopeW * 0.034)}px Georgia`;
    ctx.fillText("14 · 11 · 2026", centerX, cardY + cardH * 0.76);

    ctx.fillStyle = "#6d7960";
    ctx.beginPath();
    ctx.moveTo(envelopeX, envelopeY);
    ctx.lineTo(envelopeX + envelopeW / 2, envelopeY + envelopeH * 0.53);
    ctx.lineTo(envelopeX, envelopeY + envelopeH);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#647057";
    ctx.beginPath();
    ctx.moveTo(envelopeX + envelopeW, envelopeY);
    ctx.lineTo(envelopeX + envelopeW / 2, envelopeY + envelopeH * 0.53);
    ctx.lineTo(envelopeX + envelopeW, envelopeY + envelopeH);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#59664c";
    ctx.beginPath();
    ctx.moveTo(envelopeX, envelopeY + envelopeH);
    ctx.lineTo(envelopeX + envelopeW / 2, envelopeY + envelopeH * 0.51);
    ctx.lineTo(envelopeX + envelopeW, envelopeY + envelopeH);
    ctx.closePath();
    ctx.fill();

    if (flapProgress <= 0.52) {
      const closingHeight = 1 - flapProgress / 0.52;
      ctx.fillStyle = "#7d896d";
      ctx.beginPath();
      ctx.moveTo(envelopeX, envelopeY);
      ctx.lineTo(envelopeX + envelopeW, envelopeY);
      ctx.lineTo(envelopeX + envelopeW / 2, envelopeY + envelopeH * 0.62 * closingHeight);
      ctx.closePath();
      ctx.fill();
    }

    const sealOpacity = Math.max(0, 1 - progress / 0.2);
    if (sealOpacity > 0) {
      const sealY = envelopeY + envelopeH * 0.5;
      const sealRadius = Math.max(30, envelopeW * 0.09);
      const gradient = ctx.createRadialGradient(centerX - 8, sealY - 10, 2, centerX, sealY, sealRadius);
      gradient.addColorStop(0, "#cb8664");
      gradient.addColorStop(1, "#99563b");
      ctx.globalAlpha = sealOpacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, sealY, sealRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 237, 216, .65)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#f9e9d7";
      ctx.font = `${Math.max(15, envelopeW * 0.043)}px Georgia`;
      ctx.fillText("K & P", centerX, sealY + 6);
      ctx.globalAlpha = 1;
    }
  }, []);

  useEffect(() => {
    const redraw = () => drawEnvelope(progressRef.current);
    redraw();
    const observer = new ResizeObserver(redraw);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [drawEnvelope]);

  const startOpening = () => {
    if (opening) return;
    onStartMusic();
    setOpening(true);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 250 : 2600;
    const startedAt = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      progressRef.current = progress;
      drawEnvelope(progress);
      if (progress > 0.84 && overlayRef.current) {
        overlayRef.current.style.opacity = String(1 - (progress - 0.84) / 0.16);
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else onComplete();
    };
    frameRef.current = requestAnimationFrame(animate);
  };

  return (
    <section ref={overlayRef} className="invitation-intro" aria-label="Sobre de entrada a la invitación">
      <div className="intro-botanical intro-botanical--left" aria-hidden="true"><img src="/eucalyptus-leaf.png" alt="" /></div>
      <div className="intro-botanical intro-botanical--right" aria-hidden="true"><img src="/eucalyptus-leaf.png" alt="" /></div>
      <button className="envelope-canvas-trigger" type="button" onClick={startOpening} disabled={opening} aria-label="Abrir el sobre y entrar a la invitación">
        <canvas ref={canvasRef} className="envelope-canvas" aria-hidden="true" />
        <span className="envelope-instruction">{opening ? "ABRIENDO…" : "TOCÁ PARA ABRIR"}</span>
      </button>
    </section>
  );
}

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
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

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.65;
    void audio.play().catch(() => setMusicPlaying(false));
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setMusicPlaying(false));
    else audio.pause();
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
      <audio
        ref={audioRef}
        src="/musica-karina-pablo.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      {!introDismissed && (
        <EnvelopeIntro
          onStartMusic={startMusic}
          onComplete={() => {
            setIntroDismissed(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {introDismissed && (
        <button
          className={`audio-control${musicPlaying ? " audio-control--playing" : ""}`}
          type="button"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Pausar música" : "Reproducir música"}
          aria-pressed={musicPlaying}
          title={musicPlaying ? "Pausar música" : "Reproducir música"}
        >
          <span aria-hidden="true">{musicPlaying ? "❚❚" : "▶"}</span>
        </button>
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
