import { Zap, Activity, Users, ArrowRight } from "lucide-react";

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Codexia Pro Card. Gradient blue */}
  <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <div className="text-xs font-bold opacity-80 mb-2 uppercase tracking-wider">Codexia Pro</div>
          <h3 className="text-2xl font-bold mb-3 leading-tight">Next-Gen Contest Simulation</h3>
          <p className="text-blue-100/80 text-sm mb-6 max-w-xs">
            Train in a real contest environment with your peers before the actual round begins.
          </p>
          <button className="bg-white text-blue-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
            Launch Sandbox
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
      </div>

      {/* Performance Analytics */}
  <div className="rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 flex flex-col justify-between">
        <div>
          <Activity className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Performance Analytics</h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
            Connect your platform handles to see unified rating graphs and predicted performance gains for upcoming rounds.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
             <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xs font-bold">LC</span>
             </div>
         <div className="text-xs font-medium text-gray-600 dark:text-zinc-300">
           Join <span className="font-bold text-gray-900 dark:text-zinc-100">2.4k</span> tracked builders
             </div>
        </div>
      </div>

       {/* Community Pulse */}
     <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-8 flex flex-col">
       <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-6">Community Pulse</h3>
          
          <div className="space-y-4 mb-8">
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Active Discussion: CF Round 905</span>
                <span className="text-blue-600 font-bold">4.2k+</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Problem Set Predictions</span>
                <span className="text-blue-600 font-bold">850+</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Solutions Shared (last 24h)</span>
                <span className="text-purple-600 font-bold">12.1k</span>
             </div>
          </div>

          <button className="mt-auto w-full bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-zinc-100 py-3 rounded-lg text-sm font-bold transition-colors">
            Go to Community
          </button>
       </div>
    </div>
  );
}
