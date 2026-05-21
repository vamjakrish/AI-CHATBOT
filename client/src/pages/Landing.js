import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by Google Gemini 1.5 Flash for instant, intelligent responses.' },
  { icon: '🧠', title: 'Context Aware', desc: 'Maintains full conversation history for coherent, continuous dialogue.' },
  { icon: '🔐', title: 'Secure & Private', desc: 'JWT authentication and MongoDB storage keep your data safe.' },
  { icon: '🎨', title: 'Rich Responses', desc: 'Beautifully rendered markdown with code syntax highlighting.' },
];

export default function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="landing" ref={heroRef}>
      <div className="landing__orb landing__orb--1" />
      <div className="landing__orb landing__orb--2" />
      <div className="landing__orb landing__orb--3" />

      <nav className="landing__nav">
        <div className="landing__logo">
          <span className="landing__logo-icon">✦</span>
          NexusAI
        </div>
        <div className="landing__nav-links">
          <Link to="/login" className="landing__nav-link">Sign In</Link>
          <Link to="/signup" className="landing__nav-cta">Get Started</Link>
        </div>
      </nav>

      <section className="landing__hero">
        <div className="landing__badge">
          <span className="landing__badge-dot" />
          Powered by Google Gemini 1.5
        </div>
        <h1 className="landing__headline">
          The AI assistant<br />
          <span className="landing__headline-accent">that thinks with you</span>
        </h1>
        <p className="landing__sub">
          NexusAI combines cutting-edge language models with a beautifully designed interface,
          giving you a powerful thinking partner for any challenge.
        </p>
        <div className="landing__ctas">
          <Link to="/signup" className="landing__btn-primary">
            Start for free
            <span className="landing__btn-arrow">→</span>
          </Link>
          <Link to="/login" className="landing__btn-secondary">Sign in</Link>
        </div>

        <div className="landing__preview">
          <div className="landing__preview-header">
            <div className="landing__preview-dots">
              <span /><span /><span />
            </div>
            <span className="landing__preview-title">NexusAI Chat</span>
          </div>
          <div className="landing__preview-body">
            <div className="landing__preview-msg landing__preview-msg--user">
              Can you explain how neural networks learn?
            </div>
            <div className="landing__preview-msg landing__preview-msg--ai">
              <span className="landing__preview-ai-tag">✦ NexusAI</span>
              Neural networks learn through a process called <strong>backpropagation</strong>, iteratively adjusting millions of parameters to minimize prediction error. Think of it like tuning a vast orchestra — each instrument (neuron) learns its perfect pitch through continuous feedback...
              <span className="landing__preview-cursor" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing__features">
        <h2 className="landing__features-title">Built for clarity. Built for power.</h2>
        <div className="landing__features-grid">
          {features.map((f, i) => (
            <div key={i} className="landing__feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="landing__feature-icon">{f.icon}</div>
              <h3 className="landing__feature-title">{f.title}</h3>
              <p className="landing__feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing__footer-cta">
        <h2>Ready to think bigger?</h2>
        <p>Join thousands of users exploring the frontiers of AI conversation.</p>
        <Link to="/signup" className="landing__btn-primary">
          Create your account
          <span className="landing__btn-arrow">→</span>
        </Link>
      </section>

      <footer className="landing__footer">
        <p>© 2025 NexusAI. Built with MERN + Gemini.</p>
      </footer>
    </div>
  );
}
