// src/components/Navigation.jsx
import { useState, useEffect } from 'react';
import { Compass, Radio, Target, Archive, MessageSquare } from 'lucide-react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const timeStr = date.toISOString().split('T')[1].substring(0, 8);
      setSystemTime(timeStr);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'CTRL', icon: Compass },
    { id: 'telemetry', label: 'TLM', icon: Radio },
    { id: 'flightlog', label: 'LOG', icon: Target },
    { id: 'payload', label: 'PLD', icon: Archive },
    { id: 'groundcontrol', label: 'COM', icon: MessageSquare },
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logoBlock} onClick={() => handleScrollTo('home')}>
          <div style={styles.logo}>VG</div>
          <div style={styles.sysStatus}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>SYS_STATUS:</span>
            <span style={{ fontSize: '0.65rem', color: '#2ecc71', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>NOMINAL</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                style={{
                  ...styles.navBtn,
                  color: isActive ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)',
                  borderColor: isActive ? 'var(--color-accent-cyan)' : 'transparent',
                }}
              >
                <Icon size={14} style={{ opacity: isActive ? 1 : 0.6 }} />
                <span className="text-mono" style={styles.navLabel}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={styles.timeBlock} className="text-mono">
          <span style={styles.timeLabel}>SYS_TIME: </span>
          <span style={styles.time}>{systemTime} UTC</span>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '64px',
    borderBottom: '1px solid var(--color-border)',
    background: 'rgba(3, 3, 6, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logo: {
    fontFamily: 'var(--font-orbitron)',
    fontSize: '1.25rem',
    fontWeight: '900',
    letterSpacing: '1px',
    color: 'var(--color-accent-cyan)',
    border: '1px solid var(--color-accent-cyan)',
    padding: '2px 8px',
    textShadow: 'var(--glow-cyan)',
  },
  sysStatus: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.2',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    minHeight: 'auto',
    minWidth: 'auto',
  },
  navLabel: {
    fontSize: '0.75rem',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  timeBlock: {
    fontSize: '0.75rem',
    display: 'flex',
    gap: '6px',
  },
  timeLabel: {
    color: 'var(--color-text-muted)',
  },
  time: {
    color: 'var(--color-accent-cyan)',
  },
};

export default Navigation;
