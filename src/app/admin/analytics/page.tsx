'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AnalyticsPage() {
  const { users, matches, predictions } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Custom mock analytics data matching Section 10
  const summary = {
    avgPredictionsPerUser: (predictions.length / users.length).toFixed(1),
    accuracyRate: '38%',
    mostPredictedMatch: 'Brazil vs Argentina',
    peakHour: '19:00 - 20:00'
  };

  const topAccurateUsers = [...users]
    .sort((a, b) => {
      const aAcc = a.totalPredictions > 0 ? (a.exactScores / a.totalPredictions) : 0;
      const bAcc = b.totalPredictions > 0 ? (b.exactScores / b.totalPredictions) : 0;
      return bAcc - aAcc;
    })
    .slice(0, 5);

  // SVG Chart Dimensions
  const w = 450;
  const h = 140;
  const padding = 20;

  // Chart 1 data (User growth)
  const growthData = [120, 240, 480, 890, 1450, 2100, 3847];
  const maxGrowth = Math.max(...growthData);
  const minGrowth = Math.min(...growthData);
  const growthPoints = growthData.map((val, idx) => {
    const x = padding + (idx * (w - 2 * padding)) / (growthData.length - 1);
    const y = h - padding - ((val - minGrowth * 0.5) / (maxGrowth - minGrowth * 0.5)) * (h - 2 * padding);
    return { x, y };
  });
  const growthPath = `M ${growthPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const growthArea = `${growthPath} L ${growthPoints[growthPoints.length - 1].x} ${h - padding} L ${growthPoints[0].x} ${h - padding} Z`;

  // Chart 2 data (Revenue area chart)
  const revData = [120, 240, 360, 410, 520, 1300, 3847];
  const maxRev = Math.max(...revData);
  const minRev = Math.min(...revData);
  const revPoints = revData.map((val, idx) => {
    const x = padding + (idx * (w - 2 * padding)) / (revData.length - 1);
    const y = h - padding - ((val - minRev * 0.5) / (maxRev - minRev * 0.5)) * (h - 2 * padding);
    return { x, y };
  });
  const revPath = `M ${revPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const revArea = `${revPath} L ${revPoints[revPoints.length - 1].x} ${h - padding} L ${revPoints[0].x} ${h - padding} Z`;

  return (
    <div className="content-body">
      
      {/* Analytics controls */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="section-title">Platform Performance &amp; Metrics</h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['7d', '30d', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setDateRange(tab)}
                className={`tab ${dateRange === tab ? 'active' : ''}`}
                style={{ padding: '4px 12px', textTransform: 'uppercase' }}
              >
                {tab === '7d' ? 'Last 7 Days' : tab === '30d' ? 'Last 30 Days' : 'This Tournament'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="two-col">
        
        {/* User Growth Line Chart */}
        <div className="card">
          <h4 className="section-title" style={{ marginBottom: '10px' }}>User Growth Trend</h4>
          <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
            {/* Grid lines */}
            <line x1={padding} y1={h/2} x2={w-padding} y2={h/2} stroke="var(--divider)" strokeWidth="0.5" strokeDasharray="3 3" />
            {/* Area */}
            <path d={growthArea} fill="rgba(0, 87, 184, 0.08)" />
            {/* Path line */}
            <path d={growthPath} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            {/* Dots */}
            {growthPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--primary)" stroke="#fff" strokeWidth="1" />
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '8px', padding: '0 8px' }}>
            <span>03 Jun</span>
            <span>05 Jun</span>
            <span>07 Jun</span>
            <span>09 Jun</span>
          </div>
        </div>

        {/* Revenue Area Chart */}
        <div className="card">
          <h4 className="section-title" style={{ marginBottom: '10px' }}>Cumulative Revenue (€)</h4>
          <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
            <line x1={padding} y1={h/2} x2={w-padding} y2={h/2} stroke="var(--divider)" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d={revArea} fill="rgba(22, 163, 74, 0.08)" />
            <path d={revPath} fill="none" stroke="var(--green)" strokeWidth="2.5" />
            {revPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--green)" stroke="#fff" strokeWidth="1" />
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '8px', padding: '0 8px' }}>
            <span>03 Jun</span>
            <span>05 Jun</span>
            <span>07 Jun</span>
            <span>09 Jun</span>
          </div>
        </div>

      </div>

      {/* KPI Stats Grid */}
      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Avg Predictions per User</div>
          <div className="stat-value">{summary.avgPredictionsPerUser}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Accuracy Rate</div>
          <div className="stat-value">{summary.accuracyRate}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Most Predicted Match</div>
          <div className="stat-value" style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>
            {summary.mostPredictedMatch}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Peak Activity Hour</div>
          <div className="stat-value">{summary.peakHour}</div>
        </div>
      </section>

      {/* Accuracy Leaderboard */}
      <div className="card">
        <h4 className="section-title" style={{ marginBottom: '12px' }}>Leaderboard Accuracy Rating</h4>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player User</th>
                <th>Accuracy (%)</th>
                <th>Exact scorelines</th>
                <th>Predictions Made</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {topAccurateUsers.map((u, i) => {
                const total = u.totalPredictions;
                const acc = total > 0 ? ((u.exactScores / total) * 100).toFixed(0) : '0';
                return (
                  <tr key={u.id}>
                    <td className="rank-col">0{i + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-sm" style={{ background: i === 0 ? '#e53935' : '#475569' }}>{u.initials}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="participants-bar">
                        <div className="mini-bar-bg" style={{ width: '60px' }}>
                          <div className="mini-bar-fill" style={{ width: `${acc}%`, background: 'var(--primary)' }}></div>
                        </div>
                        <strong>{acc}%</strong>
                      </div>
                    </td>
                    <td>{u.exactScores}</td>
                    <td>{u.totalPredictions}</td>
                    <td><strong>{u.points}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
