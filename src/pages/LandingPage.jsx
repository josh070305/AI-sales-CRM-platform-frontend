import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, MessageSquareMore, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  { title: 'Real-time revenue ops', icon: BarChart3, copy: 'Live dashboard metrics, pipeline visibility, and team performance analytics.' },
  { title: 'AI sales workflows', icon: Bot, copy: 'Summaries, follow-up drafts, lead scoring, and next-best-action recommendations.' },
  { title: 'Internal collaboration', icon: MessageSquareMore, copy: 'Built-in chat, notifications, unread states, presence, and activity history.' },
  { title: 'Enterprise controls', icon: ShieldCheck, copy: 'Role-based access, protected routes, secure auth, and deployable production config.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,180,135,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:44px_44px] opacity-15" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-brand-500" />
            <div>
              <p className="font-semibold">AI Sales CRM Platform</p>
              <p className="text-xs text-slate-400">Real-time revenue operations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button>Start free</Button>
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-12 pb-24 pt-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles size={16} className="text-brand-400" />
                Built for modern B2B sales teams
              </div>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight lg:text-7xl">
                Close more revenue with live CRM execution and embedded AI guidance.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-300">
                Run leads, deals, analytics, internal messaging, and AI-assisted follow-up from one premium operating
                system designed for real sales teams.
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="gap-2 px-6 py-3 text-base">
                  Create workspace
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white/15 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10">
                  View demo credentials
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span>Trusted by growth-stage teams</span>
              <span>Northstar Health</span>
              <span>Orbit Logistics</span>
              <span>Volt Partners</span>
              <span>Halo SaaS</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Card className="border-white/10 bg-white/8 p-0">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Revenue cockpit</p>
                    <h2 className="mt-2 text-2xl font-semibold">Forecast accuracy 86%</h2>
                  </div>
                  <div className="rounded-2xl bg-brand-500/15 px-4 py-2 text-sm text-brand-200">Live now</div>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2">
                {[
                  ['Pipeline value', '$824K'],
                  ['Open deals', '38'],
                  ['Conversion', '31%'],
                  ['AI drafts sent', '112'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-white/10 bg-white/6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <Icon size={22} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.copy}</p>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 py-24 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/6 lg:col-span-2">
            <p className="text-sm text-brand-300">Analytics preview</p>
            <h3 className="mt-2 text-3xl font-semibold">See trends before they affect the quarter.</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {['Lead source mix', 'Win/loss ratio', 'Forecast by stage'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-400">{item}</p>
                  <div className="mt-4 h-28 rounded-2xl bg-gradient-to-br from-brand-500/30 to-sky-400/20" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-white/10 bg-white/6">
            <p className="text-sm text-brand-300">AI assistant preview</p>
            <h3 className="mt-2 text-2xl font-semibold">Turn conversation history into action.</h3>
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-300">
              “Jordan is budget-qualified, asked for implementation timing, and responded positively to pricing.
              Recommend a 20-minute ROI walkthrough and send the proposal recap.”
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            '“The product finally gives our managers live visibility without forcing reps into a clunky workflow.”',
            '“AI follow-up drafts save our team hours every week and still sound like our brand.”',
            '“Messaging, activity tracking, and pipeline updates all stay synchronized in one place.”',
          ].map((quote, index) => (
            <Card key={index} className="border-white/10 bg-white/6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Users size={18} />
                </div>
                <div>
                  <p className="font-semibold">Revenue leader {index + 1}</p>
                  <p className="text-sm text-slate-400">Growth SaaS company</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">{quote}</p>
            </Card>
          ))}
        </section>

        <section className="py-24">
          <Card className="border-white/10 bg-gradient-to-r from-brand-500/20 to-sky-400/10 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Pricing placeholder</p>
            <h3 className="mt-3 text-4xl font-semibold">Start with the full platform and scale with your team.</h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">
              Use the included seed accounts to explore the product locally, then deploy to Vercel and Render or Railway.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/register">
                <Button className="px-6 py-3 text-base">Launch workspace</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="px-6 py-3 text-base text-white hover:bg-white/10">
                  Open demo
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
