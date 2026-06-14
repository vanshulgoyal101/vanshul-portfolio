// src/sections/Payload.jsx
import { ExternalLink } from 'lucide-react';

const Payload = () => {
  const projects = [
    {
      title: 'SOLARIDE SOLAR VEHICLE',
      specs: 'Telemetry System / Battery Management / CAN Bus Integrations',
      description: 'Engineered real-time data streaming architectures tracking power output, thermal status, and motor efficiency of a custom solar electric racing vehicle.',
      status: 'IN ORBIT // SUCCESS',
      color: 'var(--color-accent-cyan)',
      link: '#',
    },
    {
      title: 'NASA HERC ROVER CHASSIS',
      specs: 'SolidWorks / Drivetrain Optimization / Finite Element Analysis',
      description: 'Developed weight-efficient suspension linkages and structural wheel hubs to meet rigid NASA competition criteria for alien environment traverses.',
      status: 'DEPLOYED // PROTOTYPE',
      color: 'var(--color-accent-purple)',
      link: '#',
    },
    {
      title: 'CELESTIAL ANOMALY DETECTOR',
      specs: 'Python / OpenCV / NASA Asteroid Database API',
      description: 'A tracking system using public astronomical databases to detect, isolate, and forecast orbital vectors of near-Earth objects (NEOs).',
      status: 'ACTIVE // PUBLIC_LOG',
      color: 'var(--color-accent-gold)',
      link: '#',
    }
  ];

  return (
    <section id="payload" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="telemetry-badge">
            <span className="status-dot active" />
            INVENTORY // PROJECTS
          </div>
          <h2 style={styles.sectionTitle}>PAYLOAD DEPLOYMENTS</h2>
          <p style={styles.sectionSub}>Technical builds, mechanical projects, and software systems.</p>
        </div>

        <div style={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className="hud-panel" style={styles.projectCard}>
              <div className="hud-corner-br" />
              
              <div style={styles.cardHeader}>
                <div style={styles.badgeRow}>
                  <span className="text-mono" style={{ ...styles.statusBadge, color: project.color, borderColor: project.color }}>
                    {project.status}
                  </span>
                  <span style={styles.cardIndex} className="text-mono">0{index + 1} // PLD</span>
                </div>
                <h3 style={styles.projectTitle} className="text-orbitron">{project.title}</h3>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.specsContainer} className="text-mono">
                  <span style={styles.specLabel}>[TECH_SPECS]</span>
                  <p style={{ ...styles.specVal, color: project.color }}>{project.specs}</p>
                </div>
                
                <p style={styles.description}>{project.description}</p>
              </div>

              <div style={styles.cardFooter}>
                <a href={project.link} style={{ ...styles.linkBtn, color: project.color, borderColor: project.color }} className="text-mono">
                  VIEW SCHEMATICS
                  <ExternalLink size={12} />
                </a>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '32px',
  },
  projectCard: {
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '320px',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statusBadge: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    border: '1px solid',
    padding: '2px 6px',
    borderRadius: '2px',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  cardIndex: {
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
  },
  projectTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'var(--color-text-primary)',
    letterSpacing: '1px',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  specsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  specLabel: {
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '1px',
  },
  specVal: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  },
  cardFooter: {
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '16px',
  },
  linkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    border: '1px solid',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'transparent',
    transition: 'all var(--transition-fast)',
  },
};

export default Payload;
