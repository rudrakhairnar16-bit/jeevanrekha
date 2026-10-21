'use client';

import { useEffect, useState } from 'react';

const VIDEO_URL = 'https://drive.google.com/file/d/1hZtytfPcHI_JkimQCdirmtKLVQxWqRNa/view?usp=sharing';

export function JudgesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const search = window.location.search;
    const isCleanDemo = search.includes('clean=1') || search.includes('autoplay=1');
    const isDismissed = localStorage.getItem('jr_judges_modal_dismissed') === '1';

    // Auto-open on home and walkthrough if not previously dismissed and not in automated clean demo
    if (!isDismissed && !isCleanDemo && path !== '/prototype') {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!mounted) return null;

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('jr_judges_modal_dismissed', '1');
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Pill when modal is closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open note for judges and pitch video"
          className="jury-floating-pill"
        >
          <span className="jury-pill-icon">⚖️</span>
          <span className="jury-pill-text">Jury Note &amp; Pitch Video</span>
          <span className="jury-pill-dot" />
        </button>
      )}

      {/* Modal Backdrop and Card */}
      {isOpen && (
        <div 
          className="jury-modal-backdrop" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="jury-modal-title"
        >
          <div className="jury-modal-container">
            <div className="jury-modal-header">
              <div className="jury-modal-badge">
                <span>📢 NOTE TO EVALUATORS &amp; JURY</span>
              </div>
              <button 
                type="button" 
                onClick={handleDismiss} 
                className="jury-modal-close" 
                aria-label="Close note"
              >
                ✕
              </button>
            </div>

            <h2 id="jury-modal-title" className="jury-modal-title">
              Explore the Complete Prototype Before Final Assessment
            </h2>

            <div className="jury-modal-body">
              <p className="jury-modal-quote">
                &ldquo;Dear Jury Members, as a solo developer, I built <strong>JeevanRekha</strong> to solve a critical, life-saving challenge: <em>instant emergency healthcare data access without sacrificing patient privacy</em>.
              </p>
              <p className="jury-modal-text">
                Every single flow—from <strong>Tier 0 bystander QR vitals</strong> to <strong>authenticated paramedic triage</strong>, <strong>break-glass hospital overrides</strong>, and <strong>cryptographic emergency lockers</strong>—has been purposefully engineered for real-world impact.
              </p>
              <p className="jury-modal-text">
                I humbly invite you to test, interact, and evaluate the complete ecosystem before reaching your final decision.&rdquo;
              </p>
              <span className="jury-modal-sign">— Rudra Khairnar &middot; Solo Creator, JeevanRekha</span>
            </div>

            <div className="jury-modal-actions">
              <a
                href={VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="jury-btn-primary"
              >
                🎬 Watch Pitch Video (Drive) ↗
              </a>
              <a
                href="/prototype"
                onClick={handleDismiss}
                className="jury-btn-secondary"
              >
                🧪 Interactive Prototype →
              </a>
              <a
                href="/demo"
                onClick={handleDismiss}
                className="jury-btn-tertiary"
              >
                ⏱️ 2-Min Demo
              </a>
            </div>

            <div className="jury-modal-footer">
              <button 
                type="button" 
                onClick={handleDismiss} 
                className="jury-btn-dismiss"
              >
                Got it, let me explore →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
