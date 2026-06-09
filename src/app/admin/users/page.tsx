'use client';

import React, { useState } from 'react';
import { useApp, User } from '@/context/AppContext';

export default function UsersPage() {
  const { users, predictions, payments, updateUserStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'predictions' | 'score' | 'alpha'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'predictions' | 'payments'>('overview');

  const handleToggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkSuspend = () => {
    selectedUsers.forEach(id => updateUserStatus(id, 'Suspended'));
    setSelectedUsers([]);
    alert('Selected users suspended successfully.');
  };

  const handleSuspend = (userId: string, currentStatus: User['status']) => {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    updateUserStatus(userId, nextStatus);
    alert(`User status updated to: ${nextStatus}`);
  };

  const handleOpenDetail = (user: User) => {
    setSelectedUserDetail(user);
    setModalTab('overview');
  };

  // Filter and Sort Logic
  const filteredUsers = users
    .filter(u => {
      const matchStatus = filterStatus === 'All' || u.status === filterStatus;
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return b.joinedAt.localeCompare(a.joinedAt);
      } else if (sortOption === 'predictions') {
        return b.totalPredictions - a.totalPredictions;
      } else if (sortOption === 'score') {
        return b.points - a.points;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="content-body">
      
      {/* Search and Top actions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div className="topbar-search" style={{ background: 'var(--surface)' }}>
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => alert('Exporting all users data as CSV...')} className="btn btn-sm">
              <i className="ti ti-download"></i> Export CSV
            </button>
          </div>
        </div>

        {/* Filters and sorting Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '0.5px solid var(--divider)', paddingTop: '16px', marginBottom: '12px' }}>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['All', 'Active', 'Inactive', 'Suspended'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`tab ${filterStatus === tab ? 'active' : ''}`}
                style={{ padding: '4px 12px' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Sort:</label>
            <select value={sortOption} onChange={(e: any) => setSortOption(e.target.value)} className="form-control" style={{ padding: '4px 10px', fontSize: '12px' }}>
              <option value="newest">Newest Joined</option>
              <option value="predictions">Most Predictions</option>
              <option value="score">Highest Points</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedUsers.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--divider)', borderRadius: '8px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {selectedUsers.length} users selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleBulkSuspend} className="btn btn-sm btn-danger">Suspend Selected</button>
              <button onClick={() => { setSelectedUsers([]); }} className="btn btn-sm">Cancel</button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ width: '30px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Rank</th>
                <th>User Details</th>
                <th>Email address</th>
                <th>Joined Date</th>
                <th>Predictions</th>
                <th>Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id} style={{ background: selectedUsers.includes(u.id) ? 'rgba(0,87,184,0.03)' : '' }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => handleToggleSelectUser(u.id)}
                    />
                  </td>
                  <td className="rank-col">0{i + 1}</td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm" style={{ background: u.status === 'Suspended' ? 'var(--red)' : '#0d9488' }}>
                        {u.initials}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      onClick={() => { navigator.clipboard.writeText(u.email); alert('Email copied!'); }}
                      style={{ cursor: 'pointer', borderBottom: '1px dotted var(--divider)', fontSize: '12px' }}
                      title="Click to copy email"
                    >
                      {u.email}
                    </span>
                  </td>
                  <td>{u.joinedAt}</td>
                  <td>{u.totalPredictions}</td>
                  <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{u.points} pts</span></td>
                  <td>
                    <span className={`badge badge-${u.status.toLowerCase()}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => handleOpenDetail(u)} className="btn btn-sm">
                        View Profile
                      </button>
                      <button onClick={() => handleSuspend(u.id, u.status)} className="btn btn-sm btn-danger" style={{ padding: '4px 6px' }}>
                        <i className={`ti ti-${u.status === 'Suspended' ? 'user-check' : 'user-x'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserDetail && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="avatar-sm" style={{ width: '36px', height: '36px', background: '#0284c7', fontSize: '13px' }}>
                  {selectedUserDetail.initials}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', margin: 0 }}>{selectedUserDetail.name}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{selectedUserDetail.email}</span>
                </div>
              </div>
              <span className={`badge badge-${selectedUserDetail.status.toLowerCase()}`}>
                {selectedUserDetail.status}
              </span>
            </div>

            <div className="modal-body" style={{ minHeight: '300px' }}>
              {/* Tab options inside modal */}
              <div className="tabbar" style={{ marginBottom: '14px' }}>
                <button onClick={() => setModalTab('overview')} className={`tab ${modalTab === 'overview' ? 'active' : ''}`}>Overview</button>
                <button onClick={() => setModalTab('predictions')} className={`tab ${modalTab === 'predictions' ? 'active' : ''}`}>Predictions</button>
                <button onClick={() => setModalTab('payments')} className={`tab ${modalTab === 'payments' ? 'active' : ''}`}>Payments</button>
              </div>

              {modalTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="inline-stat">
                    <span className="inline-stat-label">Joined Date</span>
                    <span className="inline-stat-value">{selectedUserDetail.joinedAt}</span>
                  </div>
                  <div className="inline-stat">
                    <span className="inline-stat-label">Total Predictions</span>
                    <span className="inline-stat-value">{selectedUserDetail.totalPredictions}</span>
                  </div>
                  <div className="inline-stat">
                    <span className="inline-stat-label">Exact Scorelines</span>
                    <span className="inline-stat-value">{selectedUserDetail.exactScores}</span>
                  </div>
                  <div className="inline-stat">
                    <span className="inline-stat-label">Total Points</span>
                    <span className="inline-stat-value" style={{ color: 'var(--primary)', fontSize: '14px' }}>{selectedUserDetail.points} pts</span>
                  </div>
                  <div className="inline-stat">
                    <span className="inline-stat-label">League Rank</span>
                    <span className="inline-stat-value">#3</span>
                  </div>
                  <div className="inline-stat">
                    <span className="inline-stat-label">Status Level</span>
                    <span className="inline-stat-value">
                      <span className={`badge badge-${selectedUserDetail.tier.toLowerCase()}`}>{selectedUserDetail.tier} Tier</span>
                    </span>
                  </div>
                </div>
              )}

              {modalTab === 'predictions' && (
                <div className="table-responsive">
                  <table style={{ fontSize: '11px' }}>
                    <thead>
                      <tr>
                        <th>Match</th>
                        <th>Predicted</th>
                        <th>Points</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions
                        .filter(p => p.userId === selectedUserDetail.id)
                        .map(p => (
                          <tr key={p.id}>
                            <td>Match #{p.matchId}</td>
                            <td><strong>{p.predictedHome} – {p.predictedAway}</strong></td>
                            <td>{p.points !== undefined ? `+${p.points}` : '—'}</td>
                            <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {modalTab === 'payments' && (
                <div className="table-responsive">
                  <table style={{ fontSize: '11px' }}>
                    <thead>
                      <tr>
                        <th>Trans ID</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments
                        .filter(pay => pay.userId === selectedUserDetail.id)
                        .map(pay => (
                          <tr key={pay.id}>
                            <td><code>{pay.id}</code></td>
                            <td>€{pay.amount.toFixed(2)}</td>
                            <td>{pay.date}</td>
                            <td><span className={`badge badge-${pay.status.toLowerCase()}`}>{pay.status}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedUserDetail(null)} className="btn btn-sm btn-primary">Close Details</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
