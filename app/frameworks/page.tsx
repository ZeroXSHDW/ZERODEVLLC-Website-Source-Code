import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Frameworks and standards // ZeroDev LLC',
  description: 'A practical standards and control-family library for cyber risk, testing, resilience, supply-chain, and readiness conversations.',
  alternates: { canonical: 'https://zerodevllc.com/frameworks' },
  openGraph: {
    title: 'Frameworks and standards // ZeroDev LLC',
    description: 'A practical standards and control-family library for cyber risk, testing, resilience, supply-chain, and readiness conversations.',
    url: 'https://zerodevllc.com/frameworks',
    type: 'website',
  },
};

const frameworks = [
  ['NIST CSF 2.0', 'Organize cybersecurity outcomes across Govern, Identify, Protect, Detect, Respond, and Recover.', 'Use it as an outcome and communication layer; it is not itself a certification.'],
  ['NIST SP 800-115', 'Structure technical security testing, planning, execution, analysis, and reporting.', 'Apply it to an agreed testing scope and rules of engagement.'],
  ['NIST SP 800-30', 'Support threat, vulnerability, likelihood, impact, and risk-assessment reasoning.', 'Risk scores require organizational context and evidence quality.'],
  ['NIST SP 800-34', 'Frame contingency planning, recovery priorities, alternate operations, and testing.', 'A plan is not proof of recovery until it is exercised and evidenced.'],
  ['NIST SP 800-53', 'Map security and privacy control families to systems, owners, and evidence.', 'Control presence must be verified in the relevant system and scope.'],
  ['NIST SP 800-61', 'Structure incident-response preparation, handling, coordination, and lessons learned.', 'Incident readiness depends on people, authority, communications, and practice.'],
  ['NIST SP 800-161', 'Assess cyber-supply-chain risk across products, services, dependencies, and suppliers.', 'Vendor questionnaires alone are not sufficient evidence of supplier security.'],
  ['NIST SP 800-171 Rev. 3 / 800-171A Rev. 3', 'Discuss protection and assessment of controlled unclassified information in applicable nonfederal systems.', 'Applicability, contract language, assessment method, and evidence expectations must be confirmed for each engagement.'],
  ['NCSC Cyber Assessment Framework 4.0', 'Frame outcome-based cyber resilience assessment for essential functions, critical infrastructure, and public-sector contexts.', 'CAF alignment is a scoped assessment conversation; it is not an NCSC endorsement, regulatory decision, or certification.'],
  ['CIS Controls', 'Translate common defensive priorities into a practical control improvement sequence.', 'Control adoption should be tied to asset context, ownership, and evidence.'],
  ['OWASP testing guidance', 'Support web, API, and application-security testing conversations and verification.', 'Testing remains authorized, bounded, and appropriate to the application and environment.'],
  ['ISO/IEC 27001 family', 'Support information-security management, control, risk, and evidence discussions.', 'Readiness support does not create certification or an auditor’s opinion.'],
  ['ISO 22301 / ISO 31000', 'Frame continuity, risk, impact, decision, and improvement conversations.', 'Business continuity and risk management must reflect the organization’s actual objectives.'],
] as const;

const procurementRules = [
  'Confirm the jurisdiction, contract, data category, system boundary, and responsible authority.',
  'Map the requirement to evidence, owner, implementation state, and review date.',
  'Record what the control or framework does not prove.',
  'Separate technical readiness from certification, accreditation, legal advice, or procurement approval.',
];

export default function FrameworksPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#frameworks-content">Skip to frameworks content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="ZeroDev LLC home">
          <span className={styles.brandMark}>Z/</span>
          <span>ZERODEVLLC<span className={styles.brandDim}>.COM</span></span>
        </Link>
        <nav className={styles.headerNav} aria-label="Framework navigation">
          <Link href="/services">Services</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/engage">Engage</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>

      <div className={styles.layout} id="frameworks-content">
        <section className={styles.hero} aria-labelledby="frameworks-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> FRAMEWORKS / EVIDENCE MAP</p>
            <h1 id="frameworks-heading">Map the rule.<br /><span>Prove the control.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Frameworks help teams agree on outcomes, controls, evidence, and priorities. They do not replace scope, ownership, judgment, legal review, or testing.</p>
            <p className={styles.heroBoundary}><strong>Applicability is assessed.</strong> The right framework depends on jurisdiction, contract, data, service, system boundary, and organizational objective.</p>
          </div>
        </section>

        <section className={styles.frameworkSection} aria-labelledby="library-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// STANDARDS LIBRARY'}</p>
            <h2 id="library-heading">A useful map.<br /><span>Not a badge wall.</span></h2>
            <p>Use this library to frame a conversation, identify evidence, and choose a proportionate next action. Confirm the current authoritative text before relying on a requirement.</p>
          </div>
          <div className={styles.frameworkGrid}>
            {frameworks.map(([name, purpose, boundary]) => (
              <article className={styles.frameworkCard} key={name}>
                <span className={styles.frameworkTag}>REFERENCE / READINESS</span>
                <h3>{name}</h3>
                <p>{purpose}</p>
                <p className={styles.cardBoundary}><strong>Boundary:</strong> {boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="procurement-heading">
          <div>
            <p className={styles.eyebrow}>{'// PROCUREMENT / GOVERNANCE'}</p>
            <h2 id="procurement-heading">Make the<br /><span>scope explicit.</span></h2>
            <p className={styles.bodyCopy}>Government and defense-supplier work is strongest when the requirement, evidence, authority, and decision owner are visible before technical activity begins.</p>
          </div>
          <div className={styles.checkList}>
            {procurementRules.map((rule, index) => <div key={rule}><span>{String(index + 1).padStart(2, '0')}</span><p>{rule}</p></div>)}
          </div>
        </section>

        <section className={styles.noticeSection} aria-labelledby="claims-heading">
          <p className={styles.eyebrow}>{'// CLAIMS CONTROL'}</p>
          <h2 id="claims-heading">Readiness support is not<br /><span>certification or clearance.</span></h2>
          <p>ZeroDev can help structure evidence, identify gaps, plan remediation, and prepare questions for an appropriate assessor, auditor, legal adviser, procurement owner, or authority. The site does not claim certification, accreditation, government approval, security clearance, or formal compliance without exact evidence.</p>
        </section>

        <section className={styles.cta} aria-labelledby="frameworks-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="frameworks-cta-heading">Choose the<br /><span>decision to support.</span></h2></div>
          <div><p>Start with the requirement, the system, or the risk decision. Do not send secrets or sensitive evidence through ordinary email.</p><Link className={styles.primaryLink} href="/services">Review services <span aria-hidden="true">↗</span></Link></div>
        </section>
      </div>
    </main>
  );
}
