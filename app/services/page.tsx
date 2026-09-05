import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Services // ZeroDev LLC',
  description: 'Authorized defensive cybersecurity, cyber-risk, due-diligence, compliance-readiness, and resilience engagement areas for ZeroDev LLC.',
  alternates: { canonical: 'https://zerodevllc.com/services' },
  openGraph: {
    title: 'Services // ZeroDev LLC',
    description: 'Authorized defensive cybersecurity, cyber-risk, due-diligence, compliance-readiness, and resilience engagement areas.',
    url: 'https://zerodevllc.com/services',
    type: 'website',
  },
};

const services = [
  {
    number: '01',
    title: 'Authorized penetration testing',
    summary: 'Test agreed attack surfaces under written authority, bounded rules of engagement, and safety controls.',
    activities: ['External and internal surfaces', 'Web, API, cloud, identity, and segmentation review', 'Remediation validation and retesting'],
    output: 'Scope, evidence, findings, risk context, and a remediation path.',
    tone: 'cyan',
  },
  {
    number: '02',
    title: 'Vulnerability assessment',
    summary: 'Turn scanner output and technical observations into a prioritized, evidence-backed risk view.',
    activities: ['Asset and exposure context', 'Manual verification where appropriate', 'Severity, exploitability, and business-impact analysis'],
    output: 'Validated findings register with owners, priorities, and next checks.',
    tone: 'amber',
  },
  {
    number: '03',
    title: 'Cyber risk management',
    summary: 'Connect assets, threats, controls, decisions, exceptions, and residual risk in one usable operating view.',
    activities: ['Risk identification and treatment planning', 'Control ownership and evidence mapping', 'Executive and board-ready reporting'],
    output: 'A decision-ready risk register and measurable treatment roadmap.',
    tone: 'green',
  },
  {
    number: '04',
    title: 'Technical due diligence',
    summary: 'Assess architecture, delivery practices, dependencies, resilience, and technical risk before an important decision.',
    activities: ['Architecture and control review', 'Secure development and supply-chain review', 'Open questions, assumptions, and red flags'],
    output: 'Technical brief, evidence requests, risk summary, and decision support.',
    tone: 'violet',
  },
  {
    number: '05',
    title: 'Vendor due diligence',
    summary: 'Evaluate whether a supplier’s security, continuity, access, incident, and evidence posture fits the relationship.',
    activities: ['Questionnaire and evidence review', 'Data-flow, subprocessor, and access analysis', 'Concentration, exit, and fourth-party risk'],
    output: 'A proportionate supplier-risk view with open evidence gaps.',
    tone: 'cyan',
  },
  {
    number: '06',
    title: 'Compliance readiness',
    summary: 'Map applicable requirements to current evidence, owners, gaps, and an implementation sequence.',
    activities: ['Framework and control-family mapping', 'Evidence preparation and gap analysis', 'Exception and remediation tracking'],
    output: 'Readiness plan—not a certification, accreditation, or legal opinion.',
    tone: 'amber',
  },
  {
    number: '07',
    title: 'Disaster recovery and BCP',
    summary: 'Make critical services, dependencies, recovery priorities, and continuity assumptions testable.',
    activities: ['Business impact and dependency mapping', 'RTO/RPO and recovery strategy review', 'Restore testing, tabletop exercises, and lessons learned'],
    output: 'A practical resilience roadmap tied to tested recovery outcomes.',
    tone: 'green',
  },
  {
    number: '08',
    title: 'Incident readiness',
    summary: 'Prepare people, decisions, evidence, communications, and technical response paths before pressure arrives.',
    activities: ['Roles, escalation, and evidence boundaries', 'Tabletop and purple-team exercise design', 'Post-exercise actions and control improvements'],
    output: 'An exercise record, lessons learned, and owned improvement backlog.',
    tone: 'red',
  },
] as const;

const lifecycle = [
  ['01', 'Qualify', 'Clarify the decision, the environment, the stakeholders, and what success must prove.'],
  ['02', 'Authorize', 'Confirm ownership, written authority, scope, timing, contacts, and rules of engagement.'],
  ['03', 'Assess', 'Collect only the evidence required for the agreed objective and preserve its context.'],
  ['04', 'Explain', 'Separate observations, validated findings, assumptions, limitations, and business impact.'],
  ['05', 'Act', 'Turn findings into owners, priorities, treatment choices, and a realistic sequence of work.'],
  ['06', 'Recheck', 'Retest, exercise, or review the changed control and record what remains unresolved.'],
] as const;

const fitContexts = [
  ['Public-sector procurement', 'When a technical decision also needs visible authority, evidence handling, ownership, limitations, and a report that procurement and risk teams can use.'],
  ['Defense-supplier assurance', 'When prime, subcontractor, or fourth-party relationships make controlled information, dependency, resilience, and exit questions part of the decision.'],
  ['Essential-service resilience', 'When a critical or public-facing service must understand continuity priorities, recovery assumptions, incident decisions, and exercise evidence.'],
  ['Regulated technology risk', 'When an architecture, product, or provider needs a proportionate view of controls, supply-chain exposure, readiness gaps, and residual risk.'],
] as const;

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#services-content">Skip to services content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="ZeroDev LLC home">
          <span className={styles.brandMark}>Z/</span>
          <span>ZERODEVLLC<span className={styles.brandDim}>.COM</span></span>
        </Link>
        <nav className={styles.headerNav} aria-label="Services navigation">
          <Link href="/methodology">Methodology</Link>
          <Link href="/frameworks">Frameworks</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>

      <div className={styles.layout} id="services-content">
        <section className={styles.hero} aria-labelledby="services-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> SERVICES / DEFENSIVE CYBER OPERATIONS</p>
            <h1 id="services-heading">Make risk<br /><span>worth acting on.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>ZeroDev helps organizations turn technical evidence into safer decisions, stronger controls, and more recoverable operations.</p>
            <p className={styles.heroBoundary}><strong>Authorized work only.</strong> Every assessment begins with scope, authority, safety boundaries, and an agreed evidence path.</p>
            <a className={styles.primaryLink} href="mailto:hello@zerodevllc.com?subject=Authorized%20cyber%20assessment%20conversation">Start an authorized conversation <span aria-hidden="true">↗</span></a>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>

        <section className={styles.serviceSection} aria-labelledby="engagements-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// ENGAGEMENT AREAS'}</p>
            <h2 id="engagements-heading">One operating model.<br /><span>Eight decision surfaces.</span></h2>
            <p>Choose the surface that matches the decision in front of you. The final scope, method, evidence, and deliverables are agreed before work begins.</p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <article className={`${styles.serviceCard} ${styles[`tone${service.tone}`]}`} key={service.number}>
                <div className={styles.cardTopline}><span>{service.number} / 08</span><span>ENGAGEMENT AREA</span></div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul>{service.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
                <p className={styles.output}><strong>Typical output:</strong> {service.output}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="fit-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// GOOD-FIT CONTEXTS'}</p>
            <h2 id="fit-heading">Built for decisions<br /><span>with consequences.</span></h2>
            <p>This is an audience map, not a client list. Qualification confirms whether the objective, authority, evidence, and operating context are appropriate before any engagement is accepted.</p>
          </div>
          <div className={styles.outputGrid}>
            {fitContexts.map(([title, description], index) => (
              <article className={styles.outputCard} key={title}>
                <span className={styles.frameworkTag}>{String(index + 1).padStart(2, '0')} / FIT CONTEXT</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.lifecycleSection} aria-labelledby="lifecycle-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// CONTROLLED ENGAGEMENT'}</p>
            <h2 id="lifecycle-heading">Authority before<br /><span>activity.</span></h2>
            <p>The work is designed to be understandable to technical teams, executives, procurement, legal, and risk owners—not only to the person running the assessment.</p>
            <Link className={styles.primaryLink} href="/methodology">Read the full methodology <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.lifecycleGrid}>
            {lifecycle.map(([number, title, description]) => (
              <article className={styles.lifecycleCard} key={number}>
                <span>{number}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.boundarySection} aria-labelledby="boundary-heading">
          <div>
            <p className={styles.eyebrow}>{'// CLAIMS / EVIDENCE / LIMITS'}</p>
            <h2 id="boundary-heading">Credibility is<br /><span>part of the deliverable.</span></h2>
          </div>
          <div className={styles.boundaryBox}>
            <p><strong>Readiness is not certification.</strong> Framework mapping, gap analysis, and audit preparation do not by themselves create a certification, accreditation, clearance, authorization, or legal opinion.</p>
            <p><strong>Testing is not permission.</strong> No system is tested without written authority, defined scope, safety contacts, and agreed rules of engagement.</p>
            <p><strong>Evidence is not a guarantee.</strong> Reports explain what was observed, what was validated, what was not tested, and what remains uncertain.</p>
            <p><strong>Due diligence is not a verdict.</strong> Supplier and technical reviews surface evidence gaps and decision risk; the client owns the final commercial, legal, and operational decision.</p>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="services-cta-heading">
          <div>
            <p className={styles.eyebrow}>{'// NEXT MOVE'}</p>
            <h2 id="services-cta-heading">Bring the<br /><span>hard edge case.</span></h2>
          </div>
          <div>
            <p>Start with a high-level objective. Do not send credentials, secrets, customer records, payment details, or private incident evidence through ordinary email.</p>
            <Link className={styles.primaryLink} href="/engage">Prepare the engagement brief <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
