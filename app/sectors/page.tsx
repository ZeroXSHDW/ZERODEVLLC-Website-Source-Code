import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
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
  twitter: {
    card: 'summary_large_image',
    title: 'Sector fit and decision paths // ZeroDev LLC',
    description: 'Map a government, defense-supplier, essential-service, or regulated-technology question to the right evidence and engagement path.',
    images: ['/og.png'],
  },
};

const sectors = [
  ['01', 'Public-sector and government programs', 'When procurement, public accountability, authority, and evidence handling are part of the technical decision.', ['Scope and decision-owner clarity', 'Control and readiness evidence', 'Supplier and dependency risk', 'Executive and procurement-ready reporting'], 'This is a fit context, not a claim of government clients, contracts, or approval.', 'Decision date, accountable owner, service boundary, applicable contract or framework, and the evidence question.', [['03', 'Cyber risk management'], ['05', 'Vendor due diligence'], ['06', 'Compliance readiness']], [['01', 'Executive risk brief'], ['04', 'Control-readiness map'], ['03', 'Supplier-risk matrix']], [['01', 'Qualify the objective'], ['02', 'Confirm authority and scope'], ['06', 'Report for decisions']]],
  ['02', 'Defense suppliers and primes', 'When a prime, subcontractor, or technology provider must make security, resilience, controlled-information, and fourth-party questions visible.', ['Technical and vendor due diligence', 'Supply-chain and exit-risk review', 'Authorized testing boundaries', 'Remediation and retest evidence'], 'Applicability depends on the contract, information category, system boundary, and responsible authority.', 'Role in the supply chain, system or information boundary, decision owner, contract context, and dependency or exit question.', [['01', 'Authorized penetration testing'], ['04', 'Technical due diligence'], ['05', 'Vendor due diligence'], ['07', 'Disaster recovery and BCP']], [['02', 'Technical findings register'], ['03', 'Supplier-risk matrix'], ['06', 'Retest and closeout note']], [['02', 'Confirm authority and scope'], ['03', 'Set the rules of engagement'], ['07', 'Treat and retest']]],
  ['03', 'Essential services and critical functions', 'When disruption could affect public safety, mission delivery, or a function that must remain available and recoverable.', ['Critical-service and dependency mapping', 'Incident and continuity readiness', 'Recovery assumptions and exercises', 'Residual risk and next validation'], 'A plan, framework, or exercise does not itself prove operational resilience or regulatory compliance.', 'Critical service, disruption scenario, dependency owner, recovery assumption, decision date, and exercise question.', [['03', 'Cyber risk management'], ['07', 'Disaster recovery and BCP'], ['08', 'Incident readiness']], [['05', 'Resilience exercise record'], ['01', 'Executive risk brief'], ['06', 'Retest and closeout note']], [['01', 'Qualify the objective'], ['04', 'Collect bounded evidence'], ['08', 'Close the loop']]],
  ['04', 'Regulated technology and SaaS', 'When an architecture, product, or provider needs a proportionate view of controls, supply-chain exposure, and evidence gaps.', ['Architecture and control review', 'Vendor and subprocessor analysis', 'Framework applicability', 'Decision-ready risk and treatment options'], 'The applicable law, contract, assessor, auditor, regulator, and legal interpretation remain outside a generic site claim.', 'Product or provider boundary, data category, applicable jurisdiction or framework, decision owner, and evidence gap.', [['04', 'Technical due diligence'], ['05', 'Vendor due diligence'], ['06', 'Compliance readiness']], [['02', 'Technical findings register'], ['03', 'Supplier-risk matrix'], ['04', 'Control-readiness map']], [['04', 'Collect bounded evidence'], ['05', 'Validate and interpret'], ['06', 'Report for decisions']]],
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
      <SiteHeader
        ariaLabel="Sector fit navigation"
        current="/sectors"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="sectors-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="sectors-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> SECTOR FIT / DECISION PATHS</p>
            <h1 id="sectors-heading">Fit the mission.<br /><span>Prove the boundary.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Different operating contexts ask different questions of the same technical evidence. Use this map to start with the decision, not a vague “military-grade” claim.</p>
            <p className={styles.heroBoundary}><strong>Audience map only.</strong> ZeroDev does not claim government appointment, defense contracts, security clearance, regulatory designation, client relationships, or formal approval from this page.</p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">→</span></Link></p>
          </div>
        </section>

        <nav className={styles.pageIndex} aria-label="Sector fit page sections">
          <p className={styles.pageIndexLabel}>{'// ROUTE INDEX'}</p>
          <ol>
            <li><a href="#decision-contexts"><span>01</span>Decision contexts</a></li>
            <li><a href="#qualification-questions"><span>02</span>Qualification</a></li>
            <li><a href="#claims-control"><span>03</span>Claims control</a></li>
          </ol>
        </nav>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="decision-contexts" aria-labelledby="sector-cards-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// DECISION CONTEXTS'}</p>
            <h2 id="sector-cards-heading">Start where<br /><span>the consequence lives.</span></h2>
            <p>These are qualification contexts. The final scope, authority, evidence, method, deliverable, and applicability decision are established for the specific organization and engagement.</p>
          </div>
          <div className={styles.outputGrid}>
            {sectors.map(([number, title, description, priorities, boundary, brief, serviceRefs, evidenceRefs, methodRefs]) => (
              <article className={styles.outputCard} key={number}>
                <span className={styles.frameworkTag}>{number} / FIT CONTEXT / NOT CLIENT EVIDENCE</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul className={styles.fieldList}>{priorities.map((priority) => <li key={priority}>{priority}</li>)}</ul>
                <p className={styles.cardBoundary}><strong>First brief should cover:</strong> {brief}</p>
                <p className={styles.cardBoundary}><strong>Boundary:</strong> {boundary}</p>
                <p className={styles.cardBoundary}><strong>Aligned service lanes:</strong>{serviceRefs.map(([serviceNumber, serviceTitle], index) => <span key={serviceNumber}>{index > 0 ? ' / ' : ' '}<Link href={`/services#service-${serviceNumber}`}>{serviceTitle}</Link></span>)}</p>
                <p className={styles.cardBoundary}><strong>Representative evidence path:</strong>{evidenceRefs.map(([deliverableNumber, deliverableTitle], index) => <span key={deliverableNumber}>{index > 0 ? ' / ' : ' '}<Link href={`/deliverables#deliverable-${deliverableNumber}`}>{deliverableTitle}</Link></span>)}</p>
                <p className={styles.cardBoundary}><strong>Controlled method path:</strong>{methodRefs.map(([stepNumber, stepTitle], index) => <span key={stepNumber}>{index > 0 ? ' / ' : ' '}<Link href={`/methodology#methodology-step-${stepNumber}`}>{stepTitle}</Link></span>)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="qualification-questions" aria-labelledby="questions-heading">
          <div>
            <p className={styles.eyebrow}>{'// QUALIFICATION QUESTIONS'}</p>
            <h2 id="questions-heading">Make the<br /><span>question precise.</span></h2>
            <p className={styles.bodyCopy}>A responsible engagement begins by identifying the service or mission at stake, the owner who can authorize the work, and the evidence a decision-maker actually needs.</p>
          </div>
          <div className={styles.checkList}>
            {decisionQuestions.map((question, index) => <div key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></div>)}
          </div>
        </section>

        <section className={`${styles.noticeSection} ${styles.routeSection}`} id="claims-control" aria-labelledby="claims-heading">
          <p className={styles.eyebrow}>{'// CLAIMS CONTROL'}</p>
          <h2 id="claims-heading">Context is not<br /><span>credential.</span></h2>
          <p>Being relevant to a sector does not establish a government relationship, security clearance, contract award, regulatory appointment, certification, accreditation, or formal assessor status. Those claims require exact, current, owner-approved evidence and may require an independent authority.</p>
          <p>Review the <Link href="/services">service catalogue</Link>, <Link href="/frameworks">framework map</Link>, and <Link href="/deliverables">representative deliverables</Link> before starting a high-level conversation.</p>
          <p><Link className={styles.primaryLink} href="/assurance#claims-proof">Check the claims-to-proof matrix <span aria-hidden="true">→</span></Link></p>
        </section>

        <section className={styles.cta} aria-labelledby="sectors-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="sectors-cta-heading">Bring the<br /><span>real decision.</span></h2></div>
          <div><p>Send the service or mission context, the decision owner, the intended audience, and the question you need evidence to answer. Do not send sensitive evidence through ordinary email.</p><p><Link className={styles.primaryLink} href="/engage">Prepare the first brief <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/services">Review services <span aria-hidden="true">→</span></Link></p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
