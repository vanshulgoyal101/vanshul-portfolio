// src/sections/MissionControl.jsx

const MissionControl = () => {
  const handleLaunch = () => {
    const el = document.getElementById('payload');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" style={styles.section} className="radar-grid">
      <div style={styles.container}>
        <div className="hud-panel" style={styles.dashboard}>
          <div className="hud-corner-br" />
          
          <div style={styles.headerRow}>
            <div className="telemetry-badge">
              <span className="status-dot active" />
              SYSTEMS ACTIVE // DIRECTORY: SPACE_CTRL
            </div>
            <div className="text-mono" style={styles.sysId}>
              NODE_ID: VG-8819 // REV. 2026
            </div>
          </div>

          <div style={styles.mainContent}>
            <div style={styles.telemetryGrid}>
              <div style={styles.telemetryItem} className="text-mono">
                <span style={styles.telemetryLabel}>MISSION_TYPE:</span>
                <span style={styles.telemetryVal}>AEROSPACE & TECH</span>
              </div>
              <div style={styles.telemetryItem} className="text-mono">
                <span style={styles.telemetryLabel}>ORBITAL_ALT:</span>
                <span style={{ ...styles.telemetryVal, color: 'var(--color-accent-purple)' }}>35,786 KM (GEO)</span>
              </div>
              <div style={styles.telemetryItem} className="text-mono">
                <span style={styles.telemetryLabel}>VELOCITY:</span>
                <span style={styles.telemetryVal}>3.07 KM/S</span>
              </div>
              <div style={styles.telemetryItem} className="text-mono">
                <span style={styles.telemetryLabel}>FUEL_LEVEL:</span>
                <span style={{ ...styles.telemetryVal, color: 'var(--color-accent-gold)' }}>98.4%</span>
              </div>
            </div>

            <div style={styles.introBlock}>
              <h1 style={styles.title}>
                VANSHUL GOYAL
              </h1>
              <h2 style={styles.subtitle} className="text-orbitron">
                SYSTEMS & AEROSPACE ENGINEER
              </h2>
              <p style={styles.description}>
                Developing sustainable solutions at the intersection of technology and innovation. Currently optimizing aerospace operations at United Airlines, co-founding Solaride, and engineering designs for NASA HERC.
              </p>
              
              <div style={styles.actions}>
                <button className="btn-telemetry" onClick={handleLaunch}>
                  LAUNCH PAYLOADS (PROJECTS)
                </button>
              </div>
            </div>
          </div>

          <div style={styles.footerRow} className="text-mono">
            <span>&lt; CODESPACE &gt; 🚀 DESTINATION: MARS & BEYOND</span>
            <span>DATA_STREAM: CONNECTED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 24px 60px 24px',
    position: 'relative',
    zIndex: 2,
  },
  container: {
    width: '100%',
    maxWidth: '1000px',
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    padding: '40px',
    borderRadius: '4px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  sysId: {
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '40px',
  },
  telemetryGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRight: '1px solid var(--color-border)',
    paddingRight: '40px',
  },
  telemetryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  telemetryLabel: {
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '1px',
  },
  telemetryVal: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: 'var(--color-accent-cyan)',
  },
  introBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '900',
    lineHeight: '1.1',
    letterSpacing: '-1px',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '3px',
    color: 'var(--color-accent-cyan)',
    marginBottom: '24px',
  },
  description: {
    color: 'var(--color-text-secondary)',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    marginBottom: '32px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '16px',
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
  },
};

// Responsive handling via media queries is better in stylesheet, but we can structure styles gracefully.
// Let's add standard responsive CSS logic in index.css to make sure layout shifts on mobile.
export default MissionControl;
