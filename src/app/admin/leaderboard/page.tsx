'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function LeaderboardPage() {
  const { users, predictions } = useApp();

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="content-body">
      
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">Official Tournament Leaderboard</h3>
        </div>

        <div className="table-responsive" style={{ marginTop: '12px' }}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Profile</th>
                <th>Leaderboard Points</th>
                <th>Predictions Made</th>
                <th>Exact Scorelines</th>
                <th>Result Winner Only</th>
                <th>Performance Accuracy</th>
                <th>Status Tier</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u, i) => {
                const total = u.totalPredictions;
                const accuracy = total > 0 ? ((u.exactScores * 3 + (total - u.exactScores) * 1) / (total * 3) * 100).toFixed(0) : '0';
                return (
                  <tr key={u.id}>
                    <td className="rank-col" style={{ fontWeight: 700 }}>
                      {i === 0 ? '🏆 01' : i < 9 ? `0${i + 1}` : i + 1}
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-sm" style={{ background: i === 0 ? '#e53935' : i === 1 ? '#8e24aa' : '#00897b' }}>
                          {u.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>{u.points} pts</span></td>
                    <td>{u.totalPredictions}</td>
                    <td>{u.exactScores}</td>
                    <td>{u.totalPredictions - u.exactScores}</td>
                    <td>
                      <div className="participants-bar">
                        <div className="mini-bar-bg" style={{ width: '60px' }}>
                          <div className="mini-bar-fill" style={{ width: `${accuracy}%`, background: 'var(--green)' }}></div>
                        </div>
                        {accuracy}%
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${u.tier.toLowerCase()}`}>
                        {u.tier} Tier
                      </span>
                    </td>
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
