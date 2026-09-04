import React, { useState, useEffect } from 'react';
import { Title } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { Users, Copy, Check, Send, X, Play, Pause, Radio, MessageSquare } from 'lucide-react';

interface WatchPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: Title | null;
}

export const WatchPartyModal: React.FC<WatchPartyModalProps> = ({ isOpen, onClose, initialTitle }) => {
  const { user, activeProfile } = useAuth();
  const { playTitle } = usePlayer();

  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [joinCode, setJoinCode] = useState('');
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Poll room updates if in an active room
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.pollWatchParty(activeRoom.id);
        if (res.success && res.room) {
          setActiveRoom(res.room);
        }
      } catch (err) {
        // ignore polling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeRoom]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    if (!initialTitle) return;
    try {
      const res = await api.createWatchParty(
        user?.id || 'usr-default-tubi-fan',
        activeProfile?.name || 'Alex',
        initialTitle.id
      );
      if (res.success && res.room) {
        setActiveRoom(res.room);
        playTitle(initialTitle);
      }
    } catch (err) {
      setErrorMsg('Failed to create party room');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const res = await api.joinWatchParty(
        joinCode.trim(),
        user?.id || 'usr-guest',
        activeProfile?.name || 'Guest'
      );
      if (res.success && res.room) {
        setActiveRoom(res.room);
        const titleRes = await api.getTitleById(res.room.titleId);
        if (titleRes.success) {
          playTitle(titleRes.title, undefined, res.room.playbackState.currentTimeSeconds);
        }
      } else {
        setErrorMsg(res.message || 'Room not found');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to join party room');
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom) return;

    try {
      const text = chatInput.trim();
      setChatInput('');
      const res = await api.sendPartyChat(
        activeRoom.id,
        user?.id || 'usr-guest',
        activeProfile?.name || 'Alex',
        text
      );
      if (res.success && res.message) {
        setActiveRoom((prev: any) => ({
          ...prev,
          chatLog: [...prev.chatLog, res.message]
        }));
      }
    } catch (err) {
      console.error('Send chat failed', err);
    }
  };

  const copyRoomCode = () => {
    if (!activeRoom) return;
    navigator.clipboard.writeText(activeRoom.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 2600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-heavy animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: activeRoom ? '920px' : '520px',
          borderRadius: '24px',
          padding: '32px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          border: '1px solid rgba(255, 42, 109, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {!activeRoom ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255, 42, 109, 0.15)',
                  border: '1px solid rgba(255, 42, 109, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}
              >
                <Users size={28} color="var(--accent-pink)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
                Watch Party Co-Watching
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Watch movies together in real-time sync with live text chat.
              </p>
            </div>

            {errorMsg && (
              <div style={{ padding: '10px', background: 'rgba(255, 42, 109, 0.15)', color: '#ff2a6d', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {initialTitle && (
                <button
                  onClick={handleCreateRoom}
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '1rem', fontWeight: 800, justifyContent: 'center' }}
                >
                  Create Party Room for "{initialTitle.title}"
                </button>
              )}

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
                OR JOIN AN EXISTING ROOM
              </div>

              <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter Room Code (e.g. PARTY-8921)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '12px 20px', fontWeight: 700 }}>
                  Join Party
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Active Room View with Participants & Live Chat */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left: Room Status & Members */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '0.08em' }}>
                  LIVE PARTY ROOM
                </span>
                <button
                  onClick={copyRoomCode}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isCopied ? 'var(--accent-green)' : '#fff',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {activeRoom.id}
                </button>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
                Co-Watching Room
              </h3>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                PARTY MEMBERS ({activeRoom.members.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {activeRoom.members.map((m: any) => (
                  <div
                    key={m.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <img src={m.userAvatar} alt={m.userName} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{m.userName}</span>
                    {m.userId === activeRoom.hostUserId && (
                      <span style={{ fontSize: '0.7rem', color: '#ffd700', fontWeight: 800, marginLeft: 'auto' }}>
                        HOST
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Party Chat */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '360px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} /> Live Party Chat
              </div>

              {/* Chat Log */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }} className="no-scrollbar">
                {activeRoom.chatLog.map((msg: any) => (
                  <div key={msg.id} style={{ fontSize: '0.82rem' }}>
                    <strong style={{ color: msg.userId === 'system' ? 'var(--accent-pink)' : '#00f076' }}>
                      {msg.userName}:
                    </strong>{' '}
                    <span style={{ color: '#e2e8f0' }}>{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Say something..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
