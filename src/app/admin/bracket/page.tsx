'use client';

import React, { useState } from 'react';
import { useApp, Match } from '@/context/AppContext';

export default function BracketPage() {
  const { matches, updateMatch } = useApp();
  const [hoveredMatch, setHoveredMatch] = useState<Match | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  // Define nodes positions for bracket
  // R16 (8 matches), QF (4 matches), SF (2 matches), Final (1 match)
  const roundOf16 = matches.slice(0, 4); // Left QF feeders
  const qf = matches.slice(4, 6);
  const sf = matches.slice(6, 7);
  const final = matches.slice(0, 1); // Sample final fallback

  const handleMatchClick = (m: Match) => {
    setSelectedMatch(m);
    setHomeScore(m.homeScore !== undefined ? m.homeScore.toString() : '');
    setAwayScore(m.awayScore !== undefined ? m.awayScore.toString() : '');
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;
    
    updateMatch(selectedMatch.id, {
      status: 'finished',
      time: 'FT',
      homeScore: parseInt(homeScore) || 0,
      awayScore: parseInt(awayScore) || 0
    });

    setSelectedMatch(null);
    alert('Match score updated and points redistributed across users!');
  };

  return (
    <div className="content-body">
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <h3 className="section-title">Visual Knockout Bracket &amp; Progression Tree</h3>
          <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Click match box to edit scores directly</span>
        </div>

        {/* Tree Container */}
        <div className="bracket-wrapper">
          <div className="bracket-container">
            
            {/* Round of 16 */}
            <div className="bracket-round">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textAlign: 'center', textTransform: 'uppercase', marginBottom: '8px' }}>Round of 16</div>
              {matches.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMatchClick(m)}
                  onMouseEnter={() => setHoveredMatch(m)}
                  onMouseLeave={() => setHoveredMatch(null)}
                  className={`bracket-match ${m.status}`}
                >
                  <div className="bracket-team">
                    <span>{m.homeFlag} {m.homeTeam}</span>
                    <span className="bracket-score">{m.homeScore !== undefined ? m.homeScore : '–'}</span>
                  </div>
                  <div className="bracket-team">
                    <span>{m.awayFlag} {m.awayTeam}</span>
                    <span className="bracket-score">{m.awayScore !== undefined ? m.awayScore : '–'}</span>
                  </div>
                  
                  {/* Hover tooltip details */}
                  {hoveredMatch?.id === m.id && (
                    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '10px', width: '180px', zIndex: 10, boxShadow: 'var(--shadow-md)', pointerEvents: 'none', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3px', marginBottom: '3px' }}>{m.stage} Match Info</div>
                      <div>Entries: {m.entries.toLocaleString()}</div>
                      <div>Preds Split: Home {m.predictionSplit.homeWin}% | Draw {m.predictionSplit.draw}% | Away {m.predictionSplit.awayWin}%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Connecting lines column */}
            <svg height="480" width="40" style={{ pointerEvents: 'none' }}>
              <path d="M 0 60 L 20 60 L 20 180 L 40 180" fill="none" stroke="var(--divider)" strokeWidth="1.5" />
              <path d="M 0 300 L 20 300 L 20 420 L 40 420" fill="none" stroke="var(--divider)" strokeWidth="1.5" />
            </svg>

            {/* Quarter-finals */}
            <div className="bracket-round">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textAlign: 'center', textTransform: 'uppercase', marginBottom: '8px' }}>Quarter-finals</div>
              {matches.slice(4, 6).map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMatchClick(m)}
                  onMouseEnter={() => setHoveredMatch(m)}
                  onMouseLeave={() => setHoveredMatch(null)}
                  className={`bracket-match ${m.status}`}
                >
                  <div className="bracket-team">
                    <span>{m.homeFlag} {m.homeTeam}</span>
                    <span className="bracket-score">{m.homeScore !== undefined ? m.homeScore : '–'}</span>
                  </div>
                  <div className="bracket-team">
                    <span>{m.awayFlag} {m.awayTeam}</span>
                    <span className="bracket-score">{m.awayScore !== undefined ? m.awayScore : '–'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting line */}
            <svg height="480" width="40" style={{ pointerEvents: 'none' }}>
              <path d="M 0 120 L 20 120 L 20 240 L 40 240" fill="none" stroke="var(--divider)" strokeWidth="1.5" />
            </svg>

            {/* Semi-finals */}
            <div className="bracket-round">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textAlign: 'center', textTransform: 'uppercase', marginBottom: '8px' }}>Semi-finals</div>
              {matches.slice(6, 7).map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMatchClick(m)}
                  onMouseEnter={() => setHoveredMatch(m)}
                  onMouseLeave={() => setHoveredMatch(null)}
                  className={`bracket-match ${m.status}`}
                >
                  <div className="bracket-team">
                    <span>{m.homeFlag} {m.homeTeam}</span>
                    <span className="bracket-score">{m.homeScore !== undefined ? m.homeScore : '–'}</span>
                  </div>
                  <div className="bracket-team">
                    <span>{m.awayFlag} {m.awayTeam}</span>
                    <span className="bracket-score">{m.awayScore !== undefined ? m.awayScore : '–'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Final */}
            <div className="bracket-round">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textAlign: 'center', textTransform: 'uppercase', marginBottom: '8px' }}>Championship Final</div>
              <div
                onClick={() => handleMatchClick(matches[4])}
                className={`bracket-match ${matches[4].status}`}
                style={{ background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.03) 0%, #fff 100%)', borderColor: 'var(--gold)' }}
              >
                <div className="bracket-team">
                  <span>🏆 Germany</span>
                  <span className="bracket-score">{matches[4].homeScore !== undefined ? matches[4].homeScore : '–'}</span>
                </div>
                <div className="bracket-team">
                  <span>🏆 Spain</span>
                  <span className="bracket-score">{matches[4].awayScore !== undefined ? matches[4].awayScore : '–'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Match Score Modal */}
      {selectedMatch && (
        <div className="modal-overlay">
          <form onSubmit={handleSaveScore} className="modal-card" style={{ maxWidth: '360px' }}>
            <div className="modal-header">
              <h3>Update Match Score</h3>
              <button type="button" onClick={() => setSelectedMatch(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '28px', display: 'block' }}>{selectedMatch.homeFlag}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{selectedMatch.homeTeam}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    style={{ width: '50px', height: '40px', fontSize: '18px', textAlign: 'center', borderRadius: '6px', border: '1px solid var(--divider)' }}
                  />
                  <span style={{ color: 'var(--muted)' }}>:</span>
                  <input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    style={{ width: '50px', height: '40px', fontSize: '18px', textAlign: 'center', borderRadius: '6px', border: '1px solid var(--divider)' }}
                  />
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '28px', display: 'block' }}>{selectedMatch.awayFlag}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{selectedMatch.awayTeam}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setSelectedMatch(null)} className="btn btn-sm">Cancel</button>
              <button type="submit" className="btn btn-sm btn-primary">Save Score</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
