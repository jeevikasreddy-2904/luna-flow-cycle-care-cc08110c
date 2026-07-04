import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Moon, Sparkles, Heart, Baby, Flower2, Droplets, Activity, Brain,
  Utensils, Calendar, MessageCircle, LineChart, Users, Shield, Star,
  ChevronDown, ArrowRight, Check, X, Download, Instagram, Linkedin, Github,
  Stethoscope, BookOpen, Bell, Lock, Fingerprint, Cloud, HeartPulse,
} from "lucide-react";
import { loadState } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luna Flow — Your Complete Women's Health Companion" },
      { name: "description", content: "AI-powered platform for periods, fertility, pregnancy, postpartum, wellness and nutrition — supporting every stage of a woman's health journey." },
      { property: "og:title", content: "Luna Flow — Complete Women's Health Companion" },
      { property: "og:description", content: "Track periods, fertility, pregnancy, postpartum and menopause with intelligent, supportive AI guidance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    const s = loadState();
    if (s.loggedIn) navigate({ to: "/app" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Nav />
      <Hero />
      <About />
      <Timeline />
      <Features />
      <AICompanion />
      <Insights />
      <Dashboards />
      <DoctorAssistant />
      <FamilyPrivacy />
      <WhyLuna />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gradient">Luna Flow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground/80">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#ai" className="hover:text-primary transition">AI Companion</a>
          <a href="#insights" className="hover:text-primary transition">Insights</a>
          <a href="#why" className="hover:text-primary transition">Why Luna</a>
          <a href="#faq" className="hover:text-primary transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/60 transition">Login</Link>
          <Link to="/signup" className="text-sm font-bold px-4 py-2 rounded-full bg-gradient-primary text-white shadow-soft hover:shadow-glow transition">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* animated background */}
      <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full opacity-40 animate-float" style={{ background: "radial-gradient(circle, #C4B5FD 0%, transparent 70%)" }} />
      <div className="absolute top-40 -right-20 h-96 w-96 rounded-full opacity-40 animate-float" style={{ background: "radial-gradient(circle, #B8F2E6 0%, transparent 70%)", animationDelay: "2s" }} />
      <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full opacity-30 animate-float" style={{ background: "radial-gradient(circle, #DBEAFE 0%, transparent 70%)", animationDelay: "4s" }} />

      {/* stars */}
      {[..."x".repeat(12)].map((_, i) => (
        <Star key={i} className="absolute text-primary/30 animate-pulse-soft" style={{ top: `${(i * 37) % 90}%`, left: `${(i * 53) % 95}%`, width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, animationDelay: `${i * 0.4}s` }} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-2 text-xs font-bold text-primary shadow-soft mb-6 border border-white/60">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered women's health, reimagined
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Your Complete <br />
            <span className="text-gradient">Women's Health</span> <br />
            Companion
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed">
            Track your period, fertility, pregnancy, postpartum recovery, wellness, nutrition and mental health — all powered by intelligent, supportive AI.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-white font-bold px-8 py-4 shadow-soft hover:shadow-glow transition">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 hover:bg-white text-foreground font-bold px-8 py-4 shadow-soft transition border border-white/60">
              Explore Features
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-foreground/60">
            <div className="flex -space-x-2">
              {["#C4B5FD","#B8F2E6","#DBEAFE","#FED7AA"].map((c,i)=>(
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white" style={{background:c}}/>
              ))}
            </div>
            <span><b className="text-foreground">10,000+</b> women bloom with Luna</span>
          </div>
        </div>

        {/* floating cards mock */}
        <div className="relative h-[520px] hidden lg:block">
          <div className="absolute top-0 right-0 glass rounded-3xl p-6 w-72 shadow-glow animate-float">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-primary grid place-items-center"><HeartPulse className="h-5 w-5 text-white"/></div>
              <div>
                <div className="text-xs text-foreground/60 font-semibold">Cycle Day</div>
                <div className="font-display text-2xl font-bold">Day 14</div>
              </div>
            </div>
            <div className="text-sm text-foreground/70">Ovulation window • Peak energy 🌸</div>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-primary rounded-full" />
            </div>
          </div>

          <div className="absolute top-40 left-0 glass rounded-3xl p-6 w-64 shadow-soft animate-float" style={{animationDelay:"1.5s"}}>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-primary"/>
              <span className="text-xs font-bold text-primary">Luna AI</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">"Why do I feel more tired this week?"</p>
            <p className="text-xs text-foreground/60 mt-2">Progesterone is rising — rest is medicine 💜</p>
          </div>

          <div className="absolute bottom-0 right-8 glass rounded-3xl p-6 w-72 shadow-soft animate-float" style={{animationDelay:"3s"}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-accent-foreground bg-accent px-2 py-1 rounded-full">Today's plan</span>
              <Check className="h-4 w-4 text-primary"/>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Droplets className="h-4 w-4 text-primary shrink-0 mt-0.5"/> 2L water</li>
              <li className="flex gap-2"><Activity className="h-4 w-4 text-primary shrink-0 mt-0.5"/> 20-min walk</li>
              <li className="flex gap-2"><Utensils className="h-4 w-4 text-primary shrink-0 mt-0.5"/> Iron-rich lunch</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
function About() {
  return (
    <section className="relative py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Badge>About Luna Flow</Badge>
        <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">
          More than a period tracker.<br/>
          <span className="text-gradient">A companion for every stage of life.</span>
        </h2>
        <p className="mt-6 text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Most apps switch modes. Luna Flow presents women's health as one continuous journey — from your very first period through motherhood and menopause, with the same account growing alongside you.
        </p>
      </div>
    </section>
  );
}

/* ---------------- TIMELINE ---------------- */
function Timeline() {
  const stages = [
    { icon: Flower2, label: "First Period", desc: "Gentle education & confidence" },
    { icon: HeartPulse, label: "Menstrual Health", desc: "Smart cycle tracking" },
    { icon: Heart, label: "Fertility", desc: "Conception planning" },
    { icon: Baby, label: "Pregnancy", desc: "Week-by-week guidance" },
    { icon: Sparkles, label: "Postpartum", desc: "Recovery & wellness" },
    { icon: Droplets, label: "Breastfeeding", desc: "Nutrition & tracking" },
    { icon: Moon, label: "Menopause", desc: "Support & symptom care" },
  ];
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Life Stages Timeline</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">One journey. One app.</h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-primary rounded-full opacity-40" />
          <div className="grid grid-cols-2 md:grid-cols-7 gap-6 relative">
            {stages.map((s, i) => (
              <div key={i} className="glass rounded-3xl p-5 text-center shadow-soft hover:scale-105 transition">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-primary grid place-items-center shadow-soft mb-3">
                  <s.icon className="h-7 w-7 text-white"/>
                </div>
                <div className="font-bold text-sm">{s.label}</div>
                <div className="text-xs text-foreground/60 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const groups = [
    { icon: Calendar, title: "Smart Period Tracker", color: "from-[#C4B5FD] to-[#7C5CFF]", items: ["Cycle prediction", "Ovulation forecasting", "Symptom & mood tracking", "Pain patterns"] },
    { icon: Heart, title: "Fertility Planner", color: "from-[#FED7AA] to-[#C4B5FD]", items: ["Fertile window insights", "Ovulation clarity", "Conception planning", "Health recommendations"] },
    { icon: Baby, title: "Pregnancy Tracker", color: "from-[#B8F2E6] to-[#7C5CFF]", items: ["Weekly baby development", "Due date countdown", "Kick & contraction timer", "Weight & appointments"] },
    { icon: Sparkles, title: "Postpartum Care", color: "from-[#DBEAFE] to-[#A78BFA]", items: ["Recovery tracking", "Emotional wellness", "Breastfeeding logs", "Sleep tracking"] },
    { icon: Utensils, title: "Nutrition Hub", color: "from-[#B8F2E6] to-[#DBEAFE]", items: ["Cycle-phase meals", "Trimester-specific plans", "Indian food library", "Veg / non-veg options"] },
    { icon: Activity, title: "Wellness", color: "from-[#C4B5FD] to-[#B8F2E6]", items: ["Yoga & meditation", "Pelvic floor exercises", "Walking plans", "Breathing exercises"] },
  ];
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Core Features</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">Everything you need, beautifully together</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g, i) => (
            <div key={i} className="group glass rounded-3xl p-7 shadow-soft hover:shadow-glow transition hover:-translate-y-1">
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${g.color} grid place-items-center shadow-soft mb-5`}>
                <g.icon className="h-7 w-7 text-white"/>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5"/>{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AI COMPANION ---------------- */
function AICompanion() {
  const questions = [
    "Why is my period late?",
    "What foods should I eat during my second trimester?",
    "Why do I feel tired before my period?",
    "How can I reduce menstrual cramps?",
    "Is this symptom something I should discuss with my doctor?",
  ];
  return (
    <section id="ai" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-meadow opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Badge>AI Health Companion</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">
            Understand your body — <span className="text-gradient">not just track it</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            Luna's AI remembers your cycle day, pregnancy week, symptoms and preferences. It explains the <em>why</em> behind mood changes, bloating, cravings and energy shifts — and gently encourages professional care when it matters.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-white/70 backdrop-blur rounded-full px-4 py-2 border border-white/60">
            <Shield className="h-4 w-4 text-primary"/>
            <span className="font-semibold">Educational guidance, never a diagnosis</span>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/50">
            <div className="h-10 w-10 rounded-2xl bg-gradient-primary grid place-items-center"><Sparkles className="h-5 w-5 text-white"/></div>
            <div>
              <div className="font-bold">Luna AI</div>
              <div className="text-xs text-foreground/60">Always here, always kind</div>
            </div>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="bg-white/80 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-white transition cursor-pointer flex items-center justify-between group">
                <span>"{q}"</span>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- INSIGHTS ---------------- */
function Insights() {
  const insights = [
    { icon: Moon, title: "Sleep vs cramps", desc: "See how nights under 6 hours amplify pain." },
    { icon: Droplets, title: "Water vs headaches", desc: "Hydration patterns that ease your migraines." },
    { icon: Activity, title: "Exercise vs mood", desc: "Discover the moves that lift your week." },
    { icon: Brain, title: "Stress vs regularity", desc: "Understand how your mind shapes your cycle." },
  ];
  return (
    <section id="insights" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Lifestyle Insights</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">Patterns you'd never spot alone</h2>
          <p className="mt-4 text-foreground/70">Luna connects habits to symptoms over months, revealing what actually helps your body feel better.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {insights.map((it, i) => (
            <div key={i} className="glass rounded-3xl p-6 shadow-soft">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center mb-4">
                <it.icon className="h-6 w-6 text-white"/>
              </div>
              <h3 className="font-bold mb-2">{it.title}</h3>
              <p className="text-sm text-foreground/70">{it.desc}</p>
              <div className="mt-4 flex items-end gap-1 h-14">
                {[40,60,35,80,55,70,45,90].map((h,j)=>(
                  <div key={j} className="flex-1 rounded-t bg-gradient-primary opacity-70" style={{height:`${h}%`}}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DASHBOARDS ---------------- */
function Dashboards() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
        {/* Daily wellness */}
        <div className="glass rounded-[2rem] p-8 shadow-soft">
          <Badge>Daily Wellness</Badge>
          <h3 className="mt-3 font-display text-3xl font-bold">Today, Day 17</h3>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: Droplets, k: "Water", v: "1.6 / 2.0 L" },
              { icon: Utensils, k: "Meal", v: "Iron-rich" },
              { icon: Activity, k: "Move", v: "20 min walk" },
              { icon: Heart, k: "Mood", v: "Calm 💜" },
              { icon: Bell, k: "Reminder", v: "Vitamin D" },
              { icon: Moon, k: "Sleep", v: "8 hrs goal" },
            ].map((c, i) => (
              <div key={i} className="bg-white/70 rounded-2xl p-4">
                <c.icon className="h-5 w-5 text-primary mb-2"/>
                <div className="text-xs text-foreground/60 font-semibold">{c.k}</div>
                <div className="font-bold text-sm">{c.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between bg-gradient-primary rounded-2xl p-4 text-white">
            <div>
              <div className="text-xs opacity-80 font-semibold">Wellness Score</div>
              <div className="font-display text-3xl font-bold">84</div>
            </div>
            <Star className="h-8 w-8"/>
          </div>
        </div>

        {/* Pregnancy */}
        <div className="glass rounded-[2rem] p-8 shadow-soft">
          <Badge>Pregnancy Dashboard</Badge>
          <h3 className="mt-3 font-display text-3xl font-bold">Week 22 — Baby is a papaya 🥭</h3>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { k: "Countdown", v: "126 days" },
              { k: "Weight", v: "+ 6.2 kg" },
              { k: "Next visit", v: "Apr 12" },
            ].map((c, i) => (
              <div key={i} className="bg-white/70 rounded-2xl p-4">
                <div className="text-xs text-foreground/60 font-semibold">{c.k}</div>
                <div className="font-bold text-sm mt-1">{c.v}</div>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Hospital bag checklist</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Vaccination reminders</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Kick counter</li>
          </ul>
          <button className="mt-6 w-full rounded-2xl bg-destructive text-destructive-foreground font-bold py-3 shadow-soft">
            🚨 Emergency Contact
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- DOCTOR ASSISTANT ---------------- */
function DoctorAssistant() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 glass rounded-[2rem] p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="h-6 w-6 text-primary"/>
            <h3 className="font-display text-xl font-bold">Doctor Visit Report</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              "3-month cycle summary",
              "Symptom timeline",
              "Mood & sleep trends",
              "Weight & medications",
              "Questions to ask your doctor",
            ].map((x, i) => (
              <div key={i} className="flex items-center justify-between bg-white/70 rounded-xl p-3">
                <span className="font-medium">{x}</span>
                <Check className="h-4 w-4 text-primary"/>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-white font-bold py-3">
            <Download className="h-4 w-4"/> Download PDF
          </button>
        </div>
        <div className="order-1 lg:order-2">
          <Badge>Doctor Visit Assistant</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">
            Walk in prepared. <span className="text-gradient">Leave with answers.</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            Luna compiles your cycle, symptoms, medications and personalized questions into a clean, exportable health report — ready for your OB-GYN or physician.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAMILY + PRIVACY ---------------- */
function FamilyPrivacy() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        <div className="glass rounded-[2rem] p-8 shadow-soft">
          <Users className="h-10 w-10 text-primary mb-4"/>
          <h3 className="font-display text-2xl font-bold mb-3">Family Support Mode</h3>
          <p className="text-foreground/70 mb-4">Invite a trusted partner or family member to gently share the journey — appointment reminders, pregnancy milestones, supportive tips.</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Explicit consent required</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Choose exactly what to share</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Revoke access anytime</li>
          </ul>
        </div>
        <div className="glass rounded-[2rem] p-8 shadow-soft">
          <Shield className="h-10 w-10 text-primary mb-4"/>
          <h3 className="font-display text-2xl font-bold mb-3">Privacy & Security</h3>
          <p className="text-foreground/70 mb-4">Your health story is yours alone. Encrypted end-to-end, locked behind your fingerprint.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Fingerprint, l: "Biometric login" },
              { icon: Lock, l: "PIN protection" },
              { icon: Cloud, l: "Encrypted backup" },
              { icon: Shield, l: "You own your data" },
            ].map((x, i) => (
              <div key={i} className="bg-white/70 rounded-xl p-3 flex items-center gap-2">
                <x.icon className="h-4 w-4 text-primary"/>
                <span className="text-sm font-semibold">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY LUNA ---------------- */
function WhyLuna() {
  const typical = ["Only tracks periods", "Generic advice", "Separate pregnancy app", "Limited insights", "One-size-fits-all"];
  const luna = ["Complete life-stage support", "AI educational assistant", "Personalized nutrition (Indian & global)", "Lifestyle insights that connect the dots", "Pregnancy + postpartum in one"];
  return (
    <section id="why" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Why Luna Flow</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">A different kind of tracker</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[2rem] p-8 bg-white/50 border border-white/60">
            <h3 className="font-display text-xl font-bold mb-5 text-foreground/60">Typical Apps</h3>
            <ul className="space-y-3">
              {typical.map((t, i) => (
                <li key={i} className="flex gap-3 text-foreground/70"><X className="h-5 w-5 text-destructive shrink-0 mt-0.5"/>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] p-8 bg-gradient-primary text-white shadow-glow">
            <h3 className="font-display text-xl font-bold mb-5 opacity-90">Luna Flow</h3>
            <ul className="space-y-3">
              {luna.map((t, i) => (
                <li key={i} className="flex gap-3"><Check className="h-5 w-5 shrink-0 mt-0.5"/>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const t = [
    { name: "Ananya", role: "Student, 21", quote: "Luna finally explained why my mood tanks every month. It's like having a wise older sister." },
    { name: "Priya", role: "Working professional, 29", quote: "The doctor report saved my appointment. I walked in with everything my gynec needed." },
    { name: "Meera", role: "New mother, 32", quote: "From pregnancy to postpartum, Luna held my hand through every question." },
    { name: "Kavya", role: "Managing PCOS, 26", quote: "The Indian meal suggestions are actually food I eat. Ragi, moong dal, paneer — not just kale." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge>Loved by women everywhere</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">Real stories, real support</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.map((x, i) => (
            <div key={i} className="glass rounded-3xl p-6 shadow-soft">
              <div className="flex gap-1 mb-3">
                {[0,1,2,3,4].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary"/>)}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">"{x.quote}"</p>
              <div className="mt-4 pt-4 border-t border-white/50">
                <div className="font-bold text-sm">{x.name}</div>
                <div className="text-xs text-foreground/60">{x.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    { q: "How accurate are Luna's predictions?", a: "Luna learns your unique patterns over 2–3 cycles, improving accuracy with each entry. Predictions are guidance, not guarantees." },
    { q: "Can I use Luna Flow during pregnancy?", a: "Yes — Luna supports you from conception through postpartum with weekly baby development, kick counters and appointment reminders." },
    { q: "Can I switch between life stages?", a: "Absolutely. Your account grows with you — periods, fertility, pregnancy, postpartum and menopause all live in one continuous journey." },
    { q: "Is my data private?", a: "Yes. Data is encrypted, locked behind biometrics or PIN, and never sold. You control who sees what — including family members." },
    { q: "Does the AI replace medical advice?", a: "No. Luna offers educational guidance and encourages you to consult a healthcare professional whenever appropriate." },
    { q: "Can my doctor view my reports?", a: "You can generate an exportable PDF health summary and share it with any doctor you choose." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge>FAQ</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-extrabold">Everything you might wonder</h2>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="glass rounded-2xl shadow-soft overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-bold">{it.q}</span>
                <ChevronDown className={`h-5 w-5 text-primary transition ${open === i ? "rotate-180" : ""}`}/>
              </button>
              {open === i && <div className="px-5 pb-5 text-sm text-foreground/70 leading-relaxed">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-12 md:p-16 text-white text-center shadow-glow">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"/>
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"/>
          <div className="relative">
            <Moon className="h-12 w-12 mx-auto mb-6 opacity-90"/>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              Take control of your health journey<br/>with Luna Flow.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-primary font-bold px-8 py-4 shadow-soft hover:scale-105 transition">
                <Download className="h-4 w-4"/> Download App
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/20 border border-white/40 text-white font-bold px-8 py-4 backdrop-blur hover:bg-white/30 transition">
                Join Beta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="py-16 border-t border-white/40 bg-white/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-primary grid place-items-center"><Moon className="h-5 w-5 text-white"/></div>
            <span className="font-display text-xl font-bold text-gradient">Luna Flow</span>
          </div>
          <p className="text-sm text-foreground/60">Your complete women's health companion.</p>
        </div>
        <FooterCol title="Product" links={["About","Features","AI Companion","Privacy Policy","Terms"]}/>
        <FooterCol title="Support" links={["Contact","Help Center","Community","Doctor Directory"]}/>
        <div>
          <h4 className="font-bold mb-3">Follow</h4>
          <div className="flex gap-3">
            <a href="#" className="h-10 w-10 rounded-full bg-white/70 grid place-items-center hover:bg-gradient-primary hover:text-white transition"><Instagram className="h-4 w-4"/></a>
            <a href="#" className="h-10 w-10 rounded-full bg-white/70 grid place-items-center hover:bg-gradient-primary hover:text-white transition"><Linkedin className="h-4 w-4"/></a>
            <a href="#" className="h-10 w-10 rounded-full bg-white/70 grid place-items-center hover:bg-gradient-primary hover:text-white transition"><Github className="h-4 w-4"/></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/50 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} Luna Flow. Made with 💜 for women everywhere.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-bold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-foreground/60">
        {links.map((l, i) => <li key={i}><a href="#" className="hover:text-primary transition">{l}</a></li>)}
      </ul>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-white/60 px-4 py-1.5 text-xs font-bold text-primary shadow-soft">
      <Sparkles className="h-3 w-3"/>{children}
    </span>
  );
}
