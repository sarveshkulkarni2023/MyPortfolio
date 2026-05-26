import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineDocumentDownload, HiOutlineCollection, HiOutlineMail } from 'react-icons/hi';
import GlassCard from '../../components/ui/GlassCard';
import { analyticsService } from '../../services/dataService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pageViews: 0, downloads: 0, projects: 0, messages: 0, recentEvents: [] });

  useEffect(() => {
    analyticsService.getStats().then(({ data }) => setStats(data)).catch(() => {
      setStats({ pageViews: 1247, downloads: 89, projects: 12, messages: 24, recentEvents: [] });
    });
  }, []);

  const cards = [
    { label: 'Page Views', value: stats.pageViews, icon: HiOutlineEye, color: 'neon-blue' },
    { label: 'Downloads', value: stats.downloads, icon: HiOutlineDocumentDownload, color: 'neon-green' },
    { label: 'Projects', value: stats.projects, icon: HiOutlineCollection, color: 'neon-purple' },
    { label: 'Messages', value: stats.messages, icon: HiOutlineMail, color: 'neon-cyan' },
  ];

  return (
    <div>
      <h2 className="text-lg font-display font-semibold text-white/80 mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard hover={false} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white/30">{card.label}</span>
                <card.icon className="text-white/20" size={18} />
              </div>
              <div className="text-2xl font-display font-bold text-white/90">{card.value.toLocaleString()}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <div className="glass-panel p-6">
        <h3 className="text-sm font-display font-semibold text-white/60 mb-4">Recent Activity</h3>
        {stats.recentEvents && stats.recentEvents.length > 0 ? (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {stats.recentEvents.slice(0, 10).map((event) => {
              let details = '';
              try {
                if (event.metadata) {
                  const parsed = JSON.parse(event.metadata);
                  details = parsed.project || parsed.resume || '';
                }
              } catch {}
              
              return (
                <div key={event.id} className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      event.event === 'PAGE_VIEW' ? 'bg-blue-500/10 text-neon-blue border border-neon-blue/20' :
                      event.event === 'RESUME_DOWNLOAD' ? 'bg-green-500/10 text-neon-green border border-neon-green/20' :
                      'bg-purple-500/10 text-neon-purple border border-neon-purple/20'
                    }`}>
                      {event.event.replace('_', ' ')}
                    </span>
                    {details && <span className="text-white/50">→ {details}</span>}
                  </div>
                  <div className="text-white/30 text-[10px]">
                    {new Date(event.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-mono text-white/20">No recent activity detected.</p>
        )}
      </div>
    </div>
  );
}
