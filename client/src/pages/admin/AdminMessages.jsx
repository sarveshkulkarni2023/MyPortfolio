import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { messagesService } from '../../services/dataService';
import { HiTrash, HiMail, HiMailOpen } from 'react-icons/hi';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [viewingMsg, setViewingMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyWarning, setReplyWarning] = useState('');
  const [replySuccess, setReplySuccess] = useState('');

  useEffect(() => { load(); }, []);

  const load = () => {
    messagesService.getAll()
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => {});
  };

  const openMessage = async (msg) => {
    setViewingMsg(msg);
    setReplyText('');
    setReplyWarning('');
    setReplySuccess('');
    setShowModal(true);
    
    // Mark as read if it's unread
    if (!msg.read) {
      try {
        await messagesService.markRead(msg.id);
        // Optimistically update the UI
        setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    setError('');
    setReplyWarning('');
    setReplySuccess('');
    setSendingReply(true);
    try {
      await messagesService.reply(viewingMsg.id, replyText);
      setReplySuccess('Reply sent successfully via email!');
      setReplyText('');
      load();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === 'SMTP_NOT_CONFIGURED') {
        setReplyWarning('SMTP is not configured on your backend server. You can click the button below to reply directly using your email client instead.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to send reply.');
      }
    } finally {
      setSendingReply(false);
    }
  };

  const getMailtoLink = () => {
    if (!viewingMsg) return '';
    const subject = encodeURIComponent(`Re: ${viewingMsg.subject || 'Portfolio Inquiry'}`);
    const body = encodeURIComponent(`\n\n\n---\nOn ${new Date(viewingMsg.createdAt).toLocaleString()}, ${viewingMsg.name} wrote:\n> ${viewingMsg.message}`);
    return `mailto:${viewingMsg.email}?subject=${subject}&body=${body}`;
  };

  const handleDelete = async (id, e) => { 
    if (e) e.stopPropagation();
    if (confirm('Delete this message permanently?')) { 
      try {
        await messagesService.delete(id); 
        load();
        if (viewingMsg && viewingMsg.id === id) {
          setShowModal(false);
        }
      } catch (err) {
        setError(err.message);
      }
    } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Messages</h2>
        <div className="text-sm font-mono text-white/40">
          {messages.filter(m => !m.read).length} Unread
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

      <div className="grid gap-3">
        {messages.map((msg) => (
          <GlassCard 
            key={msg.id} 
            hover={true} 
            className={`p-4 flex items-center justify-between cursor-pointer border-l-4 ${!msg.read ? 'border-l-neon-blue bg-white/5' : 'border-l-transparent'}`}
            onClick={() => openMessage(msg)}
          >
            <div className="flex items-center gap-4 truncate">
              <div className={`text-xl ${!msg.read ? 'text-neon-blue' : 'text-white/30'}`}>
                {!msg.read ? <HiMail /> : <HiMailOpen />}
              </div>
              <div className="truncate">
                <h3 className={`text-sm font-display ${!msg.read ? 'font-semibold text-white' : 'text-white/60'}`}>
                  {msg.name} <span className="font-mono text-xs opacity-50 ml-2">&lt;{msg.email}&gt;</span>
                </h3>
                <p className={`text-xs font-mono truncate mt-1 ${!msg.read ? 'text-white/80' : 'text-white/40'}`}>
                  {msg.subject || 'No Subject'} - <span className="opacity-50">{msg.message.substring(0, 50)}...</span>
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center shrink-0 ml-4">
              <span className="text-xs font-mono text-white/30">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
              <Button size="sm" variant="danger" onClick={(e) => handleDelete(msg.id, e)}><HiTrash /></Button>
            </div>
          </GlassCard>
        ))}
        {!messages.length && (
          <p className="text-sm font-mono text-white/20 text-center py-12">No messages received yet.</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Message Details" size="lg">
        {viewingMsg && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">From</label>
                <div className="text-sm text-white/90 font-display">{viewingMsg.name}</div>
                <div className="text-xs font-mono text-neon-blue">{viewingMsg.email}</div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">Date Received</label>
                <div className="text-sm text-white/90 font-mono">
                  {new Date(viewingMsg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-2">Subject</label>
              <div className="text-md text-white font-display font-semibold">
                {viewingMsg.subject || 'No Subject'}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-2">Message</label>
              <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-sm text-white/80 font-mono leading-relaxed whitespace-pre-wrap">
                {viewingMsg.message}
              </div>
            </div>

            {/* Reply Section */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block">Send Reply</label>
              
              {replySuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-neon-green rounded-lg text-sm font-mono">
                  {replySuccess}
                </div>
              )}

              {replyWarning ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-sm font-mono space-y-3">
                  <p>{replyWarning}</p>
                  <a 
                    href={getMailtoLink()}
                    className="inline-block px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold rounded-lg border border-yellow-500/30 transition-all text-xs font-mono"
                  >
                    Reply via Local Mail App
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full bg-cyber-dark/80 text-white border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40 h-28 resize-none"
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" variant="neon" size="sm" loading={sendingReply}>
                      Send Email Reply
                    </Button>
                    <a 
                      href={getMailtoLink()}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-mono border border-white/10 flex items-center justify-center transition-all"
                    >
                      Open in Mail App
                    </a>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-4 flex justify-end border-t border-white/10">
              <Button variant="danger" onClick={() => handleDelete(viewingMsg.id)}>Delete Message</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
