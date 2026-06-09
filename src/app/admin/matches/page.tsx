'use client';

import React, { useState, useEffect } from 'react';
import { useApp, Match } from '@/context/AppContext';

export default function MatchesPage() {
  const { matches, addMatch, updateMatch } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [showModal, setShowModal] = useState<Match | null | 'new'>(null);

  // Form states
  const [homeTeam, setHomeTeam] = useState('');
  const [homeFlag, setHomeFlag] = useState('🇧🇷');
  const [awayTeam, setAwayTeam] = useState('');
  const [awayFlag, setAwayFlag] = useState('🇦🇷');
  const [stage, setStage] = useState('Group Stage');
  const [status, setStatus] = useState<Match['status']>('upcoming');
  const [time, setTime] = useState('18:00');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  // Handle Dispatch event from layout topbar Add Match button
  useEffect(() => {
    const handleOpenNewMatch = () => {
      handleOpenModal('new');
    };
    window.addEventListener('open-new-match', handleOpenNewMatch);
    return () => window.removeEventListener('open-new-match', handleOpenNewMatch);
  }, []);

  const handleOpenModal = (match: Match | 'new') => {
    if (match === 'new') {
      setHomeTeam('');
      setHomeFlag('🇧🇷');
      setAwayTeam('');
      setAwayFlag('🇦🇷');
      setStage('Group Stage');
      setStatus('upcoming');
      setTime('18:00');
      setHomeScore('');
      setAwayScore('');
    } else {
      setHomeTeam(match.homeTeam);
      setHomeFlag(match.homeFlag);
      setAwayTeam(match.awayTeam);
      setAwayFlag(match.awayFlag);
      setStage(match.stage);
      setStatus(match.status);
      setTime(match.time || 'FT');
      setHomeScore(match.homeScore !== undefined ? match.homeScore.toString() : '');
      setAwayScore(match.awayScore !== undefined ? match.awayScore.toString() : '');
    }
    setShowModal(match);
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) {
      alert('Please fill in team names');
      return;
    }

    const matchData = {
      homeTeam,
      homeFlag,
      awayTeam,
      awayFlag,
      stage,
      status,
      time: status === 'finished' ? 'FT' : time,
      homeScore: (status !== 'upcoming' && homeScore !== '') ? parseInt(homeScore) : undefined,
      awayScore: (status !== 'upcoming' && awayScore !== '') ? parseInt(awayScore) : undefined
    };

    if (showModal === 'new') {
      addMatch(matchData);
    } else if (showModal && typeof showModal === 'object') {
      updateMatch(showModal.id, matchData);
    }

    setShowModal(null);
  };

  const filteredMatches = matches.filter(m => {
    if (filterTab === 'all') return true;
    return m.status === filterTab;
  });

  return (
    <div className="content-body">
      
      {/* Matches Controls */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">All Matches Dashboard</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleOpenModal('new')} className="btn btn-primary btn-sm">
              <i className="ti ti-plus"></i> New Match
            </button>
          </div>
        </div>

        {/* Tabbar */}
        <div className="tabbar" style={{ marginTop: '12px' }}>
          {(['all', 'live', 'upcoming', 'finished'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`tab ${filterTab === tab ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table of Matches */}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Match Details</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Result Score</th>
                <th>Predictions Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="team-vs">
                      <span>{m.homeFlag}</span>
                      <span>{m.homeTeam}</span>
                      <span className="vs-divider">vs</span>
                      <span>{m.awayFlag}</span>
                      <span>{m.awayTeam}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontWeight: 500 }}>{m.stage}</td>
                  <td>
                    {m.status === 'live' ? (
                      <span className="badge badge-live">
                        <span className="pulse-dot"></span> Live {m.time}
                      </span>
                    ) : m.status === 'upcoming' ? (
                      <span className="badge badge-upcoming">
                        {m.time}
                      </span>
                    ) : (
                      <span className="badge badge-finished">
                        Finished
                      </span>
                    )}
                  </td>
                  <td>
                    {m.status !== 'upcoming' ? (
                      <span className="score-pill">{m.homeScore} – {m.awayScore}</span>
                    ) : (
                      <span className="score-pill none">– : –</span>
                    )}
                  </td>
                  <td>
                    <div className="participants-bar">
                      <div className="mini-bar-bg">
                        <div className="mini-bar-fill" style={{ width: `${Math.min(100, (m.entries / 2000) * 100)}%` }}></div>
                      </div>
                      {m.entries.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => handleOpenModal(m)} className="btn btn-sm">
                        <i className="ti ti-edit"></i> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Match Modal (Section 4) */}
      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleSaveMatch} className="modal-card">
            <div className="modal-header">
              <h3>{showModal === 'new' ? 'Add New Match' : 'Edit Match Details'}</h3>
              <button type="button" onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)} className="form-control">
                    <option>Group Stage</option>
                    <option>Round of 16</option>
                    <option>Quarter-finals</option>
                    <option>Semi-finals</option>
                    <option>Final</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Match Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as Match['status'])} className="form-control">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Home Team Flag</label>
                  <input type="text" value={homeFlag} onChange={(e) => setHomeFlag(e.target.value)} className="form-control" placeholder="e.g. 🇧🇷" />
                </div>
                <div className="form-group">
                  <label>Home Team Name</label>
                  <input type="text" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} className="form-control" placeholder="Brazil" />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Away Team Flag</label>
                  <input type="text" value={awayFlag} onChange={(e) => setAwayFlag(e.target.value)} className="form-control" placeholder="e.g. 🇦🇷" />
                </div>
                <div className="form-group">
                  <label>Away Team Name</label>
                  <input type="text" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} className="form-control" placeholder="Argentina" />
                </div>
              </div>

              <div className="form-group">
                <label>Time / Minute Indicator</label>
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="form-control" placeholder="18:00 or 67'" />
              </div>

              {status !== 'upcoming' && (
                <div className="form-grid" style={{ background: 'var(--surface)', padding: '12px', borderRadius: '8px' }}>
                  <div className="form-group">
                    <label>Home Score</label>
                    <input type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Away Score</label>
                    <input type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="form-control" />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowModal(null)} className="btn btn-sm">Cancel</button>
              <button type="submit" className="btn btn-sm btn-primary">Save Match</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
