import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
import RouteIndex from '../route-index';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Methodology // ZeroDev LLC',
  description: 'A controlled, evidence-led methodology for authorized defensive cybersecurity and resilience engagements.',
  alternates: { canonical: 'https://zerodevllc.com/methodology' },
  openGraph: {
    title: 'Methodology // ZeroDev LLC',
    description: 'A controlled, evidence-led methodology for authorized defensive cybersecurity and resilience engagements.',
    url: 'https://zerodevllc.com/methodology',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Methodology // ZeroDev LLC',
    description: 'A controlled, evidence-led methodology for authorized defensive cybersecurity and resilience engagements.',
    images: ['/og.png'],
  },
};

const steps = [
  ['01', 'Qualify the objective', 'Define the decision, critical services, stakeholders, operating context, and the question the engagement must answer.'],
  ['02', 'Confirm authority and scope', 'Record ownership, written authorization, in-scope assets, exclusions, timing, contacts, and stop conditions.'],
  ['03', 'Set the rules of engagement', 'Agree test methods, safety limits, rate boundaries, evidence handling, communications, and escalation before activity.'],
  ['04', 'Collect bounded evidence', 'Use the least data necessary for the objective. Preserve source, timestamp, context, and uncertainty with the observation.'],
  ['05', 'Validate and interpret', 'Separate scanner output, analyst observation, confirmed finding, business impact, exploitability, and residual uncertainty.'],
  ['06', 'Report for decisions', 'Deliver technical detail, executive meaning, owners, priority, remediation options, assumptions, and limitations.'],
  ['07', 'Treat and retest', 'Track remediation, retest changed controls, exercise recovery where relevant, and record what remains open.'],
  ['08', 'Close the loop', 'Leave a reviewable evidence trail, lessons learned, next review date, and an explicit statement of what the work does not prove.'],
] as const;

const controls = [
  'Written authorization and named decision owner',
  'Defined scope, exclusions, timing, and stop conditions',
  'Emergency contacts and escalation path',
  'Data minimization and evidence-handling boundary',
  'Clear distinction between observation and validated finding',
  'Technical and executive reporting paths',
  'Remediation ownership and retest criteria',
  'Explicit limitations, assumptions, and residual risk',
];

const rulesOfEngagement = [
  ['Authority instrument', 'Owner, permission or contract reference, objective, named approver, and change authority.', 'The authority is missing, unclear, expired, or does not cover the proposed activity.'],
  ['Target boundary', 'Assets, accounts, environments, dependencies, exclusions, source date, and ownership.', 'A target is outside the agreed boundary, unowned, or materially different from the approved scope.'],
  ['Permitted methods', 'Test categories, validation depth, credential use, and whether social, physical, or other special activity is explicitly approved.', 'A method is not explicitly approved, or the activity would be destructive, unsafe, or outside the defensive objective.'],
  ['Timing and safety', 'Test window, rate or volume limits, availability constraints, maintenance conflicts, safety contact, and stop conditions.', 'There is instability, unexpected impact, a safety signal, or no reachable safety contact.'],
  ['Data and evidence', 'Minimum necessary data, redaction, storage and transfer channel, retention boundary, and evidence owner.', 'Sensitive, restricted, or unrelated data appears and the approved handling path is not confirmed.'],
  ['Communications and escalation', 'Routine reporting, emergency route, incident distinction, and named decision points.', 'A live incident, material impact, or uncertainty requires an owner decision or approved escalation.'],
  ['Closeout and cleanup', 'End time, access removal, temporary-change reversal, artifact handling, validation, limitations, and retest condition.', 'Access, temporary change, artifact, or unresolved effect cannot be reconciled at closeout.'],
  ['Change control', 'How scope, timing, methods, contacts, and exceptions are approved and recorded.', 'A material change is requested without the authority owner’s approval and an updated record.'],
] as const;

const riskFactors = [
  'Mission consequence — effect on a critical service, safety objective, obligation, or decision',
  'Exposure — reachability, dependency, affected population, and operating conditions',
  'Exploitability — effort, access, capability, prerequisites, and plausible attack path',
  'Control strength — prevention, detection, response, recovery, and compensating measures',
  'Evidence confidence — source quality, recency, verification method, and unresolved uncertainty',
  'Urgency — change window, threat context, contractual date, or decision that makes timing material',
] as const;

export default function MethodologyPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#methodology-content">Skip to methodology content</a>
      <SiteHeader
        ariaLabel="Methodology navigation"
        current="/methodology"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="methodology-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="methodology-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> METHODOLOGY / CONTROLLED ENGAGEMENT</p>
            <h1 id="methodology-heading">Authority<br /><span>before activity.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>A strong assessment is not only technically capable. It is authorized, bounded, explainable, evidence-aware, and useful to the people who must decide what happens next.</p>
            <p className={styles.heroBoundary}><strong>Defensive scope.</strong> ZeroDev does not perform unauthorized access, indiscriminate scanning, credential theft, persistence, evasion, malware delivery, or destructive activity.</p>
          </div>
        </section>

        <RouteIndex ariaLabel="Methodology page sections" pageIndexClassName={styles.pageIndex} pageIndexLabelClassName={styles.pageIndexLabel} sections={[
          { href: '#engagement-lifecycle', number: '01', label: 'Lifecycle' },
          { href: '#control-baseline', number: '02', label: 'Control baseline' },
          { href: '#rules-of-engagement', number: '03', label: 'Rules of engagement' },
          { href: '#risk-interpretation', number: '04', label: 'Risk interpretation' },
          { href: '#evidence-outputs', number: '05', label: 'Evidence outputs' },
        ]} />

        <section className={`${styles.methodSection} ${styles.routeSection}`} id="engagement-lifecycle" aria-labelledby="steps-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// ENGAGEMENT LIFECYCLE'}</p>
            <h2 id="steps-heading">From question<br /><span>to evidence.</span></h2>
            <p>The lifecycle applies across penetration testing, risk reviews, due diligence, compliance readiness, resilience planning, and incident exercises.</p>
          </div>
          <div className={styles.stepList}>
            {steps.map(([number, title, description]) => (
              <article className={styles.step} id={`methodology-step-${number}`} key={number}>
                <span className={styles.stepNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="control-baseline" aria-labelledby="controls-heading">
          <div>
            <p className={styles.eyebrow}>{'// CONTROL BASELINE'}</p>
            <h2 id="controls-heading">The boundary<br /><span>is the method.</span></h2>
            <p className={styles.bodyCopy}>These controls are not decorative language. They are the minimum questions to resolve before an engagement is treated as ready to begin.</p>
          </div>
          <div className={styles.checkList}>
            {controls.map((control, index) => <div key={control}><span>{String(index + 1).padStart(2, '0')}</span><p>{control}</p></div>)}
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="rules-of-engagement" aria-labelledby="rules-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// RULES OF ENGAGEMENT STARTER'}</p>
            <h2 id="rules-heading">Write the guardrails.<br /><span>Then test.</span></h2>
            <p>This synthetic starter shows the control questions to resolve before an authorized assessment, validation activity, or exercise. It keeps the technical method subordinate to authority, safety, evidence handling, and owner decisions.</p>
            <p className={styles.templateNote}><strong>Public boundary.</strong> The public starter is not an authorization, a target list, a test plan, or permission to access any system. The applicable contract, owner, security contact, and approved handling process control the real engagement.</p>
            <p><Link className={styles.primaryLink} href="/engage#brief-template">Prepare the high-level brief <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.actionTableWrap} tabIndex={0} role="region" aria-label="Rules of engagement starter table">
            <table className={`${styles.actionTable} ${styles.roeMap}`}>
              <caption className={styles.tableCaption}>Synthetic rules-of-engagement starter — control questions only; not a live authorization or operational test instruction.</caption>
              <thead>
                <tr>
                  <th scope="col">Control area</th>
                  <th scope="col">Record before activity</th>
                  <th scope="col">Pause or escalate when</th>
                </tr>
              </thead>
              <tbody>
                {rulesOfEngagement.map(([control, record, trigger], index) => (
                  <tr key={control}>
                    <td><span className={styles.tableNumber}>{String(index + 1).padStart(2, '0')}</span>{control}</td>
                    <td>{record}</td>
                    <td>{trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="risk-interpretation" aria-labelledby="risk-heading">
          <div>
            <p className={styles.eyebrow}>{'// RISK INTERPRETATION'}</p>
            <h2 id="risk-heading">Risk is<br /><span>contextual.</span></h2>
            <p className={styles.bodyCopy}>A finding becomes useful when its consequence, exposure, exploitability, control strength, evidence confidence, and urgency are visible to the people who own the decision.</p>
            <p className={styles.bodyCopy}>Potential treatment choices include remediate, mitigate, transfer, avoid, accept with a named owner and time boundary, or monitor and retest. A rating supports prioritization; it does not replace contract, legal, safety, classification, or owner judgment.</p>
          </div>
          <div className={styles.checkList}>
            {riskFactors.map((factor, index) => <div key={factor}><span>{String(index + 1).padStart(2, '0')}</span><p>{factor}</p></div>)}
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="evidence-outputs" aria-labelledby="outputs-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// EVIDENCE OUTPUTS'}</p>
            <h2 id="outputs-heading">Make the result<br /><span>usable.</span></h2>
            <p>Before an output becomes a public capability or trust statement, compare its evidence state, owner, and limitations against the <Link className={styles.primaryLink} href="/assurance#claims-proof">claims-to-proof matrix <span aria-hidden="true">→</span></Link>.</p>
            <p><Link className={styles.primaryLink} href="/deliverables">See representative deliverable shapes <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.outputGrid}>
            <article className={styles.outputCard}><h3>Executive view</h3><p>Decision, risk, owner, treatment choices, residual risk, and the next review date.</p></article>
            <article className={styles.outputCard}><h3>Technical view</h3><p>Scope, evidence, observation-versus-finding distinction, severity, limitations, and remediation detail.</p></article>
            <article className={styles.outputCard}><h3>Assurance view</h3><p>Requirement, control, owner, evidence, gap, exception, status, and the next review or test date.</p></article>
            <article className={styles.outputCard}><h3>Resilience view</h3><p>Critical service, dependencies, RTO/RPO assumptions, exercise result, recovery gap, and next validation.</p></article>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="methodology-cta-heading">
          <div><p className={styles.eyebrow}>{'// CONTINUE'}</p><h2 id="methodology-cta-heading">Choose the<br /><span>right surface.</span></h2></div>
          <div><p>Review the service areas, standards library, or remediation lifecycle before starting a conversation.</p><p><Link className={styles.primaryLink} href="/services">View services <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/frameworks">View frameworks <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/remediation">View remediation lifecycle <span aria-hidden="true">→</span></Link></p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
