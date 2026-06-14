// src/App.jsx
import Navigation from './components/Navigation';
import CelestialCanvas from './components/CelestialCanvas';
import MissionControl from './sections/MissionControl';
import Telemetry from './sections/Telemetry';
import FlightLog from './sections/FlightLog';
import Payload from './sections/Payload';
import GroundControl from './sections/GroundControl';

function App() {
  return (
    <>
      {/* Background Starfield and Telemetry Grid */}
      <CelestialCanvas />
      <div className="telemetry-grid" />
      <div className="scanlines" />

      {/* Foreground Interactive UI */}
      <Navigation />
      
      <main style={styles.main}>
        <MissionControl />
        <Telemetry />
        <FlightLog />
        <Payload />
        <GroundControl />
      </main>

      <footer style={styles.footer} className="text-mono">
        <div style={styles.footerContent}>
          <span>VG-8819 // ORBITAL STATION // SECURE LINK</span>
          <span>© {new Date().getFullYear()} VANSHUL GOYAL. ALL RADAR BANDS RESERVED.</span>
        </div>
      </footer>
    </>
  );
}

const styles = {
  main: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    borderTop: '1px solid var(--color-border)',
    background: 'rgba(3, 3, 6, 0.9)',
    backdropFilter: 'blur(12px)',
    padding: '24px 0',
    color: 'var(--color-text-muted)',
    fontSize: '0.7rem',
    position: 'relative',
    zIndex: 3,
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
};

export default App;
