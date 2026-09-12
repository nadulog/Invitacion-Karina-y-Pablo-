"use client";

import { FormEvent, useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-11-14T20:00:00-03:00").getTime();
const ADDRESS = "Gorriti 950, Lomas de Zamora, Buenos Aires";

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
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [songOpen, setSongOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLocationOpen(false);
        setRsvpOpen(false);
        setSongOpen(false);
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
      <section className="visual-section hero" aria-label="Portada de la invitación">
        <img src="/portada.png" alt="Karina y Pablo anuncian su casamiento el 14 de noviembre" />
        <button className="hero-scroll" onClick={() => document.getElementById("cuenta-regresiva")?.scrollIntoView({ behavior: "smooth" })} aria-label="Ver la invitación completa">
          <span>DESCUBRIR</span><b>↓</b>
        </button>
      </section>

      <section id="cuenta-regresiva" className="visual-section countdown-section" aria-label="Cuenta regresiva">
        <img src="/countdown-ref.png" alt="Falta cada vez menos" />
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

      <section className="visual-section" aria-label="Fecha y hora">
        <img src="/fecha-hora.png" alt="Sábado 14 de noviembre, ceremonia y celebración a las 20 horas" />
      </section>

      <section className="visual-section action-section" aria-label="Ubicación">
        <img src="/como-llegar.png" alt="Nos encontramos en Jano's Boutique, Gorriti 950, Lomas de Zamora" />
        <button className="image-action location-action" onClick={() => setLocationOpen(true)}>CÓMO LLEGAR</button>
      </section>

      <section className="visual-section" aria-label="Código de vestimenta">
        <img src="/dress-code.png" alt="Dress code elegante sport" />
      </section>

      <section className="visual-section action-section" aria-label="Música">
        <img src="/musica.png" alt="Música: qué canción no puede faltar" />
        <button className="image-action song-action" onClick={() => setSongOpen(true)}>SUGERIR CANCIÓN</button>
      </section>

      <section className="visual-section" aria-label="Regalos">
        <img src="/regalos.png" alt="Lo más importante es compartir este día con vos. Cualquier presente será recibido con mucho cariño" />
      </section>

      <section className="visual-section action-section finale" aria-label="Cierre y confirmación">
        <img src="/cierre.png" alt="Karina y Pablo, te esperamos" />
        <button className="image-action rsvp-action" onClick={() => setRsvpOpen(true)}>CONFIRMAR ASISTENCIA</button>
      </section>

      <footer className="visual-section site-footer" aria-label="BloomDate">
        <img src="/footer-bloomdate.png" alt="Hecho con amor por BloomDate" />
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
