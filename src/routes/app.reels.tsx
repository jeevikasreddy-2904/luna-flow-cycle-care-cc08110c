import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Play } from "lucide-react";

export const Route = createFileRoute("/app/reels")({
  head: () => ({ meta: [{ title: "Reels — Luna Flow" }] }),
  component: ReelsPage,
});

const reels = [
  { id: 1, user: "@cycle.coach", title: "5 yoga poses to ease cramps 🧘🏽‍♀️", gradient: "bg-gradient-sunrise", emoji: "🧘🏽‍♀️", likes: 2310, caption: "Save this for your next period!" },
  { id: 2, user: "@nourish.her", title: "Iron-rich foods for your period 🥗", gradient: "bg-gradient-meadow", emoji: "🥗", likes: 1890, caption: "Your plate is your medicine." },
  { id: 3, user: "@hormone.hub", title: "Why you crave chocolate 🍫", gradient: "bg-gradient-dreamy", emoji: "🍫", likes: 4200, caption: "Spoiler: it's magnesium!" },
  { id: 4, user: "@flow.stories", title: "My first period story 💕", gradient: "bg-gradient-primary", emoji: "💕", likes: 5670, caption: "Real talk, real love." },
  { id: 5, user: "@self.care.club", title: "Period self-care night routine 🛁", gradient: "bg-gradient-sunrise", emoji: "🛁", likes: 3120, caption: "Soft girl era, activated." },
  { id: 6, user: "@move.gentle", title: "10-min walk during cramps 🚶🏽‍♀️", gradient: "bg-gradient-meadow", emoji: "🚶🏽‍♀️", likes: 1540, caption: "Movement is medicine." },
];

function ReelsPage() {
  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold">Stories & Reels 🎀</h1>
        <p className="text-muted-foreground mt-1">Bite-sized wisdom from the cycle community.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {reels.map((r) => <ReelCard key={r.id} reel={r} />)}
      </div>
    </div>
  );
}

function ReelCard({ reel }: { reel: typeof reels[number] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden shadow-soft glass">
      <div className={`${reel.gradient} aspect-[9/14] relative grid place-items-center text-7xl`}>
        <span className="animate-float">{reel.emoji}</span>
        <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-white/80 grid place-items-center text-xs font-bold">
            {reel.user[1].toUpperCase()}
          </div>
          <span className="text-xs font-bold text-foreground bg-white/70 rounded-full px-2 py-0.5">{reel.user}</span>
        </div>
        <button className="absolute inset-0 grid place-items-center group">
          <span className="h-14 w-14 rounded-full bg-white/80 grid place-items-center shadow-glow group-hover:scale-110 transition">
            <Play className="h-6 w-6 fill-foreground text-foreground" />
          </span>
        </button>
        <div className="absolute right-2 bottom-3 flex flex-col gap-3">
          <button onClick={() => setLiked(!liked)} className="grid place-items-center">
            <Heart className={`h-6 w-6 ${liked ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
          <button className="grid place-items-center"><MessageCircle className="h-6 w-6 text-foreground" /></button>
          <button className="grid place-items-center"><Send className="h-6 w-6 text-foreground" /></button>
          <button onClick={() => setSaved(!saved)} className="grid place-items-center">
            <Bookmark className={`h-6 w-6 ${saved ? "fill-foreground text-foreground" : "text-foreground"}`} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-display font-extrabold text-sm leading-tight">{reel.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{reel.caption}</p>
        <p className="text-xs text-muted-foreground mt-1">{(reel.likes + (liked ? 1 : 0)).toLocaleString()} likes</p>
      </div>
    </div>
  );
}
