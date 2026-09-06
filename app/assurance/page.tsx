import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Assurance and trust boundaries // ZeroDev LLC',
  description: 'A procurement-facing assurance map for authorized defensive cybersecurity, evidence handling, risk decisions, and operational resilience.',
  alternates: { canonical: 'https://zerodevllc.com/assurance' },
  openGraph: {
    title: 'Assurance and trust boundaries // ZeroDev LLC',
    description: 'How ZeroDev frames authority, evidence, information handling, claims, and owner decisions for defensive cyber work.',
    url: 'https://zerodevllc.com/assurance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assurance and trust boundaries // ZeroDev LLC',
    description: 'How ZeroDev frames authority, evidence, information handling, claims, and owner decisions for defensive cyber work.',
    images: ['/og.png'],
  },
};

const pillars = [
  ['01', 'Authority and scope', 'Every technical activity starts with a named decision owner, written authority, agreed scope, safety contact, and stop condition.', ['Written authorization', 'In-scope assets and exclusions', 'Rules of engagement and escalation'], 'No authority means no testing. A discovery conversation is not permission to access or assess a system.'],
  ['02', 'Evidence discipline', 'Reports keep source, date, method, confidence, limitations, and interpretation visible so a decision-maker can challenge the conclusion.', ['Observed versus verified', 'Evidence quality and recency', 'Open questions and limitations'], 'A report is bounded evidence about an agreed objective, not a permanent security guarantee.'],
  ['03', 'Data minimization', 'Use the least sensitive information needed to qualify the work, and establish an owner-approved exchange path before sensitive material is required.', ['High-level first brief', 'Redacted or synthetic examples', 'Purpose and retention boundary'], 'Do not place credentials, private keys, customer records, live target details, or restricted material in public channels.'],
  ['04', 'Decision ownership', 'ZeroDev can structure evidence, options, and treatment paths; the organization retains its legal, commercial, operational, and residual-risk decisions.', ['Named accountable owner', 'Treatment or acceptance authority', 'Review trigger and next action'], 'Due diligence surfaces decision risk. It is not a supplier verdict, legal opinion, or procurement approval.'],
  ['05', 'Framework boundaries', 'Standards and control families help establish applicability, evidence, and readiness questions without being presented as badges or automatic outcomes.', ['Jurisdiction and contract', 'Applicable requirement', 'Control owner and evidence state'], 'Readiness support is not certification, accreditation, clearance, or a regulator or auditor decision.'],
  ['06', 'Release boundaries', 'A local build, preview, or hosted response can be reviewed as evidence of a candidate surface but does not by itself prove production approval or public acceptance.', ['Source and revision identity', 'Provider and deployment owner', 'Acceptance and rollback evidence'], 'The .com candidate, .eu gateway, and .store catalogue remain separate routes with separate owner and provider decisions.'],
] as const;

const handlingRows = [
  ['Safe public starting point', 'High-level objective, sector, decision date, service question, intended audience, and the person who can confirm authority.', 'Use the safe engagement brief. No sensitive evidence is needed to begin qualification.'],
  ['Controlled exchange', 'Redacted architecture, asset context, supplier evidence, contract or framework details, or exercise material after the recipient and purpose are agreed.', 'Confirm the handling owner, permitted channel, minimum necessary data, and retention boundary first.'],
  ['Never through this site or ordinary email', 'Passwords, API keys, private keys, customer records, live target details, private incident evidence, classified or restricted material, and exploit payloads.', 'Do not send it. Establish an owner-approved exchange and handling process before any transfer.'],
] as const;

const procurementQuestions = [
  'Who owns the decision, and who can confirm written authority for the relevant activity?',
  'What service, system, supplier, information category, or recovery scenario is actually in scope?',
  'Which jurisdiction, contract, framework, policy, or authority determines applicability?',
  'What evidence is available, how current is it, and what verification method is permitted?',
  'Which question needs testing or exercising, and which question only needs review or evidence mapping?',
  'What treatment, acceptance, retest, escalation, or review decision follows the work?',
] as const;

const reviewPath = [
  ['01', 'Frame the question', 'Start with the decision, mission or service boundary, accountable owner, audience, and timing—without sending sensitive evidence.', '/engage', 'Prepare a safe first brief'],
  ['02', 'Select the engagement', 'Map the question to authorized penetration testing, vulnerability assessment, due diligence, risk, compliance, recovery, or incident-readiness work.', '/services', 'Review security services'],
  ['03', 'Review the evidence', 'Agree the output shape, evidence state, limitations, audience, and decision the work must support before the handoff.', '/deliverables', 'Review deliverable shapes'],
  ['04', 'Treat and recheck', 'Give findings or gaps an owner, treatment choice, closeout evidence, residual-risk decision, and next review trigger.', '/remediation', 'Review remediation lifecycle'],
] as const;

export default function AssurancePage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#assurance-content">Skip to assurance content</a>
      <SiteHeader
        ariaLabel="Assurance navigation"
        current="/assurance"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="assurance-content">
        <section className={styles.hero} aria-labelledby="assurance-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> ASSURANCE / TRUST BOUNDARIES</p>
            <h1 id="assurance-heading">Make trust<br /><span>inspectable.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Serious security and resilience decisions need more than a capable test. They need visible authority, proportionate evidence, clear limitations, safe handling, and an accountable owner.</p>
            <p className={styles.heroBoundary}><strong>Public assurance map.</strong> This page explains the operating boundaries for a high-level conversation. It is not a certification, accreditation, security clearance, legal opinion, or contract commitment.</p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="pillars-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// ASSURANCE PILLARS'}</p>
            <h2 id="pillars-heading">Trust is a<br /><span>working control.</span></h2>
            <p>These principles make the engagement understandable to security, engineering, executive, procurement, legal, continuity, and risk owners before sensitive work begins.</p>
          </div>
          <div className={styles.outputGrid}>
            {pillars.map(([number, title, description, fields, boundary]) => (
              <article className={styles.outputCard} key={number}>
                <span className={styles.frameworkTag}>{number} / ASSURANCE PILLAR</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul className={styles.fieldList}>{fields.map((field) => <li key={field}>{field}</li>)}</ul>
                <p className={styles.cardBoundary}><strong>Boundary:</strong> {boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="handling-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// INFORMATION HANDLING'}</p>
            <h2 id="handling-heading">Match the<br /><span>channel to the risk.</span></h2>
            <p>Qualification should be possible without sensitive disclosure. If the objective requires restricted evidence, the exchange path is agreed separately with the responsible owner.</p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={styles.actionTable}>
              <caption className={styles.tableCaption}>Illustrative public-to-controlled handling map — not a classification policy.</caption>
              <thead>
                <tr>
                  <th scope="col">Channel stage</th>
                  <th scope="col">Appropriate information</th>
                  <th scope="col">Safe next move</th>
                </tr>
              </thead>
              <tbody>
                {handlingRows.map(([stage, information, nextMove]) => (
                  <tr key={stage}>
                    <td>{stage}</td>
                    <td>{information}</td>
                    <td>{nextMove}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="procurement-heading">
          <div>
            <p className={styles.eyebrow}>{'// PROCUREMENT / GOVERNANCE'}</p>
            <h2 id="procurement-heading">Ask the<br /><span>decision questions.</span></h2>
            <p className={styles.bodyCopy}>A defensible engagement is easier to commission when the authority, evidence question, owner, and expected decision are explicit before technical activity begins.</p>
          </div>
          <div className={styles.checkList}>
            {procurementQuestions.map((question, index) => <div key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></div>)}
          </div>
        </section>

        <section className={styles.frameworkSection} aria-labelledby="review-path-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// PROCUREMENT REVIEW PATH'}</p>
            <h2 id="review-path-heading">One route from<br /><span>question to evidence.</span></h2>
            <p>Use the existing `.com` surfaces as one controlled journey. No sensitive evidence is required to move from the first question to a proportionate next step.</p>
          </div>
          <ol className={styles.frameworkGrid} aria-label="Procurement review stages">
            {reviewPath.map(([number, title, description, href, label]) => (
              <li className={styles.frameworkCard} key={number}>
                <span className={styles.frameworkTag}>{number} / REVIEW STAGE</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <p className={styles.cardBoundary}><strong>Next route:</strong> <Link href={href}>{label} <span aria-hidden="true">↗</span></Link></p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.noticeSection} aria-labelledby="claims-heading">
          <p className={styles.eyebrow}>{'// CLAIMS CONTROL'}</p>
          <h2 id="claims-heading">Useful evidence is not<br /><span>invented authority.</span></h2>
          <p>ZeroDev can help organize a risk question, assess an agreed technical boundary, review supplier or control evidence, prepare a readiness path, and turn findings into owned treatment options. The final legal, commercial, operational, procurement, certification, accreditation, clearance, and residual-risk decisions remain with the responsible organization and any required independent authority.</p>
          <p>Relevant sector language does not establish a government appointment, defense contract, security clearance, regulator relationship, certification, client relationship, or formal approval. Such claims require exact, current, owner-approved evidence.</p>
        </section>

        <section className={styles.cta} aria-labelledby="assurance-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="assurance-cta-heading">Bring the<br /><span>evidence question.</span></h2></div>
          <div>
            <p>Start with the decision, service or mission boundary, accountable owner, and desired evidence. Keep secrets and restricted material out of ordinary email.</p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare the safe first brief <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/deliverables">Review deliverable shapes <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/frameworks">Review framework references <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
