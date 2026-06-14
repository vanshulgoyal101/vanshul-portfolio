// src/sections/Telemetry.jsx

const Telemetry = () => {
  const skills = [
    { name: 'Systems Engineering & Integration', level: 92, category: 'Core' },
    { name: 'Aerodynamics & Flight Dynamics', level: 85, category: 'Core' },
    { name: 'Full-Stack Development (React/Node/Py)', level: 88, category: 'Software' },
    { name: 'Data Engineering & Analytics', level: 90, category: 'Software' },
    { name: 'IoT / Hardware Prototyping', level: 80, category: 'Hardware' },
    { name: 'CAD & 3D Modeling (SolidWorks)', level: 86, category: 'Hardware' },
  ];

  return (
    <section id="telemetry" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="telemetry-badge">
            <span className="status-dot active" />
            DIAGNOSTICS // CAPABILITIES
          </div>
          <h2 style={styles.sectionTitle}>SYSTEM TELEMETRY</h2>
          <p style={styles.sectionSub}>Analysis of engineer parameters and core technical stack.</p>
        </div>

        <div style={styles.contentGrid}>
          {/* Specs / Bio */}
          <div className="hud-panel" style={styles.bioPanel}>
            <div className="hud-corner-br" />
            <h3 style={styles.panelTitle} className="text-orbitron">BIOGRAPHICAL RECORDFILE</h3>
            <div style={styles.bioText}>
              <p>
                As an aerospace enthusiast and tech builder, I focus on the intersection of complex systems, hardware, and modern software design. My background spans developing telemetry frameworks for flight management systems at United Airlines, engineering solar-powered propulsion systems at Solaride, and building lunar exploration rovers.
              </p>
              <p style={{ marginTop: '16px' }}>
                I thrive in high-stakes environments where reliability, performance, and sustainability are critical. Whether writing code or designing physical systems, I approach every challenge with system-level thinking.
              </p>
            </div>
            
            <div style={styles.specTable} className="text-mono">
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>[ORIGIN]</span>
                <span style={styles.tableVal}>EARTH // IN_SECTOR</span>
              </div>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>[FOCUS]</span>
                <span style={styles.tableVal}>AEROSPACE SYSTEMS</span>
              </div>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>[OPERATING_SYS]</span>
                <span style={styles.tableVal}>OSX / LINUX / ROS</span>
              </div>
            </div>
          </div>

          {/* Telemetry Progress Bars */}
          <div className="hud-panel" style={styles.skillsPanel}>
            <div className="hud-corner-br" />
            <h3 style={styles.panelTitle} className="text-orbitron">CAPABILITY TELEMETRY</h3>
            
            <div style={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <div key={index} style={styles.skillItem}>
                  <div style={styles.skillHeader} className="text-mono">
                    <span style={styles.skillName}>{skill.name}</span>
                    <span style={styles.skillPct}>{skill.level}%</span>
                  </div>
                  <div style={styles.barBg}>
                    <div 
                      style={{ 
                        ...styles.barFill, 
                        width: `${skill.level}%`,
                        backgroundColor: skill.category === 'Core' ? 'var(--color-accent-cyan)' : 'var(--color-accent-purple)'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
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
    padding: '80px 24px',
    position: 'relative',
    zIndex: 2,
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
  },
  header: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'var(--color-text-primary)',
    letterSpacing: '-1px',
    marginTop: '8px',
  },
  sectionSub: {
    color: 'var(--color-text-secondary)',
    fontSize: '1rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  bioPanel: {
    borderRadius: '4px',
  },
  skillsPanel: {
    borderRadius: '4px',
  },
  panelTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: 'var(--color-accent-cyan)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
    marginBottom: '20px',
  },
  bioText: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.7',
  },
  specTable: {
    marginTop: '32px',
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
  },
  tableLabel: {
    color: 'var(--color-text-muted)',
  },
  tableVal: {
    color: 'var(--color-accent-cyan)',
    fontWeight: 'bold',
  },
  skillsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  skillItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skillHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
  },
  skillName: {
    color: 'var(--color-text-primary)',
    fontWeight: '500',
  },
  skillPct: {
    color: 'var(--color-accent-cyan)',
    fontWeight: 'bold',
  },
  barBg: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
    boxShadow: 'var(--glow-cyan)',
    transition: 'width 1s ease-in-out',
  },
};

export default Telemetry;
