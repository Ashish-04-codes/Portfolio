import React from 'react';
import { Page } from '../../types';
import { SITE_CONFIG } from '../../constants';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

/**
 * Main footer component
 */
export const Footer: React.FC<FooterProps> = React.memo(({ onNavigate }) => {
  return (
    <footer className="relative z-10 border-t-2 border-ink py-12 bg-newsprint mt-auto transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-masthead text-4xl">{SITE_CONFIG.title}</h2>
        <div
          className="flex gap-6 font-mono text-xs uppercase tracking-widest mt-4"
          role="navigation"
          aria-label="Social media links"
        >
          <a
            href={SITE_CONFIG.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label="GitHub profile (opens in new tab)"
          >
            GitHub
          </a>
          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label="LinkedIn profile (opens in new tab)"
          >
            LinkedIn
          </a>
          <a
            href={SITE_CONFIG.social.twitter}
            target="_blank"
            rel="noreferrer"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label="Twitter/X profile (opens in new tab)"
          >
            Twitter/X
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label="Send an email"
          >
            Email
          </a>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 mt-8">
          {SITE_CONFIG.copyright}
        </p>
      </div>
    </footer>
  );
});
