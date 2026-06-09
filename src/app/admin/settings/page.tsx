'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

type CategoryType = 'tournament' | 'scoring' | 'entry' | 'notifications' | 'security' | 'prizes';

export default function SettingsPage() {
  const { settings, updateSettings, prizes, addPrize, deletePrize } = useApp();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('tournament');

  // New prize form states
  const [prizeName, setPrizeName] = useState('');
  const [prizeIcon, setPrizeIcon] = useState('⚽');
  const [prizeDesc, setPrizeDesc] = useState('');
  const [prizeTier, setPrizeTier] = useState('Bronze');
  const [prizeQty, setPrizeQty] = useState(10);

  // Local Form state matching configuration variables
  const [tournamentName, setTournamentName] = useState(settings.tournamentName);
  const [tournamentYear, setTournamentYear] = useState(settings.tournamentYear);
  const [startDate, setStartDate] = useState(settings.startDate);
  const [endDate, setEndDate] = useState(settings.endDate);

  const [exactScorePoints, setExactScorePoints] = useState(settings.exactScorePoints);
  const [correctResultPoints, setCorrectResultPoints] = useState(settings.correctResultPoints);
  const [allowAfterStart, setAllowAfterStart] = useState(settings.allowAfterStart);

  const [entryFee, setEntryFee] = useState(settings.entryFee);
  const [winnerShare, setWinnerShare] = useState(settings.prizeSplit.winner);
  const [platformShare, setPlatformShare] = useState(settings.prizeSplit.platform);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (winnerShare + platformShare > 100) {
      alert('Total shares must not exceed 100%');
      return;
    }

    updateSettings(activeCategory, {
      tournamentName,
      tournamentYear,
      startDate,
      endDate,
      exactScorePoints,
      correctResultPoints,
      allowAfterStart,
      entryFee,
      prizeSplit: {
        winner: winnerShare,
        top3: 20,
        top10: 10,
        platform: platformShare
      }
    });

    alert('Settings configuration changes saved successfully! (Toasts triggered)');
  };

  const navItems = [
    { id: 'tournament', name: 'Tournament Setup', icon: 'ti ti-trophy' },
    { id: 'scoring', name: 'Scoring Rules', icon: 'ti ti-list-check' },
    { id: 'entry', name: 'Entry & Payments', icon: 'ti ti-coin' },
    { id: 'prizes', name: 'Physical Prizes', icon: 'ti ti-gift' },
    { id: 'notifications', name: 'Notifications', icon: 'ti ti-bell' },
    { id: 'security', name: 'Access & Security', icon: 'ti ti-shield-lock' }
  ];

  return (
    <div className="content-body">
      
      <div className="three-col" style={{ gridTemplateColumns: '1fr 3fr' }}>
        
        {/* Left Nav menu */}
        <div className="card" style={{ padding: '10px 0', height: 'fit-content' }}>
          <div style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
            System Settings
          </div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id as CategoryType)}
              className={`nav-item ${activeCategory === item.id ? 'active' : ''}`}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                justifyContent: 'flex-start',
                color: activeCategory === item.id ? '#fff' : 'var(--text)',
                padding: '12px 20px',
                borderLeft: activeCategory === item.id ? '3px solid var(--gold)' : '3px solid transparent'
              }}
            >
              <i className={item.icon} style={{ color: activeCategory === item.id ? '#fff' : 'var(--muted)', marginRight: '8px' }}></i>
              {item.name}
            </button>
          ))}
        </div>

        {/* Right Active configuration Panel */}
        <form onSubmit={handleSave} className="card">
          
          {activeCategory === 'tournament' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Tournament Setup &amp; Schedule
              </h3>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Tournament Brand Name</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Championship Year</label>
                  <input
                    type="number"
                    value={tournamentYear}
                    onChange={(e) => setTournamentYear(parseInt(e.target.value) || 2026)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Total Enrolled Teams</label>
                  <input type="number" readOnly value="32" className="form-control" style={{ background: 'var(--surface)' }} />
                </div>
              </div>

              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'scoring' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Leaderboard Points Scoring Logic
              </h3>

              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Exact Scoreline Correct (pts)</label>
                  <input
                    type="number"
                    value={exactScorePoints}
                    onChange={(e) => setExactScorePoints(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Correct Winner / Draw Only (pts)</label>
                  <input
                    type="number"
                    value={correctResultPoints}
                    onChange={(e) => setCorrectResultPoints(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(234, 88, 12, 0.06)', border: '1px solid rgba(234, 88, 12, 0.15)', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--orange)', fontSize: '13px', display: 'block' }}>Danger: Allow Late Submissions</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Allow predictions after match kickoff locks (dangerous fallback).</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowAfterStart}
                    onChange={(e) => setAllowAfterStart(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'entry' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Tickets &amp; Revenue Settings
              </h3>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Entry Fee (Ticket Price €)</label>
                <input
                  type="number"
                  step="0.01"
                  value={entryFee}
                  onChange={(e) => setEntryFee(parseFloat(e.target.value) || 0)}
                  className="form-control"
                />
              </div>

              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Winner Allocation Share (%)</label>
                  <input
                    type="number"
                    value={winnerShare}
                    onChange={(e) => setWinnerShare(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Platform Commission Share (%)</label>
                  <input
                    type="number"
                    value={platformShare}
                    onChange={(e) => setPlatformShare(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'notifications' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Alert Broadcast Triggers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Email notifications for new player signups',
                  'Push notification alerts for payments received',
                  'Broadcasting live alerts when match starts',
                  'Trigger email digest reports when matches finished'
                ].map((txt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                    <input type="checkbox" defaultChecked style={{ width: '15px', height: '15px' }} />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'security' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Security &amp; API keys
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="inline-stat">
                  <span className="inline-stat-label">Platform 2FA Status</span>
                  <span className="inline-stat-value text-green">Enabled</span>
                </div>
                <div className="inline-stat">
                  <span className="inline-stat-label">Session Idle Timeout</span>
                  <span className="inline-stat-value">30 Minutes</span>
                </div>
                <div className="inline-stat" style={{ borderBottom: 'none' }}>
                  <span className="inline-stat-label">Sandbox API Token</span>
                  <span className="inline-stat-value"><code>live_tok_wc26...</code></span>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'prizes' && (
            <div>
              <h3 className="section-title" style={{ borderBottom: '0.5px solid var(--divider)', paddingBottom: '12px', marginBottom: '20px' }}>
                Manage Merchandise Prizes &amp; Fan Gear
              </h3>

              {/* Add Prize Inline Form */}
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Add Custom Merchandise Prize</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Prize Emoji Icon</label>
                    <select value={prizeIcon} onChange={(e) => setPrizeIcon(e.target.value)} className="form-control" style={{ padding: '6px' }}>
                      <option value="⚽">⚽ Football Ball</option>
                      <option value="👕">👕 Fan T-Shirt</option>
                      <option value="⏱️">⏱️ Stopwatch</option>
                      <option value="🧢">🧢 Cap / Hat</option>
                      <option value="🎒">🎒 Sports Backpack</option>
                      <option value="🎫">🎫 Voucher</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Prize Name</label>
                    <input type="text" value={prizeName} onChange={(e) => setPrizeName(e.target.value)} className="form-control" placeholder="Championship T-Shirt" />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Required Performance Tier</label>
                    <select value={prizeTier} onChange={(e) => setPrizeTier(e.target.value)} className="form-control" style={{ padding: '6px' }}>
                      <option value="Gold">Gold Tier Only</option>
                      <option value="Silver">Silver Tier Required</option>
                      <option value="Bronze">Bronze Tier Required</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" min="1" value={prizeQty} onChange={(e) => setPrizeQty(parseInt(e.target.value) || 1)} className="form-control" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Prize Description</label>
                  <input type="text" value={prizeDesc} onChange={(e) => setPrizeDesc(e.target.value)} className="form-control" placeholder="Brief description of merchandise gear" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!prizeName) {
                      alert('Please specify a prize name');
                      return;
                    }
                    addPrize({ name: prizeName, icon: prizeIcon, description: prizeDesc, tierRequired: prizeTier, quantity: prizeQty });
                    setPrizeName('');
                    setPrizeDesc('');
                    alert('Custom merchandise prize successfully added!');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: 'fit-content', marginTop: '6px' }}
                >
                  Create Prize
                </button>
              </div>

              {/* Prizes Table List */}
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Prize</th>
                      <th>Description</th>
                      <th>Level Tier required</th>
                      <th>Stock Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prizes.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                            <span style={{ fontSize: '20px' }}>{p.icon}</span>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>{p.description}</td>
                        <td>
                          <span className={`badge badge-${p.tierRequired.toLowerCase()}`}>{p.tierRequired} Tier</span>
                        </td>
                        <td>{p.quantity} pcs</td>
                        <td>
                          <button type="button" onClick={() => { deletePrize(p.id); alert('Prize removed.'); }} className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ borderTop: '0.5px solid var(--divider)', marginTop: '24px', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
