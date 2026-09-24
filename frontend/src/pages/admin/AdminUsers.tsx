import React, { useState, useEffect } from 'react';
import { adminService, type AdminUserItem } from '../../api/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Selected User for Modals
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Role Promotion/Demotion Confirmation Modal
  const [roleModalUser, setRoleModalUser] = useState<AdminUserItem | null>(null);
  const [targetRole, setTargetRole] = useState<'USER' | 'ADMIN'>('ADMIN');
  const [confirmInput, setConfirmInput] = useState('');
  const [roleReason, setRoleReason] = useState('');
  const [submittingRole, setSubmittingRole] = useState(false);

  // Status Toggle Modal
  const [statusModalUser, setStatusModalUser] = useState<AdminUserItem | null>(null);
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Feedback Notification
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        role: roleFilter || undefined,
        search: searchTerm || undefined,
      });
      setUsers(res.users);
    } catch (err: any) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  // Trigger Role Modal
  const openRoleModal = (u: AdminUserItem) => {
    setRoleModalUser(u);
    setTargetRole(u.role === 'ADMIN' ? 'USER' : 'ADMIN');
    setConfirmInput('');
    setRoleReason('');
  };

  // Submit Role Change
  const handleRoleChangeSubmit = async () => {
    if (!roleModalUser) return;
    if (targetRole === 'ADMIN' && confirmInput.trim().toUpperCase() !== 'CONFIRM') {
      return;
    }

    setSubmittingRole(true);
    try {
      await adminService.updateUserRole(roleModalUser.id, targetRole, roleReason);
      setAlert({
        type: 'success',
        text: `Role of ${roleModalUser.email} changed to ${targetRole} successfully.`,
      });
      setRoleModalUser(null);
      fetchUsers();
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Failed to update user role.' });
    } finally {
      setSubmittingRole(false);
    }
  };

  // Submit Status Toggle
  const handleToggleStatus = async () => {
    if (!statusModalUser) return;
    setSubmittingStatus(true);
    try {
      const newStatus = !statusModalUser.is_active;
      await adminService.toggleUserStatus(statusModalUser.id, newStatus, 'Admin console action');
      setAlert({
        type: 'success',
        text: `User ${statusModalUser.email} is now ${newStatus ? 'Active' : 'Deactivated'}.`,
      });
      setStatusModalUser(null);
      fetchUsers();
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Failed to toggle account status.' });
    } finally {
      setSubmittingStatus(false);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
            User Management & RBAC
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Inspect registered accounts, manage account status, and securely promote roles with strict confirmation.
          </p>
        </div>
      </div>

      {/* Alert banner */}
      {alert && (
        <div style={{
          background: alert.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${alert.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '12px',
          padding: '12px 16px',
          color: alert.type === 'success' ? '#86efac' : '#fca5a5',
          fontSize: '0.9rem',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{alert.text}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#10b981',
              color: '#022c22',
              fontWeight: 700,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setRoleFilter('')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: roleFilter === '' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: roleFilter === '' ? '#fff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('USER')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: roleFilter === 'USER' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: roleFilter === 'USER' ? '#38bdf8' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Users Only
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: roleFilter === 'ADMIN' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: roleFilter === 'ADMIN' ? '#f87171' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Admins Only
          </button>
        </div>
      </div>

      {/* Users Table */}
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
                <th style={{ padding: '14px 18px' }}>User Profile</th>
                <th style={{ padding: '14px 18px' }}>Role</th>
                <th style={{ padding: '14px 18px' }}>Auth Method</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Created Date</th>
                <th style={{ padding: '14px 18px' }}>Last Login</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={u.profile_image}
                          alt="Avatar"
                          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{u.full_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: u.role === 'ADMIN' ? '#f87171' : '#38bdf8',
                        border: `1px solid ${u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.4px',
                      }}>
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                      {u.authentication_provider === 'google' ? 'Google OAuth 2.0' : 'Email & Password'}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: u.is_active ? '#86efac' : '#fca5a5',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}>
                        <span style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: u.is_active ? '#10b981' : '#ef4444',
                        }} />
                        {u.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {u.created_at?.split('T')[0] || '—'}
                    </td>

                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.82rem' }}>
                      {u.last_login?.split('T')[0] || u.last_login || 'Recently'}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => { setSelectedUser(u); setShowViewModal(true); }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#cbd5e1',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>

                        <button
                          onClick={() => openRoleModal(u)}
                          style={{
                            background: u.role === 'ADMIN' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            border: `1px solid ${u.role === 'ADMIN' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            color: u.role === 'ADMIN' ? '#38bdf8' : '#fca5a5',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {u.role === 'ADMIN' ? 'Demote to USER' : 'Promote to ADMIN'}
                        </button>

                        <button
                          onClick={() => setStatusModalUser(u)}
                          style={{
                            background: u.is_active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: `1px solid ${u.is_active ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                            color: u.is_active ? '#fca5a5' : '#86efac',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View User Modal ── */}
      {showViewModal && selectedUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setShowViewModal(false)}>
          <div style={{
            maxWidth: '500px', width: '100%', background: '#0e1624',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px',
            padding: '28px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>User Identity Profile</h3>
              <button
                onClick={() => setShowViewModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <img src={selectedUser.profile_image} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #10b981' }} />
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedUser.full_name}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedUser.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>Role: {selectedUser.role}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>User ID:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>#{selectedUser.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Phone:</span>
                <span style={{ color: '#fff' }}>{selectedUser.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Provider:</span>
                <span style={{ color: '#fff' }}>{selectedUser.authentication_provider}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Account Status:</span>
                <span style={{ color: selectedUser.is_active ? '#86efac' : '#fca5a5', fontWeight: 700 }}>{selectedUser.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Registered:</span>
                <span style={{ color: '#fff' }}>{selectedUser.created_at}</span>
              </div>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Strong Confirmation Role Change Modal ── */}
      {roleModalUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setRoleModalUser(null)}>
          <div style={{
            maxWidth: '520px', width: '100%', background: '#0e1624',
            border: `1px solid ${targetRole === 'ADMIN' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
            borderRadius: '24px', padding: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }} onClick={(e) => e.stopPropagation()}>
            {/* Warning Icon */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: targetRole === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${targetRole === 'ADMIN' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', marginBottom: '16px',
            }}>
              {targetRole === 'ADMIN' ? '⚠️' : 'ℹ️'}
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>
              Confirm Role Change: {roleModalUser.role} ➔ {targetRole}
            </h3>

            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 18px' }}>
              You are about to change the security privileges of <strong>{roleModalUser.full_name}</strong> ({roleModalUser.email}).
            </p>

            {targetRole === 'ADMIN' && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '14px',
                color: '#fca5a5',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                marginBottom: '18px',
              }}>
                <strong>SECURITY WARNING:</strong> Promoting a user to <strong>ADMIN</strong> grants full access to system telemetry, user modification, model toggles, and sensitive audit records. This action will be recorded in the immutable audit log.
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Administrative Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Agronomy team lead onboarding"
                value={roleReason}
                onChange={(e) => setRoleReason(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.88rem', outline: 'none',
                }}
              />
            </div>

            {targetRole === 'ADMIN' && (
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Type <span style={{ color: '#ef4444', fontWeight: 800 }}>CONFIRM</span> to proceed:
                </label>
                <input
                  type="text"
                  placeholder="CONFIRM"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none',
                    fontWeight: 700, letterSpacing: '1px',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)', color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.12)', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleChangeSubmit}
                disabled={submittingRole || (targetRole === 'ADMIN' && confirmInput.trim().toUpperCase() !== 'CONFIRM')}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: targetRole === 'ADMIN' ? '#ef4444' : '#0284c7',
                  color: '#fff', border: 'none', fontWeight: 700,
                  cursor: (submittingRole || (targetRole === 'ADMIN' && confirmInput.trim().toUpperCase() !== 'CONFIRM')) ? 'not-allowed' : 'pointer',
                  opacity: (targetRole === 'ADMIN' && confirmInput.trim().toUpperCase() !== 'CONFIRM') ? 0.4 : 1,
                }}
              >
                {submittingRole ? 'Updating Role...' : `Confirm: Set Role to ${targetRole}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Toggle Confirmation Modal ── */}
      {statusModalUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setStatusModalUser(null)}>
          <div style={{
            maxWidth: '440px', width: '100%', background: '#0e1624',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px', color: '#fff' }}>
              {statusModalUser.is_active ? 'Deactivate Account' : 'Activate Account'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to {statusModalUser.is_active ? 'deactivate' : 'activate'} the account for{' '}
              <strong style={{ color: '#fff' }}>{statusModalUser.full_name}</strong> ({statusModalUser.email})?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStatusModalUser(null)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: 'none', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={submittingStatus}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: statusModalUser.is_active ? '#ef4444' : '#10b981',
                  color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {submittingStatus ? 'Processing...' : statusModalUser.is_active ? 'Yes, Deactivate' : 'Yes, Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
