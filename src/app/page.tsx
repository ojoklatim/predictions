'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { matches, users, settings, currentUser, prizes } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Monitor scroll to make header sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Realistic mock live matches for landing page preview
  const liveMatches = matches.filter(m => m.status === 'live').slice(0, 3);
  // Realistic mock top predictors (top 5)
  const topPredictors = [...users]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
    // Track FAQ open event
    console.log('faq_open', { faqIndex: index });
  };

  const handleCtaClick = (buttonName: string) => {
    console.log('cta_click', { button: buttonName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-body">
      {/* CSS-only local additions for animation triggers */}
      <style jsx global>{`
        .landing-body {
          background: #ffffff !important;
          color: #0A0A0A !important;
        }
        .landing-body * {
          border-radius: 0 !important;
        }
        .landing-body .landing-header {
          background: #ffffff !important;
          border-bottom: 1px solid var(--divider) !important;
        }
        .landing-body .landing-header.scrolled {
          box-shadow: 0 2px 10px rgba(0, 87, 184, 0.1) !important;
        }
        .landing-body .landing-nav-link {
          color: #4b5563 !important;
        }
        .landing-body .landing-nav-link:hover {
          color: var(--primary) !important;
        }
        .landing-body .hero-section {
          background: #f8fafc !important;
          color: #0F172A !important;
        }
        .landing-body .hero-subtitle {
          color: #4b5563 !important;
        }
        .landing-body .hero-social-proof {
          color: #4b5563 !important;
        }
        .landing-body .hero-social-proof i {
          color: var(--primary) !important;
        }
        .landing-body .preview-card {
          background: #ffffff !important;
          border: 1px solid var(--primary) !important;
          color: #0F172A !important;
          box-shadow: 0 4px 20px rgba(0, 87, 184, 0.08) !important;
        }
        .landing-body .preview-card * {
          color: #0F172A !important;
        }
        .landing-body .preview-card .badge {
          background: #fee2e2 !important;
          color: #991b1b !important;
        }
        .landing-body .landing-card {
          background: #ffffff !important;
          border: 1px solid var(--divider) !important;
          color: #0F172A !important;
        }
        .landing-body .landing-card h3 {
          color: #0F172A !important;
        }
        .landing-body .landing-card span, .landing-body .landing-card div:not(.score-pill):not(.split-seg) {
          color: #0F172A !important;
        }
        .landing-body .landing-card .score-pill {
          background: var(--primary) !important;
          color: #ffffff !important;
        }
        .landing-body .landing-card .score-pill.none {
          background: var(--divider) !important;
          color: var(--muted) !important;
        }
        .landing-body .landing-card .badge-gold {
          background: #e0f2fe !important;
          color: #0369a1 !important;
        }
        .landing-body .preview-section {
          background: #ffffff !important;
        }
        .landing-body .how-section {
          background: #f8fafc !important;
        }
        .landing-body .prizes-section {
          background: #ffffff !important;
        }
        .landing-body .faq-section {
          background: #f8fafc !important;
        }
        .landing-body footer {
          background: #ffffff !important;
          color: #4b5563 !important;
          border-top: 1px solid var(--divider) !important;
        }
        .landing-body footer h4, .landing-body footer .app-title {
          color: var(--primary) !important;
        }
        .landing-body footer a {
          color: #4b5563 !important;
        }
        .landing-body footer a:hover {
          color: var(--primary) !important;
        }
        .landing-body .btn-landing-primary {
          background: var(--primary) !important;
          color: #ffffff !important;
          border: 1px solid var(--primary) !important;
        }
        .landing-body .btn-landing-primary:hover {
          background: var(--primary-dark) !important;
        }
        .landing-body .btn-landing-ghost {
          border: 1px solid var(--primary) !important;
          color: var(--primary) !important;
        }
        .landing-body .btn-landing-gold {
          background: var(--primary) !important;
          color: #ffffff !important;
          border: 1px solid var(--primary) !important;
        }
        .landing-body .btn-landing-gold:hover {
          background: var(--primary-dark) !important;
        }
        .landing-body .prize-card.gold-glow {
          border-color: var(--primary) !important;
          background: #ffffff !important;
          box-shadow: 0 4px 20px rgba(0, 87, 184, 0.08) !important;
        }
        .landing-body .prize-card.gold-glow h4, .landing-body .prize-card.gold-glow .amount {
          color: var(--primary) !important;
        }
        .landing-body .app-subtitle {
          color: var(--primary) !important;
        }
        .landing-body .hero-title span {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .scroll-animate {
          opacity: 1 !important;
          transform: none !important;
        }
        .fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Navigation Header */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          <Link href="/" className="landing-logo">
            <span style={{ fontSize: '28px' }}>🏆</span>
            <div>
              <div className="app-title">Prediction System</div>
              <div className="app-subtitle">World Cup 2026</div>
            </div>
          </Link>

          <nav className="landing-nav-links">
            <a href="#how-it-works" className="landing-nav-link">How it works</a>
            <a href="#live-preview" className="landing-nav-link">Leaderboard</a>
            <a href="#prizes" className="landing-nav-link">Prizes</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </nav>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn btn-landing-ghost btn-sm" 
            style={{ display: 'none', border: 'none', padding: '4px' }}
            id="mobile-menu-toggle"
          >
            <i className="ti ti-menu-2" style={{ fontSize: '24px' }}></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="scroll-animate fade-in-visible">
            <div className="hero-eyebrow">⚽ WORLD CUP 2026</div>
            <h1 className="hero-title">
              Predict. Compete.<br />
              <span>Win the Cup.</span>
            </h1>
            <p className="hero-subtitle">
              Predict match scores on our mobile app, climb the leaderboard, and win real cash prizes. Download now and join the ultimate fan challenge.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#" className="btn btn-landing-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <i className="ti ti-brand-apple" style={{ fontSize: '24px' }}></i>
                <div>
                  <div style={{ fontSize: '8px', fontWeight: 400, textTransform: 'uppercase', opacity: 0.8, lineHeight: 1 }}>Download on the</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.1 }}>App Store</div>
                </div>
              </a>
              <a href="#" className="btn btn-landing-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <i className="ti ti-brand-google-play" style={{ fontSize: '24px' }}></i>
                <div>
                  <div style={{ fontSize: '8px', fontWeight: 400, textTransform: 'uppercase', opacity: 0.8, lineHeight: 1 }}>Get it on</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.1 }}>Google Play</div>
                </div>
              </a>
            </div>
            <div className="hero-social-proof" style={{ marginTop: '24px' }}>
              <span><i className="ti ti-users"></i> {users.length * 480} players entered</span>
              <span><i className="ti ti-trophy"></i> €{(users.length * 480 * settings.entryFee * 0.8).toFixed(0)} prize pool</span>
              <span><i className="ti ti-chart-arrows"></i> {users.length * 3500} predictions made</span>
            </div>
          </div>

          {/* Floating Match Card Preview */}
          <div className="scroll-animate fade-in-visible animate-float" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="preview-card" style={{ width: '100%', maxWidth: '360px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
                <span>Group A · 67&apos;</span>
                <span className="badge badge-live" style={{ padding: '2px 8px' }}>
                  <span className="pulse-dot"></span> LIVE
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}>🇧🇷</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Brazil</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '8px', color: '#fff', textAlign: 'center', flex: 1 }}>
                  2 – 1
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}>🇦🇷</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Argentina</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0, 87, 184, 0.1)', border: '1px solid rgba(0, 87, 184, 0.25)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.6)' }}>Your prediction:</div>
                  <div style={{ fontWeight: 600, color: 'var(--gold)' }}>2 – 1 ✓ Correct!</div>
                </div>
                <span className="badge badge-gold" style={{ fontSize: '10px' }}>+3 pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section scroll-animate">
        <div className="how-container">
          <div className="section-head-dark">
            <h2>How it works</h2>
            <p>Simple. Fast. Exciting.</p>
          </div>

          <div className="steps-row">
            <div className="steps-connecting-line"></div>
            
            <div className="step-card">
              <div className="step-icon-badge">1</div>
              <h4>Create account</h4>
              <p>Register in seconds. No complicated forms — just your name, email, and you&apos;re in.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-badge gold">2</div>
              <h4>Pay the €{settings.entryFee.toFixed(2)} entry fee</h4>
              <p>A single €{settings.entryFee.toFixed(2)} fee unlocks the full tournament. Card, PayPal, or mobile money accepted.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-badge">3</div>
              <h4>Predict every match</h4>
              <p>Pick the exact scoreline for each match before kickoff. Exact scores earn {settings.exactScorePoints} points, correct results earn {settings.correctResultPoints}.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-badge gold">4</div>
              <h4>Top the leaderboard</h4>
              <p>80% of the prize pool goes directly to the top predictors. The champion takes home the biggest share.</p>
            </div>
          </div>

          <div className="scoring-callout">
            Scoring: Exact score = {settings.exactScorePoints}pts · Correct result = {settings.correctResultPoints}pt · Wrong = {settings.wrongPredictionPoints}pts
          </div>
        </div>
      </section>

      {/* Live Matches & Leaderboard Preview */}
      <section id="live-preview" className="preview-section scroll-animate">
        <div className="how-container">
          <div className="preview-grid">
            
            {/* Live Matches Column */}
            <div className="landing-card">
              <h3>🔴 Live Now</h3>
              {liveMatches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {liveMatches.map((m) => (
                    <div key={m.id} style={{ background: '#f8fafc', border: '1px solid var(--divider)', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
                        <span>{m.stage}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--red)', fontWeight: 600 }}>
                          <span className="pulse-dot"></span> {m.time}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                        <span style={{ fontWeight: 500 }}><span style={{ marginRight: '6px' }}>{m.homeFlag}</span> {m.homeTeam}</span>
                        <span className="score-pill">
                          {m.homeScore} – {m.awayScore}
                        </span>
                        <span style={{ fontWeight: 500 }}><span style={{ marginRight: '6px' }}>{m.awayFlag}</span> {m.awayTeam}</span>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}>
                          <span>{m.homeTeam} win {m.predictionSplit.homeWin}%</span>
                          <span>Draw {m.predictionSplit.draw}%</span>
                          <span>{m.awayTeam} win {m.predictionSplit.awayWin}%</span>
                        </div>
                        <div className="match-bar-split">
                          <div className="split-seg home" style={{ width: `${m.predictionSplit.homeWin}%` }}></div>
                          <div className="split-seg draw" style={{ width: `${m.predictionSplit.draw}%` }}></div>
                          <div className="split-seg away" style={{ width: `${m.predictionSplit.awayWin}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No matches are live right now. Next matches kick off soon!</p>
              )}
              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <span onClick={() => handleCtaClick('live_view_all')} style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  View all matches →
                </span>
              </div>
            </div>

            {/* Leaderboard Preview Column */}
            <div className="landing-card">
              <h3>🏆 Top Predictors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topPredictors.map((u, i) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: i === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.5)', width: '20px' }}>
                      {i === 0 ? '👑' : `0${i + 1}`}
                    </span>
                    <div className="avatar-sm" style={{ background: i === 0 ? '#e53935' : i === 1 ? '#8e24aa' : '#00897b', width: '26px', height: '26px', fontSize: '10px' }}>
                      {u.initials}
                    </div>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                      {u.name}
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: '10px', background: 'rgba(255,215,0,0.1)', color: 'var(--gold)' }}>
                      {u.tier}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px' }}>
                      {u.points} pts
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <span onClick={() => handleCtaClick('leaderboard_view_all')} style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  See full leaderboard →
                </span>
              </div>
            </div>

          </div>

          {/* Bottom CTA Banner */}
          <div style={{ marginTop: '32px', background: 'linear-gradient(135deg, #0057B8 0%, #003F8A 100%)', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Think you can beat the leaderboard?
            </h4>
            <button onClick={() => handleCtaClick('challenge_cta')} className="btn btn-landing-gold" style={{ padding: '10px 24px' }}>
              Join the Challenge
            </button>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="prizes-section scroll-animate">
        <div className="how-container">
          <div className="section-head-dark" style={{ textAlign: 'center' }}>
            <h2>What you can win</h2>
            <p>80% of the total entry pool goes directly to top predictors.</p>
          </div>

          <div className="prizes-grid">
            <div className="prize-card">
              <div className="crown-icon">🥈</div>
              <h4>2nd Place</h4>
              <div className="amount">€{(users.length * 480 * settings.entryFee * 0.8 * 0.2).toFixed(0)}</div>
              <p className="detail">Based on {users.length * 480} players</p>
            </div>

            <div className="prize-card gold-glow">
              <div className="crown-icon">👑</div>
              <h4 style={{ color: 'var(--primary-dark)' }}>1st Place Champion</h4>
              <div className="amount" style={{ fontSize: '42px', color: 'var(--primary-dark)' }}>
                €{(users.length * 480 * settings.entryFee * 0.8 * 0.5).toFixed(0)}
              </div>
              <p className="detail" style={{ fontWeight: 600 }}>Includes Champion Badge</p>
            </div>

            <div className="prize-card">
              <div className="crown-icon">🥉</div>
              <h4>3rd Place</h4>
              <div className="amount">€{(users.length * 480 * settings.entryFee * 0.8 * 0.1).toFixed(0)}</div>
              <p className="detail">Based on {users.length * 480} players</p>
            </div>
          </div>

          <div className="prizes-bar">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
              <span>Prize Distribution Split</span>
              <span>Total Prize Pool: 80% of Entries</span>
            </div>
            <div className="stacked-bar">
              <div className="bar-segment" style={{ width: '50%', background: '#0057B8' }}>1st (50%)</div>
              <div className="bar-segment" style={{ width: '20%', background: '#3b82f6' }}>2nd (20%)</div>
              <div className="bar-segment" style={{ width: '10%', background: '#60a5fa' }}>3rd (10%)</div>
              <div className="bar-segment" style={{ width: '20%', background: '#93c5fd' }}>4th-10th (20%)</div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', marginTop: '10px' }}>
              * Every new entry adds €{(settings.entryFee * 0.8).toFixed(2)} to the prize pool. Play responsibly.
            </p>
          </div>

          {/* Merchandise Custom Prizes Highlight Section */}
          <div style={{ marginTop: '48px', borderTop: '1px solid var(--divider)', paddingTop: '32px' }}>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: 'var(--primary-dark)' }}>
              🎁 Unlock Official Fan Merchandise
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {prizes.map((p) => (
                <div key={p.id} className="prize-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '36px', marginBottom: '8px' }}>{p.icon}</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{p.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', minHeight: '36px', marginBottom: '12px' }}>{p.description}</p>
                  <span className={`badge badge-${p.tierRequired.toLowerCase()}`} style={{ fontSize: '10px' }}>
                    {p.tierRequired} Tier Required
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section Accordions */}
      <section id="faq" className="faq-section scroll-animate">
        <div className="faq-container">
          <div className="section-head-dark" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2>Common questions</h2>
            <p>Everything you need to know about the prediction app.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "When can I submit predictions?",
                a: "Before each match kicks off. Once a match goes live, that prediction locks and cannot be edited. You can still predict future matches at any time."
              },
              {
                q: "How are points calculated?",
                a: "Exact score prediction = 3 points. Correct result prediction (correct winner or draw but wrong scoreline) = 1 point. Wrong prediction = 0 points."
              },
              {
                q: "How do I get paid if I win?",
                a: "We payout rewards via bank transfer, PayPal, or mobile money within 7 days of the tournament final. Winners will be contacted via email."
              },
              {
                q: "Can I enter as a group or syndicate?",
                a: "Each account is individual, but you can share your custom referral link with friends and compete together on the public leaderboard."
              },
              {
                q: "What happens if a match is abandoned or postponed?",
                a: "Predictions for that match will be voided and no points will be awarded or deducted for any player."
              },
              {
                q: "Is this legal in my country?",
                a: "Prediction games are subject to local regulations. Please check your local laws regarding online fan contests before entering."
              }
            ].map((faq, i) => (
              <div key={i} className="faq-item">
                <button onClick={() => toggleFaq(i)} className="faq-trigger">
                  <span>{faq.q}</span>
                  <i className={`ti ti-chevron-${openFaq === i ? 'up' : 'down'}`} style={{ color: 'var(--primary)', fontSize: '16px' }}></i>
                </button>
                {openFaq === i && (
                  <div className="faq-content">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer style={{ background: '#0A0F1C', color: 'rgba(255,255,255,0.6)', padding: '60px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>🏆</span>
              <span style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'var(--font-display)' }}>Prediction System</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
              The ultimate World Cup prediction challenge. Predict scores, win points, and claim your share of the prize pool.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" className="btn btn-landing-ghost btn-sm" style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', padding: 0 }}><i className="ti ti-brand-twitter"></i></a>
              <a href="#" className="btn btn-landing-ghost btn-sm" style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', padding: 0 }}><i className="ti ti-brand-instagram"></i></a>
              <a href="#" className="btn btn-landing-ghost btn-sm" style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', padding: 0 }}><i className="ti ti-brand-discord"></i></a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><a href="#how-it-works" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>How it works</a></li>
              <li><a href="#live-preview" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Leaderboard</a></li>
              <li><a href="#prizes" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Prizes</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Terms &amp; Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Newsletter</h4>
            <p style={{ fontSize: '13px', marginBottom: '12px' }}>Receive match updates and leaderboard alerts.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" placeholder="Email Address" className="auth-input" style={{ padding: '8px 12px', fontSize: '13px' }} />
              <button className="btn btn-landing-primary btn-sm" style={{ padding: '0 16px' }}>Join</button>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px' }}>
          <span>&copy; 2026 Prediction System. All rights reserved.</span>
          <span style={{ fontStyle: 'italic' }}>Play responsibly. For entertainment purposes only.</span>
        </div>
      </footer>

    </div>
  );
}
