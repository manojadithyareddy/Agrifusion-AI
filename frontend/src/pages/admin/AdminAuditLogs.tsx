import { useState, useEffect } from 'react';
import { adminService, type AdminAuditLogItem } from '../../api/admin';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAuditLogs()
      .then(res => setLogs(res.logs))
      .catch(err => console.warn('Audit logs fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
          Security & Administrative Audit Logs
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Immutable audit record of administrative privilege modifications, user state changes, model toggles, and dataset uploads.
        </p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '14px 18px' }}>Actor</th>
                <th style={{ padding: '14px 18px' }}>Role</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
                <th style={{ padding: '14px 18px' }}>Target Resource</th>
                <th style={{ padding: '14px 18px' }}>IP Address</th>
                <th style={{ padding: '14px 18px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading audit trail...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No audit records.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#fff' }}>
                      {log.actor}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.15)', color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800,
                      }}>
                        {log.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#38bdf8', fontWeight: 700 }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                      {log.target}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.8rem' }}>
                      <code>{log.ip_address}</code>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {log.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
