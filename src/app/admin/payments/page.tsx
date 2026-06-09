'use client';

import React, { useState } from 'react';
import { useApp, Payment } from '@/context/AppContext';

export default function PaymentsPage() {
  const { payments, updatePaymentStatus, updateUserStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'Completed' | 'Pending' | 'Flagged' | 'Refunded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<Payment | null>(null);

  const handleClearFlag = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'Completed');
    setSelectedPaymentDetail(null);
    alert('Payment flag cleared and transaction set to Completed.');
  };

  const handleRefund = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'Refunded');
    setSelectedPaymentDetail(null);
    alert('Payment refunded successfully.');
  };

  const handleBan = (userId: string, paymentId: string) => {
    updateUserStatus(userId, 'Suspended');
    updatePaymentStatus(paymentId, 'Refunded');
    setSelectedPaymentDetail(null);
    alert('User suspended and payment refunded successfully.');
  };

  const handleToggleFlag = (p: Payment) => {
    const nextStatus = p.status === 'Flagged' ? 'Completed' : 'Flagged';
    updatePaymentStatus(p.id, nextStatus, nextStatus === 'Flagged' ? 'Manually flagged by administrator' : undefined);
    alert(`Payment status set to: ${nextStatus}`);
  };

  const filteredPayments = payments.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const searchMatch = p.userName.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const flaggedCount = payments.filter(p => p.status === 'Flagged').length;

  return (
    <div className="content-body">
      
      {/* KPI stats cards row */}
      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">€{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div className="stat-label" style={{ color: '#2563eb' }}>Pending Entries</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{pendingCount}</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(220, 38, 38, 0.3)' }}>
          <div className="stat-label" style={{ color: 'var(--red)' }}>Flagged Payments</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{flaggedCount}</div>
        </div>
      </section>

      {/* Main card */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">Transactions &amp; Payments Audit</h3>
          <button onClick={() => alert('Exporting payment details as CSV...')} className="btn btn-sm btn-primary">
            <i className="ti ti-download"></i> Export CSV
          </button>
        </div>

        {/* Filters and search */}
        <div style={{ display: 'flex', gap: '12px', margin: '14px 0 20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="topbar-search" style={{ background: 'var(--surface)' }}>
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Search user name or trans ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'Completed', 'Pending', 'Flagged', 'Refunded'] as const).map(tab => (
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
        </div>

        {/* Payments Table */}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Player User</th>
                <th>Purchased Entry</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm" style={{ background: '#475569' }}>{p.userAvatar}</div>
                      <span>{p.userName}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    {p.matchName ? p.matchName : 'Tournament Entry Ticket'}
                  </td>
                  <td><strong>€{p.amount.toFixed(2)}</strong></td>
                  <td>{p.method}</td>
                  <td>{p.date}</td>
                  <td>
                    <span className={`badge badge-${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => setSelectedPaymentDetail(p)} className="btn btn-sm">
                        View Receipt
                      </button>
                      <button onClick={() => handleToggleFlag(p)} className="btn btn-sm" style={{ color: p.status === 'Flagged' ? 'var(--green)' : 'var(--red)' }}>
                        <i className={`ti ti-${p.status === 'Flagged' ? 'flag-off' : 'flag'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged/Detail Receipt Modal */}
      {selectedPaymentDetail && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Transaction Receipt Breakdown</h3>
              <button onClick={() => setSelectedPaymentDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '0.5px solid var(--divider)' }}>
                <div className="inline-stat">
                  <span className="inline-stat-label">Transaction ID</span>
                  <span className="inline-stat-value"><code>{selectedPaymentDetail.id}</code></span>
                </div>
                <div className="inline-stat">
                  <span className="inline-stat-label">User Profile</span>
                  <span className="inline-stat-value">{selectedPaymentDetail.userName}</span>
                </div>
                <div className="inline-stat">
                  <span className="inline-stat-label">Payment Gateway</span>
                  <span className="inline-stat-value">{selectedPaymentDetail.method}</span>
                </div>
                <div className="inline-stat">
                  <span className="inline-stat-label">Payment IP Address</span>
                  <span className="inline-stat-value"><code>{selectedPaymentDetail.ipAddress || '198.51.100.1'}</code></span>
                </div>
                <div className="inline-stat">
                  <span className="inline-stat-label">Gross Amount Paid</span>
                  <span className="inline-stat-value" style={{ color: 'var(--green)', fontSize: '14px' }}>€{selectedPaymentDetail.amount.toFixed(2)}</span>
                </div>
              </div>

              {selectedPaymentDetail.status === 'Flagged' && (
                <div style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                  <strong>Security Alert Flag Reason:</strong>
                  <p style={{ marginTop: '4px', color: 'var(--red)', fontStyle: 'italic' }}>
                    {selectedPaymentDetail.reasonForFlag}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedPaymentDetail.status === 'Flagged' ? (
                <>
                  <button onClick={() => handleBan(selectedPaymentDetail.userId, selectedPaymentDetail.id)} className="btn btn-sm btn-danger" style={{ marginRight: 'auto' }}>
                    Ban User &amp; Refund
                  </button>
                  <button onClick={() => handleClearFlag(selectedPaymentDetail.id)} className="btn btn-sm btn-primary">
                    Clear Flag
                  </button>
                </>
              ) : (
                <>
                  {selectedPaymentDetail.status !== 'Refunded' && (
                    <button onClick={() => handleRefund(selectedPaymentDetail.id)} className="btn btn-sm btn-danger">
                      Refund Transaction
                    </button>
                  )}
                  <button onClick={() => setSelectedPaymentDetail(null)} className="btn btn-sm btn-primary">
                    Close Receipt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
