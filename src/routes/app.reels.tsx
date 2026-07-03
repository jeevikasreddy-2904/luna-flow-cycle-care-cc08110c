import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Play, Pause, Music2, Volume2, VolumeX, Timer, ChevronUp } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/reels")({
  head: () => ({ meta: [{ title: "Reels — Luna Flow" }] }),
  component: ReelsPage,
});

const REELS = [
  { id: 1, user: "@cycle.coach",   title: "5 yoga poses to ease cramps",   gradient: "bg-gradient-sunrise", emoji: "🧘🏽‍♀️", likes: 2310, caption: "Save this for your next period!",     song: "Soft Bloom · Luna",     src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, user: "@nourish.her",   title: "Iron-rich foods for your period", gradient: "bg-gradient-meadow",  emoji: "🥗",     likes: 1890, caption: "Your plate is your medicine.",       song: "Warm Embrace · Luna",   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, user: "@hormone.hub",   title: "Why you crave chocolate",        gradient: "bg-gradient-dreamy",  emoji: "🍫",     likes: 4200, caption: "Spoiler: it's magnesium!",           song: "Moonlit Cycle · Luna",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, user: "@flow.stories",  title: "My first period story",           gradient: "bg-gradient-primary", emoji: "💕",     likes: 5670, caption: "Real talk, real love.",              song: "Cramp Soother · Luna",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5, user: "@self.care.club",title: "Period self-care night routine",  gradient: "bg-gradient-sunrise", emoji: "🛁",     likes: 3120, caption: "Soft girl era, activated.",          song: "Bloom Beat · Luna",     src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6, user: "@move.gentle",   title: "10-min walk during cramps",       gradient: "bg-gradient-meadow",  emoji: "🚶🏽‍♀️", likes: 1540, caption: "Movement is medicine.",             song: "Dance Drift · Luna",    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
];

type Reel = typeof REELS[number];

const SESSION_SECONDS = 15 * 60; // 15 minutes

function ReelsPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<number>(REELS[0].id);
  const [muted, setMuted] = useState(false);
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // countdown timer
  useEffect(() => {
    const iv = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (remaining === 0) {
      audioRef.current?.pause();
      speak("Time to take a break, love. Heading back to your home.");
      navigate({ to: "/app" });
    }
  }, [remaining, navigate]);

  // observe which reel is in view → auto-play its music
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const els = scroller.querySelectorAll<HTMLElement>("[data-reel-id]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const id = Number(e.target.getAttribute("data-reel-id"));
            setActiveId(id);
          }
        }
      },
      { root: scroller, threshold: [0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // whenever active reel changes → swap audio
  useEffect(() => {
    const reel = REELS.find((r) => r.id === activeId);
    if (!reel) return;
    audioRef.current?.pause();
    const a = new Audio(reel.src);
    a.loop = true;
    a.volume = muted ? 0 : 0.6;
    a.play().catch(() => {});
    audioRef.current = a;
    return () => { a.pause(); };
  }, [activeId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.6;
  }, [muted]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="fixed inset-0 z-30 bg-black">
      {/* top overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Timer className="h-3.5 w-3.5" /> {mm}:{ss}
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className="pointer-events-auto glass rounded-full p-2 shadow-soft"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 text-white/70 text-xs font-bold flex flex-col items-center gap-0.5 animate-bounce pointer-events-none">
        <ChevronUp className="h-4 w-4" /> swipe up
      </div>

      <div
        ref={scrollerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {REELS.map((r) => (
          <ReelSlide key={r.id} reel={r} active={activeId === r.id} />
        ))}
      </div>
    </div>
  );
}

function ReelSlide({ reel, active }: { reel: Reel; active: boolean }) {
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
    <section
      data-reel-id={reel.id}
      className={`snap-start h-full w-full relative grid place-items-center ${reel.gradient}`}
    >
      <span className={`text-[10rem] drop-shadow ${active ? "animate-pulse-soft" : "animate-float"}`}>{reel.emoji}</span>

      {/* user chip */}
      <div className="absolute top-16 left-4 right-20 flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-white/85 grid place-items-center text-sm font-extrabold">
          {reel.user[1].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-extrabold text-foreground bg-white/70 rounded-full px-2 py-0.5 w-fit">{reel.user}</p>
        </div>
      </div>

      {/* right actions */}
      <div className="absolute right-3 bottom-40 flex flex-col items-center gap-5">
        <button onClick={() => setLiked((v) => !v)} className="grid place-items-center text-white">
          <Heart className={`h-8 w-8 drop-shadow ${liked ? "fill-destructive text-destructive" : ""}`} />
          <span className="text-[10px] font-bold mt-0.5">{(reel.likes + (liked ? 1 : 0)).toLocaleString()}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="grid place-items-center text-white">
          <MessageCircle className="h-8 w-8 drop-shadow" />
          <span className="text-[10px] font-bold mt-0.5">{comments.length}</span>
        </button>
        <button className="grid place-items-center text-white">
          <Send className="h-8 w-8 drop-shadow" />
        </button>
        <button onClick={() => setSaved((v) => !v)} className="grid place-items-center text-white">
          <Bookmark className={`h-8 w-8 drop-shadow ${saved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* bottom caption */}
      <div className="absolute left-4 right-20 bottom-28 text-white">
        <p className="font-display text-xl font-extrabold drop-shadow">{reel.title}</p>
        <p className="text-sm mt-1 drop-shadow">{reel.caption}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-white/25 backdrop-blur px-2 py-1 rounded-full">
          <Music2 className="h-3 w-3" /> <span className={active ? "animate-pulse-soft" : ""}>{reel.song}</span>
        </div>
      </div>

      {/* comments sheet */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-3xl p-4 max-h-[60%] flex flex-col animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-extrabold">Comments · {comments.length}</h3>
            <button onClick={() => setShowComments(false)} className="text-sm font-bold text-muted-foreground">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {comments.map((c, i) => (
              <div key={i} className="text-sm bg-white/70 rounded-2xl px-3 py-2 border">
                <span className="font-bold">{c.user}</span> <span className="text-foreground/80">{c.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a comment…"
              className="flex-1 rounded-full bg-white border-2 border-muted/40 focus:border-primary outline-none px-4 py-2 text-sm font-semibold"
            />
            <button onClick={submit} className="rounded-full bg-gradient-primary text-primary-foreground px-4 text-sm font-bold">Post</button>
          </div>
        </div>
      )}
    </section>
  );
}
