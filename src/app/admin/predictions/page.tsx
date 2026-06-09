'use client';

import React, { useState } from 'react';
import { useApp, Prediction } from '@/context/AppContext';

export default function AdminPredictionsPage() {
  const { predictions, matches, resolveDispute } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'scored' | 'disputed' | 'void'>('all');
  const [filterMatch, setFilterMatch] = useState('all');
  const [showDisputeModal, setShowDisputeModal] = useState<Prediction | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const handleOpenDispute = (p: Prediction) => {
    setAdminNote(p.adminNote || '');
    setShowDisputeModal(p);
  };

  const handleResolve = (resolution: 'uphold' | 'dismiss' | 'void') => {
    if (!showDisputeModal) return;
    resolveDispute(showDisputeModal.id, resolution, adminNote);
    setShowDisputeModal(null);
    setAdminNote('');
    alert(`Dispute resolved: ${resolution}. Leaderboard scores updated!`);
  };

  const filteredPredictions = predictions.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const matchMatch = filterMatch === 'all' || p.matchId === filterMatch;
    return statusMatch && matchMatch;
  });

  return (
    <div className="content-body">
      
      {/* Stats KPI Cards */}
      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Submitted</div>
          <div className="stat-value">{predictions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Scoring</div>
          <div className="stat-value">{predictions.filter(p => p.status === 'pending').length}</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--orange)' }}>
          <div className="stat-label" style={{ color: 'var(--orange)' }}>Disputes Raised</div>
          <div className="stat-value" style={{ color: 'var(--orange)' }}>
            {predictions.filter(p => p.status === 'disputed').length}
          </div>
        </div>
      </section>

      {/* Predictions Dashboard */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">Audit Predictions Trail</h3>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', margin: '12px 0 20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: '150px' }}>
            <label>Filter Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="form-control" style={{ padding: '6px 12px' }}>
              <option value="all">All Predictions</option>
              <option value="pending">Pending</option>
              <option value="scored">Scored</option>
              <option value="disputed">Disputed</option>
              <option value="void">Void</option>
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '200px' }}>
            <label>Filter Match</label>
            <select value={filterMatch} onChange={(e) => setFilterMatch(e.target.value)} className="form-control" style={{ padding: '6px 12px' }}>
              <option value="all">All Matches</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {m.homeTeam} vs {m.awayTeam} ({m.stage})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Player User</th>
                <th>Match</th>
                <th>Predicted</th>
                <th>Actual</th>
                <th>Points Awarded</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPredictions.map((p) => {
                const match = matches.find(m => m.id === p.matchId);
                if (!match) return null;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-sm" style={{ background: '#0284c7' }}>{p.userAvatar}</div>
                        <span>{p.userName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="team-vs">
                        <span>{match.homeFlag} {match.homeTeam}</span>
                        <span className="vs-divider">vs</span>
                        <span>{match.awayFlag} {match.awayTeam}</span>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{p.predictedHome} – {p.predictedAway}</span></td>
                    <td>
                      {match.status === 'finished' ? (
                        <span className="score-pill">{match.homeScore} – {match.awayScore}</span>
                      ) : (
                        <span className="score-pill none">– : –</span>
                      )}
                    </td>
                    <td>
                      {p.points !== undefined ? (
                        <strong>+{p.points}</strong>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(p.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      {p.status === 'disputed' && (
                        <button onClick={() => handleOpenDispute(p)} className="btn btn-sm btn-primary">
                          Review Dispute
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dispute Modal */}
      {showDisputeModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header" style={{ background: 'var(--surface)' }}>
              <h3>Resolve Prediction Dispute</h3>
              <button onClick={() => setShowDisputeModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{ background: 'rgba(234, 88, 12, 0.08)', border: '1px solid rgba(234, 88, 12, 0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                <strong>Claim Raised by {showDisputeModal.userName}:</strong>
                <p style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--orange)' }}>
                  &ldquo;{showDisputeModal.disputeReason}&rdquo;
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                  <strong>Prediction:</strong>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    {showDisputeModal.predictedHome} – {showDisputeModal.predictedAway}
                  </div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                  <strong>Actual Score Result:</strong>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    {(() => {
                      const m = matches.find(match => match.id === showDisputeModal.matchId);
                      return m ? `${m.homeScore} – ${m.awayScore} (FT)` : 'Pending';
                    })()}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Admin Note / Resolution Details</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Review finished: awarding full points. Incorrect scoring trace cleared."
                  className="form-control"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => handleResolve('void')} className="btn btn-sm btn-danger" style={{ marginRight: 'auto' }}>
                Void Prediction
              </button>
              <button onClick={() => handleResolve('dismiss')} className="btn btn-sm">
                Dismiss Claim
              </button>
              <button onClick={() => handleResolve('uphold')} className="btn btn-sm btn-primary">
                Uphold &amp; Award Points
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
