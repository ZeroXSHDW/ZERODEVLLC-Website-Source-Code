import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Remediation and closure // ZeroDev LLC',
  description: 'A reviewable remediation lifecycle for findings, control gaps, resilience actions, retesting, and residual-risk decisions.',
  alternates: { canonical: 'https://zerodevllc.com/remediation' },
  openGraph: {
    title: 'Remediation and closure // ZeroDev LLC',
    description: 'Connect findings to owners, treatment, evidence, retesting, and an explicit residual-risk decision.',
    url: 'https://zerodevllc.com/remediation',
    type: 'website',
  },
};

const stages = [
  ['01', 'Record', 'Give the observation, finding, control gap, supplier issue, or recovery action a stable identity, scope, source, and date.'],
  ['02', 'Validate', 'Confirm what was observed, what is in scope, the evidence confidence, the affected service, and the limitations.'],
  ['03', 'Assign', 'Name the accountable owner, decision owner, treatment path, target date, dependency, and escalation route.'],
  ['04', 'Treat', 'Remediate, mitigate, transfer, avoid, or accept with an explicit rationale, authority, time boundary, and residual-risk view.'],
  ['05', 'Verify', 'Review the changed control, evidence, recovery capability, supplier commitment, or test result against the agreed condition.'],
  ['06', 'Close or carry', 'Record the closure evidence, unresolved limitation, accepted residual risk, next review trigger, or retest requirement.'],
] as const;

const fields = [
  'Finding, requirement, control, supplier, or recovery-action identifier',
  'Source, scope, observed date, evidence state, confidence, and limitation',
  'Mission or business consequence, exposure, priority, and treatment choice',
  'Accountable owner, decision owner, due date, dependency, and escalation path',
  'Remediation evidence, retest method, exercise result, or supplier response',
  'Status, residual risk, acceptance authority, closure note, and next review trigger',
] as const;

const statuses = [
  ['Open', 'A question, finding, gap, or action exists and needs a decision.'],
  ['Validated', 'The scope and evidence have been reviewed enough to plan treatment.'],
  ['Treatment planned', 'An owner, action, target date, dependency, and decision path are recorded.'],
  ['In progress or blocked', 'Work is underway or a named dependency prevents progress.'],
  ['Ready for retest', 'The owner says the condition changed and the agreed verification can occur.'],
  ['Closed with evidence or accepted risk', 'The disposition is supported by evidence and authorized residual-risk ownership.'],
] as const;

const actionMatrix = [
  ['External exposure', 'Remediate or mitigate', 'Service owner', 'Hardened configuration plus agreed retest evidence', 'Material change or threat update'],
  ['Supplier assurance gap', 'Mitigate or accept', 'Supplier owner + risk owner', 'Current supplier evidence, contract action, or recorded acceptance', 'Renewal, major change, or new supplier evidence'],
  ['Recovery dependency untested', 'Exercise and validate', 'Continuity or service owner', 'Restore/test result, exercise record, and unresolved gaps', 'Service change or scheduled review'],
  ['Control-readiness gap', 'Plan treatment', 'Control owner', 'Updated control evidence and verification record', 'Requirement, scope, or framework change'],
] as const;

export default function RemediationPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#remediation-content">Skip to remediation content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="ZeroDev LLC home">
          <span className={styles.brandMark}>Z/</span>
          <span>ZERODEVLLC<span className={styles.brandDim}>.COM</span></span>
        </Link>
        <nav className={styles.headerNav} aria-label="Remediation navigation">
          <Link href="/services">Services</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/deliverables">Deliverables</Link>
          <Link href="/engage">Engage</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>

      <div className={styles.layout} id="remediation-content">
        <section className={styles.hero} aria-labelledby="remediation-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> REMEDIATION / ACCOUNTABLE CLOSURE</p>
            <h1 id="remediation-heading">Find the gap.<br /><span>Close the loop.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>A useful finding becomes a managed decision when the owner, treatment, evidence, due date, retest condition, and residual risk are visible together.</p>
            <p className={styles.heroBoundary}><strong>Review model only.</strong> This page describes a remediation pattern. It is not a live client tracker, case system, customer-data store, or proof that an action has been completed.</p>
            <p><Link className={styles.primaryLink} href="/deliverables">Review deliverable shapes <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>

        <section className={styles.methodSection} aria-labelledby="lifecycle-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// REMEDIATION LIFECYCLE'}</p>
            <h2 id="lifecycle-heading">From finding<br /><span>to evidence.</span></h2>
            <p>Use the same lifecycle for a technical finding, supplier gap, control exception, incident-readiness action, or recovery improvement.</p>
          </div>
          <div className={styles.stepList}>
            {stages.map(([number, title, description]) => (
              <article className={styles.step} key={number}>
                <span className={styles.stepNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="fields-heading">
          <div>
            <p className={styles.eyebrow}>{'// ACTION RECORD'}</p>
            <h2 id="fields-heading">No owner.<br /><span>No closure.</span></h2>
            <p className={styles.bodyCopy}>The record should be concise enough to operate and complete enough to audit. A due date without an owner is not accountability; a status without evidence is not closure.</p>
          </div>
          <div className={styles.checkList}>
            {fields.map((field, index) => <div key={field}><span>{String(index + 1).padStart(2, '0')}</span><p>{field}</p></div>)}
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="matrix-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// ILLUSTRATIVE ACTION MATRIX'}</p>
            <h2 id="matrix-heading">Turn risk into<br /><span>the next move.</span></h2>
            <p>Use a decision signal to make treatment, accountability, closure evidence, and the next review trigger explicit.</p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={styles.actionTable}>
              <caption className={styles.tableCaption}>Illustrative action matrix — not client evidence.</caption>
              <thead>
                <tr>
                  <th scope="col">Decision signal</th>
                  <th scope="col">Possible treatment</th>
                  <th scope="col">Accountable owner</th>
                  <th scope="col">Closure evidence</th>
                  <th scope="col">Review trigger</th>
                </tr>
              </thead>
              <tbody>
                {actionMatrix.map(([signal, treatment, owner, evidence, trigger]) => (
                  <tr key={signal}>
                    <td>{signal}</td>
                    <td>{treatment}</td>
                    <td>{owner}</td>
                    <td>{evidence}</td>
                    <td>{trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="status-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// STATUS VOCABULARY'}</p>
            <h2 id="status-heading">State the work<br /><span>without optimism.</span></h2>
            <p>Status labels should describe the current evidence state, not the desired outcome. “Closed” requires an authorized disposition and supporting evidence.</p>
          </div>
          <div className={styles.outputGrid}>
            {statuses.map(([title, description], index) => (
              <article className={styles.outputCard} key={title}>
                <span className={styles.frameworkTag}>{String(index + 1).padStart(2, '0')} / STATUS</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.noticeSection} aria-labelledby="closure-heading">
          <p className={styles.eyebrow}>{'// CLOSURE BOUNDARY'}</p>
          <h2 id="closure-heading">Closed is not<br /><span>the end of risk.</span></h2>
          <p>A control can change while the residual risk remains. A retest can pass while another dependency stays out of scope. A supplier can provide a response without independent verification. Record what changed, what was verified, what remains uncertain, who accepted the residual risk, and when the decision should be revisited.</p>
          <p>Do not place live client records, credentials, private incident material, or confidential government or defense information into this public site or ordinary email.</p>
        </section>

        <section className={styles.cta} aria-labelledby="remediation-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="remediation-cta-heading">Make the action<br /><span>reviewable.</span></h2></div>
          <div><p>Start with the decision, finding or gap, owner, evidence question, and review trigger. No sensitive record is required to begin a high-level conversation.</p><p><Link className={styles.primaryLink} href="/engage">Prepare the first brief <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/methodology">Review the methodology <span aria-hidden="true">↗</span></Link></p></div>
        </section>
      </div>
    </main>
  );
}
