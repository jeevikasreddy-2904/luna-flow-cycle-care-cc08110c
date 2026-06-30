import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Play, Pause, Music2, Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/app/reels")({
  head: () => ({ meta: [{ title: "Reels — Luna Flow" }] }),
  component: ReelsPage,
});

const reels = [
  { id: 1, user: "@cycle.coach",  title: "5 yoga poses to ease cramps 🧘🏽‍♀️", gradient: "bg-gradient-sunrise", emoji: "🧘🏽‍♀️", likes: 2310, caption: "Save this for your next period!",     song: "Soft Bloom · Luna",     src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, user: "@nourish.her",  title: "Iron-rich foods for your period 🥗", gradient: "bg-gradient-meadow",  emoji: "🥗",      likes: 1890, caption: "Your plate is your medicine.",     song: "Warm Embrace · Luna",   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, user: "@hormone.hub",  title: "Why you crave chocolate 🍫",         gradient: "bg-gradient-dreamy",  emoji: "🍫",      likes: 4200, caption: "Spoiler: it's magnesium!",         song: "Moonlit Cycle · Luna",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, user: "@flow.stories", title: "My first period story 💕",            gradient: "bg-gradient-primary", emoji: "💕",      likes: 5670, caption: "Real talk, real love.",            song: "Cramp Soother · Luna",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5, user: "@self.care.club", title: "Period self-care night routine 🛁", gradient: "bg-gradient-sunrise", emoji: "🛁",      likes: 3120, caption: "Soft girl era, activated.",        song: "Bloom Beat · Luna",     src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6, user: "@move.gentle", title: "10-min walk during cramps 🚶🏽‍♀️",       gradient: "bg-gradient-meadow",  emoji: "🚶🏽‍♀️",  likes: 1540, caption: "Movement is medicine.",            song: "Dance Drift · Luna",    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
];

type Reel = typeof reels[number];

function ReelsPage() {
  const [pageLiked, setPageLiked] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const playMusic = (r: Reel) => {
    if (playingId === r.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const a = new Audio(r.src);
    a.loop = true;
    a.volume = muted ? 0 : 0.6;
    a.play().catch(() => {});
    audioRef.current = a;
    setPlayingId(r.id);
  };

  const toggleMute = () => {
    setMuted((m) => {
      if (audioRef.current) audioRef.current.volume = m ? 0.6 : 0;
      return !m;
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Stories & Reels 🎀</h1>
          <p className="text-muted-foreground mt-1">Bite-sized wisdom — tap a reel to play its music.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="rounded-full bg-white/80 hover:bg-white p-2 shadow-soft"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setPageLiked((v) => !v)}
            className={`rounded-full px-3 py-2 shadow-soft text-sm font-bold flex items-center gap-1.5 ${pageLiked ? "bg-destructive text-destructive-foreground" : "bg-white/80 hover:bg-white"}`}
          >
            <Heart className={`h-4 w-4 ${pageLiked ? "fill-current" : ""}`} /> {pageLiked ? "Loved" : "Love this page"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reels.map((r) => (
          <ReelCard key={r.id} reel={r} playing={playingId === r.id} onTogglePlay={() => playMusic(r)} />
        ))}
      </div>
    </div>
  );
}

function ReelCard({ reel, playing, onTogglePlay }: { reel: Reel; playing: boolean; onTogglePlay: () => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ user: string; text: string }[]>([
    { user: "@bloom.babe", text: "needed this today 💕" },
  ]);
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    setComments((c) => [...c, { user: "@you", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="rounded-3xl overflow-hidden shadow-soft glass">
      <div className={`${reel.gradient} aspect-[9/14] relative grid place-items-center text-7xl`}>
        <span className={playing ? "animate-pulse-soft" : "animate-float"}>{reel.emoji}</span>
        <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-white/80 grid place-items-center text-xs font-bold">
            {reel.user[1].toUpperCase()}
          </div>
          <span className="text-xs font-bold text-foreground bg-white/70 rounded-full px-2 py-0.5">{reel.user}</span>
        </div>
        <button onClick={onTogglePlay} className="absolute inset-0 grid place-items-center group">
          <span className="h-14 w-14 rounded-full bg-white/85 grid place-items-center shadow-glow group-hover:scale-110 transition">
            {playing ? <Pause className="h-6 w-6 fill-foreground text-foreground" /> : <Play className="h-6 w-6 fill-foreground text-foreground" />}
          </span>
        </button>
        <div className="absolute right-2 bottom-3 flex flex-col gap-3">
          <button onClick={() => setLiked(!liked)} className="grid place-items-center">
            <Heart className={`h-6 w-6 ${liked ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
          <button onClick={() => setShowComments((v) => !v)} className="grid place-items-center"><MessageCircle className="h-6 w-6 text-foreground" /></button>
          <button className="grid place-items-center"><Send className="h-6 w-6 text-foreground" /></button>
          <button onClick={() => setSaved(!saved)} className="grid place-items-center">
            <Bookmark className={`h-6 w-6 ${saved ? "fill-foreground text-foreground" : "text-foreground"}`} />
          </button>
        </div>
        <div className="absolute left-3 bottom-3 right-14 flex items-center gap-1.5 text-[11px] font-bold text-foreground bg-white/70 rounded-full px-2 py-1 w-fit max-w-full">
          <Music2 className="h-3 w-3 shrink-0" />
          <span className={`truncate ${playing ? "animate-pulse-soft" : ""}`}>{reel.song}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="font-display font-extrabold text-sm leading-tight">{reel.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{reel.caption}</p>
        <p className="text-xs text-muted-foreground mt-1">{(reel.likes + (liked ? 1 : 0)).toLocaleString()} likes · {comments.length} comments</p>

        {showComments && (
          <div className="mt-3 space-y-2">
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
              {comments.map((c, i) => (
                <div key={i} className="text-xs bg-white/70 rounded-2xl px-3 py-1.5">
                  <span className="font-bold">{c.user}</span> <span className="text-foreground/80">{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Add a comment…"
                className="flex-1 rounded-full bg-white/80 outline-none px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-primary"
              />
              <button onClick={submit} className="rounded-full bg-gradient-primary text-primary-foreground px-3 text-xs font-bold">Post</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
