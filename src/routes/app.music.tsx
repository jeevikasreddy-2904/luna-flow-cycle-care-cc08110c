import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music2 } from "lucide-react";

export const Route = createFileRoute("/app/music")({
  head: () => ({ meta: [{ title: "Music — Luna Flow" }] }),
  component: MusicPage,
});

const tracks = [
  { id: "t1", title: "Soft Bloom", mood: "Calm 🌸", gradient: "bg-gradient-sunrise", emoji: "🌸", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "t2", title: "Moonlit Cycle", mood: "Dreamy 🌙", gradient: "bg-gradient-dreamy", emoji: "🌙", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "t3", title: "Warm Embrace", mood: "Cozy 🤍", gradient: "bg-gradient-primary", emoji: "🤍", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "t4", title: "Dance Drift", mood: "Energising 💃🏽", gradient: "bg-gradient-meadow", emoji: "💃🏽", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: "t5", title: "Cramp Soother", mood: "Healing 💖", gradient: "bg-gradient-sunrise", emoji: "💖", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: "t6", title: "Bloom Beat", mood: "Uplift ✨", gradient: "bg-gradient-meadow", emoji: "✨", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
];

function MusicPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const toggle = (t: typeof tracks[number]) => {
    if (playingId === t.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const a = new Audio(t.src);
    a.loop = true;
    a.volume = 0.7;
    a.play().catch(() => {});
    audioRef.current = a;
    setPlayingId(t.id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-dreamy shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Music2 className="h-5 w-5" />
          <span className="text-xs font-bold tracking-widest">SOUND LOUNGE</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold">Music for your flow 🎶</h1>
        <p className="text-foreground/80 mt-1">Gentle sounds for cramps, focus, sleep, or a tiny dance.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tracks.map((t) => {
          const playing = playingId === t.id;
          return (
            <div key={t.id} className="rounded-3xl overflow-hidden glass shadow-soft">
              <div className={`${t.gradient} aspect-square grid place-items-center text-7xl relative`}>
                <span className={playing ? "animate-pulse-soft" : "animate-float"}>{t.emoji}</span>
                <button
                  onClick={() => toggle(t)}
                  className="absolute bottom-3 right-3 h-12 w-12 rounded-full bg-white/90 grid place-items-center shadow-glow hover:scale-110 transition"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="h-5 w-5 fill-foreground text-foreground" /> : <Play className="h-5 w-5 fill-foreground text-foreground" />}
                </button>
              </div>
              <div className="p-4">
                <p className="font-display font-extrabold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.mood}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
