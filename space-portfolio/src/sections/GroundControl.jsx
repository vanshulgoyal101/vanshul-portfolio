// src/sections/GroundControl.jsx
import { useState } from 'react';
import { Send, Terminal } from 'lucide-react';

const GroundControl = () => {
  const [formData, setFormData] = useState({
    transmitter: '',
    sector: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate telemetry transmissions
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ transmitter: '', sector: '', message: '' });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="groundcontrol" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="telemetry-badge">
            <span className="status-dot active" />
            COMMUNICATION // UPLINK
          </div>
          <h2 style={styles.sectionTitle}>GROUND CONTROL</h2>
          <p style={styles.sectionSub}>Establish a telemetry uplink / send a message directly to systems control.</p>
        </div>

        <div className="hud-panel" style={styles.console}>
          <div className="hud-corner-br" />
          
          <div style={styles.consoleHeader} className="text-mono">
            <Terminal size={14} style={{ color: 'var(--color-accent-cyan)' }} />
            <span>SECURE_COMMS_V1.9 // INPUT_CONSOLE</span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label} className="text-mono">[TRANSMITTER_ID] (NAME)</label>
                <input
                  type="text"
                  name="transmitter"
                  value={formData.transmitter}
                  onChange={handleInputChange}
                  placeholder="e.g. MISSION_COMMANDER"
                  required
                  style={styles.input}
                  className="text-mono"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label} className="text-mono">[COMM_CHANNEL] (EMAIL)</label>
                <input
                  type="email"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  placeholder="e.g. cmd@groundcontrol.net"
                  required
                  style={styles.input}
                  className="text-mono"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label} className="text-mono">[TRANSMISSION_PAYLOAD] (MESSAGE)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter communication logs for direct uplink..."
                required
                rows={5}
                style={styles.textarea}
                className="text-mono"
              />
            </div>

            <div style={styles.actionRow}>
              <button 
                type="submit" 
                className="btn-telemetry" 
                style={{
                  ...styles.submitBtn,
                  opacity: isSent ? 0.6 : 1,
                  borderColor: isSent ? '#2ecc71' : 'var(--color-accent-cyan)',
                  color: isSent ? '#2ecc71' : 'var(--color-accent-cyan)',
                }}
                disabled={isSent}
              >
                {isSent ? 'UPLINK ESTABLISHED ✓' : 'TRANSMIT PACKET'}
                {!isSent && <Send size={14} />}
              </button>
            </div>
          </form>

          {isSent && (
            <div style={styles.telemetryStream} className="text-mono">
              <p style={{ color: '#2ecc71' }}>&gt;&gt; UPLINK STATUS: NOMINAL</p>
              <p>&gt;&gt; ENCRYPTING PAYLOAD...</p>
              <p>&gt;&gt; BROADCASTING TO VG-8819 ORBITAL NODE...</p>
              <p>&gt;&gt; PACKET RECEIVED. THANK YOU, COMMANDER.</p>
            </div>
          )}
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
    maxWidth: '800px',
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
  console: {
    borderRadius: '4px',
    padding: '32px',
  },
  consoleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
    marginBottom: '24px',
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '1px',
  },
  input: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    padding: '12px',
    fontSize: '0.85rem',
    borderRadius: '2px',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  textarea: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    padding: '12px',
    fontSize: '0.85rem',
    borderRadius: '2px',
    outline: 'none',
    resize: 'vertical',
    transition: 'all var(--transition-fast)',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  telemetryStream: {
    marginTop: '24px',
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '20px',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    lineHeight: '1.8',
  },
};

export default GroundControl;
