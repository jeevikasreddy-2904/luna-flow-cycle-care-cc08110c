import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Headphones, X, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

export const Route = createFileRoute("/app/music")({
  head: () => ({ meta: [{ title: "Music — Luna Flow" }] }),
  component: MusicPage,
});

const tracks = [
  { id: "t1", title: "Soft Bloom",     mood: "Calm 🌸",       gradient: "bg-gradient-sunrise", emoji: "🌸",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "t2", title: "Moonlit Cycle",  mood: "Dreamy 🌙",     gradient: "bg-gradient-dreamy",  emoji: "🌙",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "t3", title: "Warm Embrace",   mood: "Cozy 🤍",       gradient: "bg-gradient-primary", emoji: "🤍",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "t4", title: "Dance Drift",    mood: "Energising 💃🏽", gradient: "bg-gradient-meadow",  emoji: "💃🏽", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: "t5", title: "Cramp Soother",  mood: "Healing 💖",    gradient: "bg-gradient-sunrise", emoji: "💖",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: "t6", title: "Bloom Beat",     mood: "Uplift ✨",      gradient: "bg-gradient-meadow",  emoji: "✨",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
];

type Track = typeof tracks[number];

function MusicPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-dreamy shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Headphones className="h-5 w-5" />
          <span className="text-xs font-bold tracking-widest">SOUND LOUNGE</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2">
          Put on your headphones <Headphones className="h-7 w-7" />
        </h1>
        <p className="text-foreground/80 mt-1">Tap a track for a full-screen listening moment.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setOpenIdx(i)}
            className="rounded-3xl overflow-hidden glass shadow-soft hover:shadow-glow transition text-left"
          >
            <div className={`${t.gradient} aspect-square grid place-items-center text-7xl relative`}>
              <span className="animate-float">{t.emoji}</span>
              <span className="absolute bottom-3 right-3 h-12 w-12 rounded-full bg-white/90 grid place-items-center shadow-glow">
                <Play className="h-5 w-5 fill-foreground text-foreground" />
              </span>
              <span className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/85 grid place-items-center shadow-soft">
                <Headphones className="h-4 w-4" />
              </span>
            </div>
            <div className="p-4">
              <p className="font-display font-extrabold">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.mood}</p>
            </div>
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <NowPlaying
          track={tracks[openIdx]}
          onClose={() => setOpenIdx(null)}
          onPrev={() => setOpenIdx((i) => (i === null ? 0 : (i - 1 + tracks.length) % tracks.length))}
          onNext={() => setOpenIdx((i) => (i === null ? 0 : (i + 1) % tracks.length))}
        />
      )}
    </div>
  );
}

function NowPlaying({ track, onClose, onPrev, onNext }: { track: Track; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(track.src);
    a.loop = true;
    a.volume = 0.75;
    a.play().catch(() => setPlaying(false));
    audioRef.current = a;
    setPlaying(true);
    return () => { a.pause(); };
  }, [track.src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.75;
  }, [muted]);

  return (
    <div className={`fixed inset-0 z-[70] ${track.gradient} grid place-items-center`}>
      <button onClick={onClose} className="absolute top-4 right-4 glass rounded-full p-2" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      <button onClick={() => setMuted((m) => !m)} className="absolute top-4 left-4 glass rounded-full p-2" aria-label={muted ? "Unmute" : "Mute"}>
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="h-64 w-64 rounded-[2rem] bg-white/40 backdrop-blur grid place-items-center text-[9rem] shadow-glow">
          <span className={playing ? "animate-pulse-soft" : ""}>{track.emoji}</span>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest flex items-center justify-center gap-1.5">
            <Headphones className="h-3.5 w-3.5" /> NOW PLAYING
          </p>
          <h2 className="font-display text-4xl font-extrabold mt-1">{track.title}</h2>
          <p className="text-foreground/70 mt-1">{track.mood}</p>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onPrev} className="h-12 w-12 rounded-full bg-white/70 grid place-items-center shadow-soft">
            <SkipBack className="h-5 w-5 fill-foreground text-foreground" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="h-16 w-16 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow"
          >
            {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
          </button>
          <button onClick={onNext} className="h-12 w-12 rounded-full bg-white/70 grid place-items-center shadow-soft">
            <SkipForward className="h-5 w-5 fill-foreground text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
