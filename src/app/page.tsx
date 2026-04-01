'use client';
import { useState } from 'react';
import { ShieldCheck, Search, Activity, Lock, Server } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = url || 'http://httpforever.com/';

    setIsScanning(true);
    setResult('');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err) {
      setResult('Failed to connect to scanner API.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl tracking-tight">
            <ShieldCheck className="w-6 h-6" />
            SiteShield Pro
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">For Agencies</a>
          </nav>
          <div className="flex gap-4">
            <button className="text-sm font-medium hover:text-white transition hidden sm:block">Sign In</button>
            <a href="https://siteshield-pro.lemonsqueezy.com/checkout/buy/22bbb763-a632-49e5-b30c-9ecb2d9e1e9c" target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-full transition shadow-lg shadow-emerald-500/20">Get Pro</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex justify-center text-center">
        <div className="max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20 mb-8 shadow-inner shadow-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Threat Detection Engine Online
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Enterprise-Grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
              Vulnerability Scanner
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover critical vulnerabilities before hackers do. Protect your clients, secure your data, and generate beautiful audit reports in seconds.
          </p>

          <form onSubmit={handleScan} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
              <div className="pl-6 text-slate-500 hidden sm:block">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-client-website.com"
                className="w-full bg-transparent text-white px-6 sm:px-4 py-6 outline-none placeholder:text-slate-600 text-lg sm:text-left text-center"
              />
              <button
                type="submit"
                disabled={isScanning}
                className="w-full sm:w-auto sm:mr-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 sm:rounded-lg rounded-none transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <span className="animate-pulse flex items-center gap-2"><Activity className="w-5 h-5" /> Scanning...</span>
                ) : (
                  <span className="flex items-center gap-2"><Search className="w-5 h-5" /> Analyze Security</span>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          {result && (
            <div className="mt-16 text-left relative animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Raw Engine Output
              </h3>
              <div className="bg-[#0b101e] border border-slate-800 rounded-xl p-6 shadow-2xl overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-slate-300">
                  {result}
                </pre>
              </div>
              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm mb-4">Want to generate a white-labeled PDF report for your client?</p>
                <a href="https://siteshield-pro.lemonsqueezy.com/checkout/buy/22bbb763-a632-49e5-b30c-9ecb2d9e1e9c" target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-2 px-6 rounded-full transition inline-block">Upgrade to Pro ($20/mo)</a>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Pro Features Section */}
      <section className="bg-slate-900 border-t border-slate-800 py-24 select-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Why upgrade to Pro?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">From automated daily sweeps to white-labeled reporting—everything you need to secure your clients and scale your agency is included for $20/month.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 shadow-inner shadow-emerald-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Automated Daily Scans</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Add up to 50 domains and our engine will automatically scan them every night while you sleep to catch new bugs.</p>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition duration-300 relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 shadow-inner shadow-emerald-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Instant SMS Alerts</h4>
              <p className="text-slate-400 text-sm leading-relaxed">If a client's website gets hacked or a database port is accidentally exposed, you get an instant text message to fix it.</p>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-emerald-500/30 relative hover:border-emerald-400 transition duration-300 shadow-xl shadow-emerald-500/5">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl uppercase tracking-widest shadow-lg shadow-emerald-500/30">Most Popular</div>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 shadow-inner shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">White-Labeled PDFs</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Download pristine PDF audit reports with your own agency logo to send to your clients and look like an expert.</p>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 shadow-inner shadow-emerald-500/20">
                <Server className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Scan History Tracking</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Show your clients irrefutable proof of how you improved their security score over 12 months using our visual graphs.</p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <a href="https://siteshield-pro.lemonsqueezy.com/checkout/buy/22bbb763-a632-49e5-b30c-9ecb2d9e1e9c" target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold px-10 py-5 rounded-full transition duration-300 shadow-2xl shadow-emerald-500/20 inline-flex items-center gap-3">
              Upgrade to SiteShield Pro Let's Go!
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
