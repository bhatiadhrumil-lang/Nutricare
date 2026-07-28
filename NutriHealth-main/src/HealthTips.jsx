import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Leaf, Activity, ChevronRight, Apple, Heart, Flame, Sparkles } from 'lucide-react';

const TIPS_POOL = [
  { id: 1, category: 'Diet', title: 'Include Daily Almonds', desc: 'Include exactly 15 raw almonds in your morning routine.', why: 'Almonds contain high monounsaturated healthy fats that actively help reduce your elevated LDL cholesterol levels shown in your report.', icon: Apple, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { id: 2, category: 'Exercise', title: '30m Post-Meal Walk', desc: 'Take a brisk 30-minute walk 15 minutes after eating dinner.', why: 'Walking significantly improves glycemic control and prevents the rapid blood sugar spikes driving your pre-diabetic marker.', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 3, category: 'Lifestyle', title: 'Deep Sleep Optimization', desc: 'Block blue light 2 hours before bed and aim for 8 hours of sleep.', why: 'Poor sleep directly increases cortisol, which triggers your liver to dump more glucose into your bloodstream, raising morning fasting sugar.', icon: Heart, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  { id: 4, category: 'Diet', title: 'Oatmeal & Cinnamon', desc: 'Swap standard breakfast cereal for steel-cut oats with a dash of heavy cinnamon.', why: 'Soluble fiber acts as a sponge for cholesterol, while cinnamon is proven to mimic insulin and increase glucose uptake by cells.', icon: Leaf, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { id: 5, category: 'Exercise', title: 'Zone 2 Cardio', desc: 'Engage in 45 minutes of light jogging or cycling 3x a week.', why: 'Zone 2 cardio builds mitochondrial efficiency, which inherently burns circulating triglycerides and lowers resting blood sugar.', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
];

export default function HealthTips() {
  const [tips, setTips] = useState([TIPS_POOL[0], TIPS_POOL[1], TIPS_POOL[2]]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const generateNewTips = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...TIPS_POOL].sort(() => 0.5 - Math.random());
      setTips(shuffled.slice(0, 3));
      setActiveFilter('All');
      setIsGenerating(false);
    }, 1200);
  };

  const filteredTips = activeFilter === 'All' ? tips : tips.filter(t => t.category === activeFilter);

  return (
    <div className="w-full max-w-5xl mx-auto my-auto py-6 sm:py-8 space-y-8 flex flex-col justify-center">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Micro-Habit Synthesis
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Personalized Health Insights</h2>
          <p className="text-slate-500 text-sm">Actionable daily habits derived directly from your blood analysis.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateNewTips}
          disabled={isGenerating}
          className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-75 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Synthesizing...' : 'Refresh Insights'}
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {['All', 'Diet', 'Exercise', 'Lifestyle'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === filter 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Cards Grid - Occupies viewport height gracefully */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={`${tip.id}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between group hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all min-h-[320px]"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${tip.bg} ${tip.color} border ${tip.border}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tip.bg} ${tip.border} ${tip.color}`}>
                      {tip.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{tip.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">{tip.desc}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mt-auto">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    Clinical Rationale <ChevronRight className="w-3 h-3 text-teal-600" />
                  </h4>
                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {tip.why}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {!isGenerating && filteredTips.length === 0 && (
         <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 text-sm">
            <Leaf className="w-10 h-10 mb-3 text-slate-300" />
            <p>No active tips in this category right now.</p>
         </div>
      )}
    </div>
  );
}
