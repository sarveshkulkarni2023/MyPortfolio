import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { analyticsService } from '../../services/dataService';
import { HiOutlineEye, HiOutlineDocumentDownload, HiOutlineTrendingUp, HiDeviceMobile, HiDeviceTablet, HiDesktopComputer } from 'react-icons/hi';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ 
    pageViews: 0, 
    downloads: 0, 
    projectViews: 0, 
    projects: 0, 
    messages: 0, 
    recentEvents: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getStats()
      .then(({ data }) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Simple Helper to identify device type from User Agent
  const getDeviceIcon = (ua = '') => {
    const lowercaseUa = ua.toLowerCase();
    if (lowercaseUa.includes('mobi') || lowercaseUa.includes('android') || lowercaseUa.includes('iphone')) {
      return <HiDeviceMobile className="text-white/40" title="Mobile" />;
    }
    if (lowercaseUa.includes('tablet') || lowercaseUa.includes('ipad')) {
      return <HiDeviceTablet className="text-white/40" title="Tablet" />;
    }
    return <HiDesktopComputer className="text-white/40" title="Desktop" />;
  };

  // Extract browser name from User Agent
  const getBrowserName = (ua = '') => {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other Browser';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-mono text-neon-blue animate-pulse">Retreiving system telemetry...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-display font-semibold text-white/80 mb-1">System Telemetry</h2>
        <p className="text-xs font-mono text-white/40">Real-time usage analytics and traffic logs.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-white/30">Total Page Views</span>
            <div className="text-3xl font-display font-bold text-neon-blue mt-1">{stats.pageViews}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <HiOutlineEye className="text-neon-blue text-xl" />
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-white/30">Resume Downloads</span>
            <div className="text-3xl font-display font-bold text-neon-green mt-1">{stats.downloads}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
            <HiOutlineDocumentDownload className="text-neon-green text-xl" />
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-white/30">Project Views</span>
            <div className="text-3xl font-display font-bold text-neon-purple mt-1">{stats.projectViews}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
            <HiOutlineTrendingUp className="text-neon-purple text-xl" />
          </div>
        </GlassCard>
      </div>

      {/* Traffic Log Table */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-display font-semibold text-white/60 mb-6">Traffic & Event Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 pb-3">
                <th className="pb-3 font-semibold uppercase tracking-wider">Event</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Details</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">IP Address</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-center">Device</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Browser</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentEvents?.map((event) => {
                let details = 'None';
                try {
                  if (event.metadata) {
                    const parsed = JSON.parse(event.metadata);
                    details = parsed.project || parsed.resume || 'None';
                  }
                } catch {}

                return (
                  <tr key={event.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        event.event === 'PAGE_VIEW' ? 'bg-blue-500/10 text-neon-blue border border-neon-blue/20' :
                        event.event === 'RESUME_DOWNLOAD' ? 'bg-green-500/10 text-neon-green border border-neon-green/20' :
                        'bg-purple-500/10 text-neon-purple border border-neon-purple/20'
                      }`}>
                        {event.event}
                      </span>
                    </td>
                    <td className="py-3 text-white/60">{details}</td>
                    <td className="py-3 text-white/50">{event.ip || 'Unknown'}</td>
                    <td className="py-3 text-center">{getDeviceIcon(event.userAgent)}</td>
                    <td className="py-3 text-white/40">{getBrowserName(event.userAgent)}</td>
                    <td className="py-3 text-right text-white/30">{new Date(event.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
              {(!stats.recentEvents || stats.recentEvents.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/20">No network logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
