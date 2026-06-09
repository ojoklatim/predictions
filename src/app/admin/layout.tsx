'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if user is not Admin removed for public direct access

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'ti ti-layout-dashboard', section: 'Overview' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'ti ti-chart-bar', section: 'Overview' },
    
    { name: 'Matches', path: '/admin/matches', icon: 'ti ti-ball-football', section: 'Competition' },
    { name: 'Predictions', path: '/admin/predictions', icon: 'ti ti-chart-arrows', section: 'Competition' },
    { name: 'Leaderboard', path: '/admin/leaderboard', icon: 'ti ti-trophy', section: 'Competition' },
    { name: 'Bracket', path: '/admin/bracket', icon: 'ti ti-tournament', section: 'Competition' },
    
    { name: 'All Users', path: '/admin/users', icon: 'ti ti-users', section: 'Users' },
    { name: 'Payments', path: '/admin/payments', icon: 'ti ti-coin', section: 'Users' },
    
    { name: 'Configuration', path: '/admin/settings', icon: 'ti ti-settings', section: 'Settings' }
  ];

  // Group items by section
  const sections = ['Overview', 'Competition', 'Users', 'Settings'];

  const getPageTitle = () => {
    const active = navItems.find(item => pathname.startsWith(item.path));
    return active ? active.name : 'Admin Dashboard';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pred_user');
    router.push('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="trophy">🏆</span>
            <div>
              <div className="app-name">Prediction System</div>
              <div className="version">Admin Panel · v1.0</div>
            </div>
          </Link>
        </div>

        <nav className="nav">
          {sections.map(secName => (
            <div key={secName}>
              <div className="nav-section">{secName}</div>
              {navItems
                .filter(item => item.section === secName)
                .map(item => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className={item.icon}></i>
                      {item.name}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-pill">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <div className="admin-name">Admin</div>
              <div className="admin-role">Super Admin</div>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <i className="ti ti-logout" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm"
              style={{ display: 'none' }}
              id="admin-sidebar-toggle"
            >
              <i className="ti ti-menu-2"></i>
            </button>
            <h2 className="topbar-title">{getPageTitle()}</h2>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <i className="ti ti-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            
            {/* Quick Action button */}
            {pathname.includes('matches') ? (
              <button onClick={() => { window.dispatchEvent(new CustomEvent('open-new-match')); }} className="btn btn-primary btn-sm">
                <i className="ti ti-plus"></i> Add Match
              </button>
            ) : pathname.includes('users') ? (
              <button onClick={() => alert('Invite user modal link')} className="btn btn-primary btn-sm">
                <i className="ti ti-user-plus"></i> Invite User
              </button>
            ) : (
              <Link href="/admin/matches" className="btn btn-primary btn-sm">
                <i className="ti ti-plus"></i> Add Match
              </Link>
            )}
          </div>
        </header>

        {/* Dynamic page content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          #admin-sidebar-toggle {
            display: inline-flex !important;
          }
          .admin-layout {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: fixed;
            left: -220px;
            transition: left 0.2s ease-in-out;
            box-shadow: 5px 0 15px rgba(0,0,0,0.1);
          }
          .sidebar.mobile-open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
