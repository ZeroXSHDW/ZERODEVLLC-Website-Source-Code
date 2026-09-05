import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Sector fit and decision paths // ZeroDev LLC',
  description: 'Decision paths for public-sector, defense-supplier, essential-service, and regulated-technology cybersecurity and resilience work.',
  alternates: { canonical: 'https://zerodevllc.com/sectors' },
  openGraph: {
    title: 'Sector fit and decision paths // ZeroDev LLC',
    description: 'Map a government, defense-supplier, essential-service, or regulated-technology question to the right evidence and engagement path.',
    url: 'https://zerodevllc.com/sectors',
    type: 'website',
  },
};

const sectors = [
  ['01', 'Public-sector and government programs', 'When procurement, public accountability, authority, and evidence handling are part of the technical decision.', ['Scope and decision-owner clarity', 'Control and readiness evidence', 'Supplier and dependency risk', 'Executive and procurement-ready reporting'], 'This is a fit context, not a claim of government clients, contracts, or approval.'],
  ['02', 'Defense suppliers and primes', 'When a prime, subcontractor, or technology provider must make security, resilience, controlled-information, and fourth-party questions visible.', ['Technical and vendor due diligence', 'Supply-chain and exit-risk review', 'Authorized testing boundaries', 'Remediation and retest evidence'], 'Applicability depends on the contract, information category, system boundary, and responsible authority.'],
  ['03', 'Essential services and critical functions', 'When disruption could affect public safety, mission delivery, or a function that must remain available and recoverable.', ['Critical-service and dependency mapping', 'Incident and continuity readiness', 'Recovery assumptions and exercises', 'Residual risk and next validation'], 'A plan, framework, or exercise does not itself prove operational resilience or regulatory compliance.'],
  ['04', 'Regulated technology and SaaS', 'When an architecture, product, or provider needs a proportionate view of controls, supply-chain exposure, and evidence gaps.', ['Architecture and control review', 'Vendor and subprocessor analysis', 'Framework applicability', 'Decision-ready risk and treatment options'], 'The applicable law, contract, assessor, auditor, regulator, and legal interpretation remain outside a generic site claim.'],
] as const;

const decisionQuestions = [
  'What service, mission, function, or decision must remain available?',
  'What evidence must technical, executive, procurement, legal, or risk owners be able to use?',
  'Who can confirm ownership, written authority, scope, and evidence handling?',
  'Which failure, supplier, incident, or recovery scenario needs to be understood or exercised?',
  'Which jurisdiction, contract, data category, framework, or authority determines applicability?',
] as const;

export default function SectorsPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#sectors-content">Skip to sector fit content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="ZeroDev LLC home">
          <span className={styles.brandMark}>Z/</span>
          <span>ZERODEVLLC<span className={styles.brandDim}>.COM</span></span>
        </Link>
        <nav className={styles.headerNav} aria-label="Sector fit navigation">
          <Link href="/services">Services</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/frameworks">Frameworks</Link>
          <Link href="/engage">Engage</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>

      <div className={styles.layout} id="sectors-content">
        <section className={styles.hero} aria-labelledby="sectors-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> SECTOR FIT / DECISION PATHS</p>
            <h1 id="sectors-heading">Fit the mission.<br /><span>Prove the boundary.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Different operating contexts ask different questions of the same technical evidence. Use this map to start with the decision, not a vague “military-grade” claim.</p>
            <p className={styles.heroBoundary}><strong>Audience map only.</strong> ZeroDev does not claim government appointment, defense contracts, security clearance, regulatory designation, client relationships, or formal approval from this page.</p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="sector-cards-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// DECISION CONTEXTS'}</p>
            <h2 id="sector-cards-heading">Start where<br /><span>the consequence lives.</span></h2>
            <p>These are qualification contexts. The final scope, authority, evidence, method, deliverable, and applicability decision are established for the specific organization and engagement.</p>
          </div>
          <div className={styles.outputGrid}>
            {sectors.map(([number, title, description, priorities, boundary]) => (
              <article className={styles.outputCard} key={number}>
                <span className={styles.frameworkTag}>{number} / FIT CONTEXT / NOT CLIENT EVIDENCE</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul className={styles.fieldList}>{priorities.map((priority) => <li key={priority}>{priority}</li>)}</ul>
                <p className={styles.cardBoundary}><strong>Boundary:</strong> {boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="questions-heading">
          <div>
            <p className={styles.eyebrow}>{'// QUALIFICATION QUESTIONS'}</p>
            <h2 id="questions-heading">Make the<br /><span>question precise.</span></h2>
            <p className={styles.bodyCopy}>A responsible engagement begins by identifying the service or mission at stake, the owner who can authorize the work, and the evidence a decision-maker actually needs.</p>
          </div>
          <div className={styles.checkList}>
            {decisionQuestions.map((question, index) => <div key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></div>)}
          </div>
        </section>

        <section className={styles.noticeSection} aria-labelledby="claims-heading">
          <p className={styles.eyebrow}>{'// CLAIMS CONTROL'}</p>
          <h2 id="claims-heading">Context is not<br /><span>credential.</span></h2>
          <p>Being relevant to a sector does not establish a government relationship, security clearance, contract award, regulatory appointment, certification, accreditation, or formal assessor status. Those claims require exact, current, owner-approved evidence and may require an independent authority.</p>
          <p>Review the <Link href="/services">service catalogue</Link>, <Link href="/frameworks">framework map</Link>, and <Link href="/deliverables">representative deliverables</Link> before starting a high-level conversation.</p>
        </section>

        <section className={styles.cta} aria-labelledby="sectors-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="sectors-cta-heading">Bring the<br /><span>real decision.</span></h2></div>
          <div><p>Send the service or mission context, the decision owner, the intended audience, and the question you need evidence to answer. Do not send sensitive evidence through ordinary email.</p><p><Link className={styles.primaryLink} href="/engage">Prepare the first brief <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/services">Review services <span aria-hidden="true">↗</span></Link></p></div>
        </section>
      </div>
    </main>
  );
}
