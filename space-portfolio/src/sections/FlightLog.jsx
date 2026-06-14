// src/sections/FlightLog.jsx

const FlightLog = () => {
  const missions = [
    {
      code: 'MSN-03',
      role: 'Associate Engineer — Operations Technology',
      organization: 'United Airlines',
      timeframe: '2025 - PRESENT',
      status: 'ACTIVE',
      color: 'var(--color-accent-cyan)',
      log: [
        'Deploying technology solutions across aviation operations to maximize fleet and flight reliability.',
        'Analyzing telemetry and operational data streams to support predictive maintenance systems.',
        'Collaborating with flight systems engineers to optimize software and integration points.'
      ]
    },
    {
      code: 'MSN-02',
      role: 'Co-founder & Systems Integration Lead',
      organization: 'Solaride',
      timeframe: '2023 - 2025',
      status: 'SUCCESS',
      color: '#2ecc71',
      log: [
        'Co-founded Solaride to build high-performance solar-powered electric vehicles.',
        'Led systems integration efforts across battery packs, motor controllers, and telemetry systems.',
        'Engineered communication protocols to monitor real-time vehicle metrics during long-range runs.'
      ]
    },
    {
      code: 'MSN-01',
      role: 'Lead Systems Designer',
      organization: 'NASA Human Exploration Rover Challenge (HERC)',
      timeframe: '2022 - 2023',
      status: 'COMPLETED',
      color: 'var(--color-accent-purple)',
      log: [
        'Designed human-powered mechanical systems capable of traversing extraterrestrial simulated terrains.',
        'Engineered structural joints, drivetrain configurations, and wheel assemblies to handle NASA spec loads.',
        'Awarded honors for system integrity and innovative mechanical engineering design.'
      ]
    }
  ];

  return (
    <section id="flightlog" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="telemetry-badge">
            <span className="status-dot active" />
            TIMELINE // CHRONOLOGY
          </div>
          <h2 style={styles.sectionTitle}>FLIGHT LOG</h2>
          <p style={styles.sectionSub}>Historical record of missions and operational deployments.</p>
        </div>

        <div style={styles.timeline}>
          {missions.map((mission, index) => (
            <div key={index} className="hud-panel" style={styles.missionCard}>
              <div className="hud-corner-br" />
              
              <div style={styles.cardHeader}>
                <div style={styles.headerLeft}>
                  <span className="text-mono" style={{ ...styles.missionCode, color: mission.color, borderColor: mission.color }}>
                    {mission.code}
                  </span>
                  <div>
                    <h3 style={styles.missionRole}>{mission.role}</h3>
                    <h4 style={styles.missionOrg} className="text-orbitron">{mission.organization}</h4>
                  </div>
                </div>

                <div style={styles.headerRight} className="text-mono">
                  <span style={styles.timeframe}>{mission.timeframe}</span>
                  <span style={{ ...styles.statusBadge, color: mission.color, borderColor: mission.color }}>
                    {mission.status}
                  </span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <h5 style={styles.logTitle} className="text-mono">LOGS / DEPLOYMENT DETAILS:</h5>
                <ul style={styles.logList}>
                  {mission.log.map((item, itemIdx) => (
                    <li key={itemIdx} style={styles.logItem} className="text-mono">
                      <span style={{ color: mission.color, marginRight: '8px' }}>&gt;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
    maxWidth: '1000px',
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
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  missionCard: {
    borderRadius: '4px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  missionCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    border: '1px solid',
    padding: '4px 8px',
    borderRadius: '2px',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  missionRole: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--color-text-primary)',
  },
  missionOrg: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    letterSpacing: '1px',
    marginTop: '2px',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  timeframe: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },
  statusBadge: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    border: '1px solid',
    padding: '2px 6px',
    borderRadius: '2px',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logTitle: {
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '1.5px',
  },
  logList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logItem: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
};

export default FlightLog;
