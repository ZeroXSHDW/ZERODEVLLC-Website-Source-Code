import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../site-header';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy boundary // ZeroDev LLC',
  description: 'How the public ZeroDev LLC website handles visitor interactions and external public sources.',
  alternates: { canonical: 'https://zerodevllc.com/privacy' },
  openGraph: {
    title: 'Privacy boundary // ZeroDev LLC',
    description: 'How the public ZeroDev LLC website handles visitor interactions and external public sources.',
    url: 'https://zerodevllc.com/privacy',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy boundary // ZeroDev LLC',
    description: 'How the public ZeroDev LLC website handles visitor interactions and external public sources.',
    images: ['/og.png'],
  },
};

const boundaries = [
  ['01', 'Public and read-only', 'This site does not provide visitor accounts, checkout, uploads, private dashboards, or a customer-data export workflow.'],
  ['02', 'Source-linked signals', 'The homepage requests a bounded set of public CISA publications and displays source-linked records. These indicators are not private telemetry or confirmation of an incident against ZeroDev.'],
  ['03', 'Email is external', 'Contact and reporting links open your email client. Anything you choose to send is handled by your email provider and the receiving mailbox, not by a form on this site.'],
  ['04', 'Provider operations', 'The hosting and network providers may process ordinary technical information such as requests, security events, and service logs under their own terms. This page does not override those provider policies.'],
];

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#privacy-content">Skip to privacy content</a>
      <SiteHeader
        ariaLabel="Privacy navigation"
        current="/privacy"
        navigation={[
          { href: '/services', label: 'Services' },
          { href: '/methodology', label: 'Methodology' },
          { href: '/frameworks', label: 'Frameworks' },
          { href: '/engage', label: 'Engage' },
          { href: '/privacy', label: 'Privacy' },
        ]}
      />

      <div className={styles.layout} id="privacy-content">
        <section className={styles.intro} aria-labelledby="privacy-heading">
          <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> PRIVACY / PUBLIC SURFACE</p>
          <h1 id="privacy-heading">Keep the<br /><span>signal clean.</span></h1>
          <p className={styles.lede}>This page describes the narrow privacy boundary of the public ZeroDev LLC index. It is a plain-language operating note for this read-only surface, not a substitute for provider terms or legal advice.</p>
          <p className={styles.reviewed}>LAST REVIEWED / 2026-09-05</p>
        </section>

        <div className={styles.content}>
          {boundaries.map(([number, title, description]) => (
            <section className={styles.boundary} key={number} aria-labelledby={`privacy-${number}`}>
              <span className={styles.number}>{number}</span>
              <div>
                <h2 id={`privacy-${number}`}>{title}</h2>
                <p>{description}</p>
              </div>
            </section>
          ))}

          <section className={styles.notice} aria-labelledby="privacy-minimization">
            <p className={styles.eyebrow}>{'// MINIMIZE THE HANDOFF'}</p>
            <h2 id="privacy-minimization">Do not send secrets.</h2>
            <p>Do not send credentials, tokens, customer records, payment details, or private incident evidence through ordinary email. For a suspected vulnerability, use <a href="mailto:hello@zerodevllc.com?subject=Private%20security%20report">hello@zerodevllc.com</a> and include only the affected revision, reproduction, impact, and proposed mitigation.</p>
            <p className={styles.links}><a href="/SECURITY.md">Read the security policy</a><span aria-hidden="true"> / </span><Link href="/">Return to ZeroDev</Link></p>
          </section>
        </div>
      </div>
    </main>
  );
}
