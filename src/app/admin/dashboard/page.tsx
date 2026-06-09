'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function AdminDashboardOverview() {
  const { matches, users, predictions, payments, stats, updateMatch } = useApp();

  // Sort match list by live first, then upcoming, then finished
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    if (a.status === 'upcoming' && b.status === 'finished') return -1;
    return 0;
  }).slice(0, 5);

  const topUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

  // SVG Chart Config
  const chartData = [2300, 3100, 4200, 3800, 5100, 4700, 4900];
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...chartData);
  const minVal = Math.min(...chartData);
  const height = 120;
  const width = 320;
  const padding = 15;

  const points = chartData.map((val, index) => {
    const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1);
    const y = height - padding - ((val - minVal * 0.8) / (maxVal - minVal * 0.8)) * (height - 2 * padding);
    return { x, y };
  });

  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="content-body">
      
      {/* KPI Stats Row (Section 2) */}
      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-label"><i className="ti ti-users"></i> Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-delta"><span className="up">↑ 12%</span> this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><i className="ti ti-chart-arrows"></i> Total Predictions</div>
          <div className="stat-value">{stats.totalPredictions}</div>
          <div className="stat-delta"><span className="up">↑ 34%</span> today</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><i className="ti ti-coin"></i> Revenue (€)</div>
          <div className="stat-value">€{stats.revenue.toFixed(2)}</div>
          <div className="stat-delta"><span className="up">↑ 8%</span> this tournament</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(220, 38, 38, 0.3)' }}>
          <div className="stat-label" style={{ color: 'var(--red)' }}>
            <span className="pulse-dot" style={{ marginRight: '6px' }}></span> Live Now
          </div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{stats.liveMatches}</div>
          <div className="stat-delta">Active matches</div>
        </div>
      </section>

      {/* Main Layout Grid (Section 3 and 5 Left, Section 6 Right) */}
      <div className="three-col">
        
        {/* Left Column: Match management table & Top Users */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Match Management Preview (Section 3) */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Match Management Overview</h3>
              <Link href="/admin/matches" className="btn btn-sm btn-primary">
                Manage Matches
              </Link>
            </div>

            <div className="table-responsive" style={{ marginTop: '12px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMatches.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="team-vs">
                          <span>{m.homeFlag} {m.homeTeam}</span>
                          <span className="vs-divider">vs</span>
                          <span>{m.awayFlag} {m.awayTeam}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{m.stage}</td>
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
                            FT
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Users Leaderboard (Section 5) */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Top Users — Predictions Leaderboard</h3>
              <Link href="/admin/leaderboard" className="btn btn-sm">
                View All
              </Link>
            </div>

            <div className="table-responsive" style={{ marginTop: '12px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Points</th>
                    <th>Predictions</th>
                    <th>Exact</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((u, i) => (
                    <tr key={u.id}>
                      <td className="rank-col">0{i + 1}</td>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-sm" style={{ background: i === 0 ? '#e53935' : i === 1 ? '#8e24aa' : '#00897b' }}>
                            {u.initials}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td><strong>{u.points}</strong></td>
                      <td>{u.totalPredictions}</td>
                      <td>{u.exactScores}</td>
                      <td>
                        <span className={`badge badge-${u.tier.toLowerCase()}`}>
                          {u.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Widgets & Analytics Line Chart (Section 6) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Prediction Accuracy Chart Widget */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Prediction Activity</h3>
            </div>
            
            {/* SVG line graph */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
                {/* Area under curve */}
                <path d={areaD} fill="rgba(0, 87, 184, 0.08)" />
                {/* Line path */}
                <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots on line */}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" stroke="#fff" strokeWidth="1" />
                ))}
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', padding: '0 8px' }}>
              {chartLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>

            <div style={{ borderTop: '0.5px solid var(--divider)', margin: '14px 0 8px' }}></div>
            
            <div className="progress-row">
              <div className="progress-label" style={{ fontSize: '11px' }}>Exact Score</div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: '38%', background: 'var(--primary)' }}></div></div>
              <div className="progress-val">38%</div>
            </div>
            <div className="progress-row">
              <div className="progress-label" style={{ fontSize: '11px' }}>Correct Winner</div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: '54%', background: 'var(--primary-dark)' }}></div></div>
              <div className="progress-val">54%</div>
            </div>
          </div>

          {/* Revenue Snapshot Widget */}
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '12px' }}>Revenue Snapshot</h3>
            <div className="inline-stat">
              <span className="inline-stat-label">Total Entries</span>
              <span className="inline-stat-value">{stats.totalUsers}</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-label">Entry Fee</span>
              <span className="inline-stat-value">€1.00</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-label">Total Raised</span>
              <span className="inline-stat-value" style={{ color: 'var(--green)' }}>€{stats.revenue.toFixed(2)}</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-label">Prize Pool (est.)</span>
              <span className="inline-stat-value" style={{ color: 'var(--primary)' }}>€{(stats.revenue * 0.8).toFixed(2)}</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-label">Platform Fee</span>
              <span className="inline-stat-value">€{(stats.revenue * 0.2).toFixed(2)}</span>
            </div>
          </div>

          {/* Recent Activity Widget */}
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '12px' }}>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon green"><i className="ti ti-coin"></i></div>
                <div className="activity-text">
                  Sophie Laurent paid entry fee for Germany vs Spain
                  <div className="activity-time">2 min ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon blue"><i className="ti ti-chart-arrows"></i></div>
                <div className="activity-text">
                  Carlos Mendez submitted prediction: Brazil 2–1 Argentina
                  <div className="activity-time">5 min ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon amber"><i className="ti ti-ball-football"></i></div>
                <div className="activity-text">
                  Match score updated: Spain 3 – 2 Germany (FT)
                  <div className="activity-time">18 min ago</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
