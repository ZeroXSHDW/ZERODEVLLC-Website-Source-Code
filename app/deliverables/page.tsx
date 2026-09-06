import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Deliverables and evidence // ZeroDev LLC',
  description: 'Representative, reviewable deliverable shapes for authorized cyber assessments, due diligence, readiness, and resilience engagements.',
  alternates: { canonical: 'https://zerodevllc.com/deliverables' },
  openGraph: {
    title: 'Deliverables and evidence // ZeroDev LLC',
    description: 'See the evidence fields and review boundaries behind ZeroDev engagement outputs.',
    url: 'https://zerodevllc.com/deliverables',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deliverables and evidence // ZeroDev LLC',
    description: 'See the evidence fields and review boundaries behind ZeroDev engagement outputs.',
    images: ['/og.png'],
  },
};

const artifacts = [
  ['01', 'Executive risk brief', 'Decision owner / board / procurement', ['Decision and agreed scope', 'Prioritized risk and potential impact', 'Owner and treatment choices', 'Residual risk and next review date'], 'A decision aid, not a legal opinion, audit opinion, certification, or guarantee.'],
  ['02', 'Technical findings register', 'Security / engineering / operations', ['Asset and test context', 'Observation versus validated finding', 'Severity, exploitability, and limitations', 'Remediation owner, priority, and retest condition'], 'A register reflects the agreed scope and evidence; it does not prove that an untested surface is safe.'],
  ['03', 'Supplier-risk matrix', 'Procurement / risk / third-party owner', ['Service, data, and dependency boundary', 'Evidence requested, received, and verified', 'Subprocessor, concentration, and exit questions', 'Open gaps, assumptions, and accepted residual risk'], 'A questionnaire response is not independent assurance and a review is not a supplier verdict.'],
  ['04', 'Control-readiness map', 'Assurance / compliance / control owners', ['Requirement or control reference', 'Owner, implementation state, and evidence', 'Gap, exception, and remediation action', 'Review date and applicability decision'], 'Readiness support does not create certification, accreditation, clearance, or regulatory approval.'],
  ['05', 'Resilience exercise record', 'Continuity / incident / service owner', ['Scenario, critical service, and participants', 'Decision points, dependencies, and assumptions', 'Recovery result, RTO/RPO discussion, and gaps', 'Owned actions and next exercise or test date'], 'A plan or tabletop does not prove recovery until the relevant capability is exercised and evidenced.'],
  ['06', 'Retest and closeout note', 'Decision owner / remediation owner', ['Original finding and changed control', 'Retest method, scope, and observed result', 'What remains open or unverified', 'Closeout owner and next review trigger'], 'A retest is bounded evidence about the changed scope, not a permanent security guarantee.'],
] as const;

const evidenceStates = [
  'Requested — the evidence item and reason are defined.',
  'Received — a source was supplied, without assuming it is accurate or complete.',
  'Verified — the agreed verification method and limitations are recorded.',
  'Interpreted — the evidence is connected to a control, risk, decision, or service.',
  'Accepted or excepted — the responsible owner records treatment or residual risk.',
  'Rechecked — a changed control, recovery capability, or open question is reviewed again.',
] as const;

const evidenceRequestRows = [
  ['01', 'Authorized penetration testing', 'Written authority, in-scope assets, exclusions, rules of engagement, safety contact, and stop conditions.', 'Review authority and scope before any technical activity; confirm permitted methods, escalation, and evidence boundaries.', 'Named authority approves the scope, safety controls, permitted activity, and report audience.'],
  ['02', 'Vulnerability assessment', 'Asset boundary, inventory or scanner context, source date, access permission, and the owner who can validate observations.', 'Reconcile the source and scope, verify material observations where permitted, and record severity, confidence, and limitations.', 'Security or engineering owner accepts the prioritized treatment path or records an authorized exception.'],
  ['03', 'Cyber risk management', 'Mission or business objective, risk criteria, important services, existing controls, decision owner, and review date.', 'Map evidence to the risk question, control state, impact, likelihood, assumptions, and available treatment choices.', 'Risk or executive owner records treatment, transfer, avoidance, monitoring, or residual-risk acceptance.'],
  ['04', 'Technical due diligence', 'The material decision, architecture boundary, delivery practices, critical dependencies, resilience evidence, and open questions.', 'Use bounded document, interview, and technical review methods; distinguish evidence, assumptions, gaps, and material unknowns.', 'Decision owner acknowledges the open questions, conditions, limitations, and decision implications.'],
  ['05', 'Vendor due diligence', 'Supplier service and data flow, access model, subprocessors, continuity, incident evidence, contract context, and exit assumptions.', 'Check evidence provenance, coverage, recency, relationship fit, concentration, access, incident, and exit gaps.', 'Procurement or third-party risk owner records approval, conditions, mitigation, escalation, or decline.'],
  ['06', 'Compliance readiness', 'Applicable requirement or contract, jurisdiction, control register, evidence owner, exception state, and target review date.', 'Confirm applicability and map evidence to the requirement; use sampling or specialist review without presenting the work as certification.', 'Control owner records the gap, exception, remediation route, or referral to the appropriate assessor or authority.'],
  ['07', 'Disaster recovery and BCP', 'Critical service, business impact, dependencies, recovery assumptions, RTO/RPO discussion, runbooks, and exercise authority.', 'Review or exercise the agreed scenario, record decisions and observed results, and preserve unresolved dependency and recovery gaps.', 'Continuity or service owner accepts the exercise result, owned actions, residual risk, and next exercise or restore test.'],
  ['08', 'Incident readiness', 'Roles, escalation contacts, scenario, communications path, evidence boundary, exercise authority, and participant list.', 'Run a bounded tabletop or exercise, record decisions and evidence handling, and separate exercise observations from a live incident.', 'Incident or executive owner approves the lessons-learned backlog, communications actions, and next readiness review.'],
] as const;

const procurementEvidencePath = [
  ['01', 'Boundary and data flow', 'Service purpose, users, geography, data categories, access paths, critical dependencies, subprocessors, and material fourth parties.', 'Confirm the boundary with the procurement, service, security, and supplier owners; reconcile the service description with the proposed relationship.', 'Scope state, accountable owner, source date, and review trigger.', 'A generic architecture diagram or supplier description is not a complete boundary.'],
  ['02', 'Control and incident posture', 'Current control summary, independent reports where applicable, incident route, notification terms, logging context, and unresolved exceptions.', 'Check provenance, coverage period, applicability, exclusions, exceptions, and whether the evidence addresses the actual service rather than the supplier generally.', 'Evidence state, provenance, confidence, limitation, and owner question.', 'A questionnaire answer or marketing claim is not independent assurance.'],
  ['03', 'Access and third parties', 'Privileged access model, identity controls, support access, subprocessor or fourth-party register, segregation, monitoring, and review cadence.', 'Map who can access what, why access is needed, how it is approved, and how the relationship changes when the contract or service changes.', 'Access/data map, open gap, accountable owner, and decision condition.', 'Do not request secrets, private keys, credentials, or unnecessary customer records.'],
  ['04', 'Continuity and exit', 'Critical-service dependencies, recovery assumptions, RTO/RPO context, tested recovery, portability, exit assistance, concentration, and substitution assumptions.', 'Tie continuity claims to an exercise, restore, or other permitted evidence; inspect dependencies and contract conditions that could affect exit or recovery.', 'Observed result, unresolved dependency, treatment action, and next test or review date.', 'A documented plan without an observed test is not proof of recovery.'],
  ['05', 'Findings and exceptions', 'Open findings, risk acceptances, compensating controls, remediation commitments, material incidents, and overdue actions relevant to the service.', 'Check scope, owner, date, severity, residual risk, evidence quality, and the trigger that would cause escalation or re-review.', 'Action record, confidence, acceptance authority, due date, and escalation path.', 'Absence of supplied evidence is not evidence of a clean result.'],
  ['06', 'Acceptance gate', 'The conditions, limitations, decisions, and follow-up work required from procurement, security, legal, continuity, service, and risk owners.', 'Record what is accepted, conditioned, deferred, escalated, or declined; identify the owner and the date or event that reopens the question.', 'Decision, accountable owner, residual-risk treatment, and revisit date.', 'ZeroDev does not approve a supplier, provide legal advice, or accept residual risk for the customer.'],
] as const;

const provenanceRows = [
  ['Source identity', 'Origin, owner, revision or observation date, and a stable reference.', 'A named source has a traceable revision, date, or explicit synthetic label.', 'An unattributed, stale, or untraceable source remains unverified.'],
  ['Scope and applicability', 'System, service, contract, framework, jurisdiction, objective, exclusions, and intended audience.', 'The evidence matches the agreed question and the boundary being reviewed.', 'A relevant document outside the agreed scope does not prove the in-scope condition.'],
  ['Method and confidence', 'Review, interview, sampling, test, exercise, or independent verification method and sample limits.', 'The method, sample, limitations, and confidence basis are visible to the decision-maker.', 'Confidence describes evidence quality; it is not a security guarantee or auditor opinion.'],
  ['Interpretation and limitation', 'Observed, verified, assumed, disputed, missing, and unresolved elements.', 'Facts, analysis, assumptions, and open questions are kept distinct.', 'Interpretation does not create legal, procurement, regulatory, or certification authority.'],
  ['Owner and decision', 'Accountable owner, decision owner, treatment, exception, and acceptance authority.', 'A named owner acknowledges the conclusion and the next action.', 'A report cannot accept residual risk on behalf of an organization.'],
  ['Review trigger and disposition', 'Retest, exercise, contract change, threat update, requirement change, and retention or disposition date.', 'The record states when evidence expires, changes meaning, or needs rechecking.', 'A historical pass does not prove current security, resilience, or continuity.'],
] as const;

const briefPreviewRows = [
  ['Decision question', 'Can a critical public-facing service proceed to the next approved change window?', 'Synthetic question / not a client decision'],
  ['Agreed boundary', 'Illustrative external application surface; no live target, customer record, credential, or production export is included.', 'Template scope / no live assessment'],
  ['Evidence state', 'A reported access-control assumption is awaiting scope confirmation and permitted verification.', 'Observed / pending verification'],
  ['Treatment path', 'Named service owner confirms the control, records the risk choice, and agrees a retest or review condition.', 'Recommended action / owner required'],
  ['Closeout condition', 'Record what changed, what was rechecked, what remains open, and the next review trigger.', 'Rechecked / closure evidence required'],
] as const;

export default function DeliverablesPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#deliverables-content">Skip to deliverables content</a>
      <SiteHeader
        ariaLabel="Deliverables navigation"
        current="/deliverables"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="deliverables-content">
        <section className={styles.hero} aria-labelledby="deliverables-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> DELIVERABLES / EVIDENCE SHAPES</p>
            <h1 id="deliverables-heading">Show the work.<br /><span>Protect the evidence.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>These representative output shapes show how technical observations become usable decisions for executives, engineers, procurement, risk owners, and continuity teams.</p>
            <p className={styles.heroBoundary}><strong>Template boundary.</strong> These are illustrative structures, not client reports, independent assurance, certification evidence, government records, or proof of a particular engagement.</p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">→</span></Link></p>
          </div>
        </section>

        <nav className={styles.pageIndex} aria-label="Deliverables page sections">
          <p className={styles.pageIndexLabel}>{'// ROUTE INDEX'}</p>
          <ol>
            <li><a href="#output-shapes"><span>01</span>Output shapes</a></li>
            <li><a href="#evidence-request-map"><span>02</span>Evidence map</a></li>
            <li><a href="#procurement-evidence"><span>03</span>Procurement path</a></li>
            <li><a href="#synthetic-preview"><span>04</span>Review preview</a></li>
            <li><a href="#evidence-state"><span>05</span>Evidence state</a></li>
            <li><a href="#provenance-confidence"><span>06</span>Provenance</a></li>
            <li><a href="#handling-boundary"><span>07</span>Handling boundary</a></li>
          </ol>
        </nav>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="output-shapes" aria-labelledby="artifacts-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// REPRESENTATIVE OUTPUTS'}</p>
            <h2 id="artifacts-heading">Evidence with<br /><span>a decision attached.</span></h2>
            <p>The final deliverable depends on the agreed objective, authority, evidence, framework, and audience. The shapes below make the expected conversation visible before work begins.</p>
          </div>
          <div className={styles.outputGrid}>
            {artifacts.map(([number, title, audience, fields, boundary]) => (
              <article className={styles.outputCard} id={`deliverable-${number}`} key={number}>
                <span className={styles.frameworkTag}>{number} / TEMPLATE SHAPE / NOT CLIENT EVIDENCE</span>
                <h3>{title}</h3>
                <p className={styles.artifactAudience}>{audience}</p>
                <ul className={styles.fieldList}>{fields.map((field) => <li key={field}>{field}</li>)}</ul>
                <p className={styles.cardBoundary}><strong>Boundary:</strong> {boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="evidence-request-map" aria-labelledby="evidence-request-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// EVIDENCE REQUEST / ACCEPTANCE'}</p>
            <h2 id="evidence-request-heading">Ask for evidence.<br /><span>Record the decision.</span></h2>
            <p>This orientation map helps a buyer prepare a proportionate starting set for each service. It is not a universal client checklist, a classification policy, an authorization, a certification route, or a substitute for the applicable contract and owner decision.</p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={`${styles.actionTable} ${styles.evidenceRequestMap}`}>
              <caption className={styles.tableCaption}>Illustrative evidence-request and acceptance map — confirm scope, authority, handling, and applicability before relying on a request.</caption>
              <thead>
                <tr>
                  <th scope="col">Engagement lane</th>
                  <th scope="col">Safe starting evidence</th>
                  <th scope="col">Review or verification method</th>
                  <th scope="col">Decision or acceptance condition</th>
                </tr>
              </thead>
              <tbody>
                {evidenceRequestRows.map(([number, lane, evidence, method, acceptance]) => (
                  <tr key={lane}>
                    <td><Link className={styles.evidenceRequestLink} href={`/services#service-${number}`}>{lane} <span aria-hidden="true">→</span></Link></td>
                    <td>{evidence}</td>
                    <td>{method}</td>
                    <td>{acceptance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="procurement-evidence" aria-labelledby="procurement-evidence-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// PROCUREMENT / VENDOR RISK EVIDENCE PATH'}</p>
            <h2 id="procurement-evidence-heading">Review the supplier.<br /><span>Keep the decision owned.</span></h2>
            <p>This path helps a procurement or third-party-risk team turn a supplier conversation into a bounded, reviewable evidence record. It separates the service boundary, verification method, confidence, accountable owner, and next gate.</p>
            <p><Link className={styles.primaryLink} href="/engage#print-brief">Use the first-brief template <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/frameworks#service-framework-map">Check framework fit <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/privacy">Review information handling <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={`${styles.actionTable} ${styles.procurementEvidenceMap}`}>
              <caption className={styles.tableCaption}>Illustrative procurement and vendor-risk evidence path — not a universal questionnaire, supplier approval, legal opinion, certification, regulator determination, or independent assurance report.</caption>
              <thead>
                <tr>
                  <th scope="col">Evidence lane</th>
                  <th scope="col">Safe starting evidence</th>
                  <th scope="col">Review or verification method</th>
                  <th scope="col">Record for the decision</th>
                  <th scope="col">No-fit condition</th>
                </tr>
              </thead>
              <tbody>
                {procurementEvidencePath.map(([number, lane, evidence, method, record, boundary]) => (
                  <tr key={lane}>
                    <td><span className={styles.tableNumber}>{number}</span>{lane}</td>
                    <td>{evidence}</td>
                    <td>{method}</td>
                    <td>{record}</td>
                    <td>{boundary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="synthetic-preview" aria-labelledby="preview-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// SYNTHETIC REVIEW PREVIEW'}</p>
            <h2 id="preview-heading">See the review<br /><span>before the handoff.</span></h2>
            <p>A useful deliverable makes the decision, boundary, evidence state, owner, treatment, and closeout condition visible together. This example is intentionally synthetic and contains no client, provider, target, or production evidence.</p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={styles.actionTable}>
              <caption className={styles.tableCaption}>Synthetic executive risk brief preview — not client evidence, a live finding, or a security guarantee.</caption>
              <thead>
                <tr>
                  <th scope="col">Brief field</th>
                  <th scope="col">Illustrative entry</th>
                  <th scope="col">Evidence state / boundary</th>
                </tr>
              </thead>
              <tbody>
                {briefPreviewRows.map(([field, entry, state]) => (
                  <tr key={field}>
                    <td>{field}</td>
                    <td>{entry}</td>
                    <td>{state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="evidence-state" aria-labelledby="evidence-state-heading">
          <div>
            <p className={styles.eyebrow}>{'// EVIDENCE STATE'}</p>
            <h2 id="evidence-state-heading">Received is not<br /><span>verified.</span></h2>
            <p className={styles.bodyCopy}>A credible review keeps the evidence state visible. A document can be received without being complete, authentic, current, applicable, or independently verified.</p>
          </div>
          <div className={styles.checkList}>
            {evidenceStates.map((state, index) => <div key={state}><span>{String(index + 1).padStart(2, '0')}</span><p>{state}</p></div>)}
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="provenance-confidence" aria-labelledby="provenance-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// PROVENANCE / CONFIDENCE'}</p>
            <h2 id="provenance-heading">Make confidence<br /><span>inspectable.</span></h2>
            <p>A review becomes more defensible when a reader can see where the evidence came from, what it covers, how it was checked, what remains uncertain, and when the conclusion should be revisited.</p>
            <p><Link className={styles.primaryLink} href="/assurance#claims-proof">Use the claims-to-proof matrix before turning evidence into a public claim <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={`${styles.actionTable} ${styles.provenanceMap}`}>
              <caption className={styles.tableCaption}>Illustrative provenance and confidence record — not a client evidence register or independent assurance opinion.</caption>
              <thead>
                <tr>
                  <th scope="col">Provenance field</th>
                  <th scope="col">Record</th>
                  <th scope="col">Confidence signal</th>
                  <th scope="col">Boundary</th>
                </tr>
              </thead>
              <tbody>
                {provenanceRows.map(([field, record, signal, boundary]) => (
                  <tr key={field}>
                    <td>{field}</td>
                    <td>{record}</td>
                    <td>{signal}</td>
                    <td>{boundary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.noticeSection} ${styles.routeSection}`} id="handling-boundary" aria-labelledby="redaction-heading">
          <p className={styles.eyebrow}>{'// REDACTION / HANDLING'}</p>
          <h2 id="redaction-heading">Examples without<br /><span>exposure.</span></h2>
          <p>Any public or early-stage review material should be sanitized. Do not place credentials, tokens, private keys, customer records, payment details, private incident evidence, unredacted inventories, live target details, exploit payloads, or confidential government or defense information into ordinary email or public pages.</p>
          <p>Use synthetic, redacted, or abstracted examples for discovery. Establish the authorized handling path, minimum necessary evidence, retention boundary, and decision owner before sensitive material is exchanged.</p>
        </section>

        <section className={styles.cta} aria-labelledby="deliverables-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="deliverables-cta-heading">Choose the<br /><span>evidence question.</span></h2></div>
          <div><p>Start with the decision, audience, scope, and authority. The deliverable shape can then be adapted to the engagement without inventing certainty.</p><p><Link className={styles.primaryLink} href="/engage">Prepare the first brief <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/methodology">Review the methodology <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/remediation">Review the remediation lifecycle <span aria-hidden="true">→</span></Link></p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
