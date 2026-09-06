import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
import RouteIndex from '../route-index';
import BriefActions, { type BriefActionClassNames } from '../brief-actions';
import { getRoleRoute } from '../role-routes';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Start an engagement // ZeroDev LLC',
  description: 'A safe, high-level starting point for authorized cybersecurity, due-diligence, compliance-readiness, and resilience conversations.',
  alternates: { canonical: 'https://zerodevllc.com/engage' },
  openGraph: {
    title: 'Start an engagement // ZeroDev LLC',
    description: 'Prepare a clear, safe first brief for an authorized ZeroDev cybersecurity or resilience engagement.',
    url: 'https://zerodevllc.com/engage',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start an engagement // ZeroDev LLC',
    description: 'Prepare a clear, safe first brief for an authorized ZeroDev cybersecurity or resilience engagement.',
    images: ['/og.png'],
  },
};

const intakeItems = [
  'The decision you need to make or the outcome you need to prove',
  'Your sector, role, and high-level operating context',
  'The engagement lane that seems closest, or the question that is still unclear',
  'A high-level description of the system, supplier, service, or recovery concern',
  'The intended audience for the output: technical, executive, procurement, legal, or risk',
  'The target timeframe, decision date, and any known constraints',
  'The named owner who can confirm authority, scope, and evidence handling',
  'Any applicable contract, framework, data, or jurisdiction questions',
] as const;

const briefTemplate = [
  ['Objective', 'What decision or outcome needs to become clearer?'],
  ['Context', 'Sector, role, and high-level system, supplier, service, or recovery concern.'],
  ['Service question', 'Assess, assure, recover, or not yet clear.'],
  ['Audience and timing', 'Who needs the output, and when is the decision due?'],
  ['Authority owner', 'Who can confirm ownership, scope, and permission to proceed?'],
  ['Applicability and boundary', 'Any contract, framework, jurisdiction, exclusion, or safety constraint to consider.'],
] as const;

const briefSheetFields = [
  ['Decision / outcome', 'What must become clearer, safer, or more recoverable?'],
  ['High-level context', 'Sector, role, service, supplier, system, or recovery concern — no sensitive detail.'],
  ['Possible route', 'Assess / assure / recover / not yet clear.'],
  ['Authority and scope owner', 'Who can confirm ownership, permission, boundaries, and stop conditions?'],
  ['Evidence boundary', 'What can be discussed safely now, and what requires an approved handling path?'],
  ['Audience and timing', 'Who needs the output, what decision date matters, and what constraints are known?'],
  ['Next gate', 'The smallest safe next step, including the owner who must confirm it.'],
] as const;

const baseBriefText = [
  'Objective or decision:',
  'High-level context:',
  'Service question:',
  'Audience and decision date:',
  'Authority owner:',
  'Applicability or boundary questions:',
  'Evidence handling boundary:',
  'Acceptance or next gate:',
  '',
  'I have not included credentials, secrets, customer records, private incident evidence, or live target details.',
].join('\n');

const briefActionClassNames: BriefActionClassNames = {
  group: styles.briefActions,
  link: styles.primaryLink,
  button: styles.briefActionButton,
  status: styles.briefActionStatus,
};

const lanes = [
  ['01', 'Assess', 'You need to understand exposure, weakness, risk, or technical condition.', 'Penetration testing, vulnerability assessment, technical due diligence, and cyber-risk review.', [['01', 'Authorized penetration testing'], ['02', 'Vulnerability assessment'], ['04', 'Technical due diligence'], ['03', 'Cyber risk management']]],
  ['02', 'Assure', 'You need evidence about controls, suppliers, readiness, or a decision boundary.', 'Vendor due diligence, compliance readiness, framework mapping, and assurance reporting.', [['05', 'Vendor due diligence'], ['06', 'Compliance readiness'], ['03', 'Cyber risk management']]],
  ['03', 'Recover', 'You need to know whether critical work can continue and recover under pressure.', 'Incident readiness, disaster recovery, BCP, tabletop exercises, and recovery validation.', [['07', 'Disaster recovery and BCP'], ['08', 'Incident readiness'], ['03', 'Cyber risk management']]],
] as const;

const rolePreparation = [
  ['01', 'Security / engineering owner', 'Scope the technical boundary.', 'Bring the named asset, service, or architecture boundary; the authority owner; the safety contact; and the evidence or output the technical team needs to act on.', 'Review exposure services', '/services#service-01'],
  ['02', 'Procurement / vendor risk', 'Make the supplier decision defensible.', 'Bring the relationship, service and data boundary, review purpose, evidence contact, contract or exit question, and the owner of the commercial or risk decision.', 'Review vendor due diligence', '/services#service-05'],
  ['03', 'Continuity / service owner', 'Prepare for the disruption scenario.', 'Bring the critical service, impact priority, dependencies, recovery assumptions, decision date, and the authority to run a restore test or exercise.', 'Review recovery services', '/services#service-07'],
  ['04', 'Executive / risk / assurance', 'Make the treatment decision explainable.', 'Bring the decision deadline, risk criteria, control or supplier evidence boundary, accountable owner, and the point at which residual risk must be revisited.', 'Review risk and assurance', '/services#service-03'],
] as const;

const firstResponse = [
  'Clarify the decision, service lane, stakeholders, and desired output.',
  'Confirm that the proposed work is authorized, bounded, and safe to discuss.',
  'Identify the minimum evidence needed and a safer exchange path if sensitive material is required.',
  'Call out assumptions, exclusions, provider dependencies, and owner decisions.',
  'Return a proportionate next step, including a no-fit answer when the work is not appropriate.',
] as const;

const handlingMatrix = [
  ['High-level brief', 'Objective, sector, decision owner, outcome, and timeframe', 'Appropriate for an initial email when kept abstract and free of sensitive detail', 'Confirm the decision, authority, and scope'],
  ['Sanitized or redacted example', 'Abstracted architecture, control summary, or redacted finding shape', 'Share only after the recipient, purpose, redaction, and retention boundary are agreed', 'Confirm evidence path and handling owner'],
  ['Sensitive government or defense material', 'Controlled, contractual, classified, export-controlled, or otherwise restricted information', 'Do not send through ordinary email, public pages, or this public site', 'Establish an owner-approved exchange and handling process'],
  ['Credentials, secrets, or live targets', 'Passwords, tokens, private keys, exploit payloads, or live target details', 'Never include in the initial brief or ordinary email', 'Use a separate authorized technical handoff only if necessary'],
] as const;

const engagementReadiness = [
  ['01', 'Decision and outcome', 'Mission or service question, decision date, intended audience, and the outcome the work must make clearer or safer.', 'The decision owner confirms the objective; no technical activity is implied by a high-level brief.'],
  ['02', 'Authority and scope', 'Named authority owner, written permission route, assets or services, inclusions, exclusions, timing, safety contact, and stop conditions.', 'The authority owner confirms the boundary and any changes; missing or mismatched authority pauses the work.'],
  ['03', 'Rules and methods', 'Permitted review or test methods, prohibited actions, rate or availability limits, access assumptions, and escalation route.', 'The security or service owner confirms the method is proportionate; unapproved or unsafe activity is excluded.'],
  ['04', 'Evidence and handling', 'Evidence sources, recency, confidence, minimum necessary data, redaction, transfer channel, retention, and restricted-information boundary.', 'The handling owner confirms the approved path; public pages and ordinary email remain high-level.'],
  ['05', 'Deliverables and acceptance', 'Technical, executive, assurance, or resilience output; evidence states; limitations; audience; acceptance criteria; and named reviewer.', 'The responsible owner accepts a bounded record only; it is not certification, independent assurance, or a security guarantee.'],
  ['06', 'Treatment and retest', 'Owners, priorities, treatment choice, residual-risk decision, retest or exercise condition, and review trigger.', 'The owner records remediation, exception, acceptance, retest, exercise, or escalation; ZeroDev does not accept risk for the client.'],
  ['07', 'Closeout and change control', 'Access removal, temporary-change cleanup, unresolved questions, source or revision record, disposition, next review date, and approved change path.', 'The authority or service owner confirms closeout; unresolved or changed scope stays open or is re-authorized.'],
] as const;

type EngagePageProps = {
  searchParams?: Promise<{ role?: string | string[] }>;
};

export default async function EngagePage({ searchParams }: EngagePageProps) {
  const params = await searchParams;
  const requestedRole = Array.isArray(params?.role) ? params.role[0] : params?.role;
  const selectedRole = getRoleRoute(requestedRole);
  const briefText = selectedRole ? [
    `Role route: ${selectedRole.title}`,
    `Role-specific question: ${selectedRole.briefPrompt}`,
    `First gate: ${selectedRole.briefGate}`,
    '',
    baseBriefText,
  ].join('\n') : baseBriefText;
  const briefSubject = selectedRole ? `ZeroDevLLC ${selectedRole.tag.toLowerCase()} engagement brief` : 'ZeroDevLLC engagement brief';
  const briefMailto = `mailto:hello@zerodevllc.com?subject=${encodeURIComponent(briefSubject)}&body=${encodeURIComponent(briefText)}`;

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#engage-content">Skip to engagement content</a>
      <SiteHeader
        ariaLabel="Engagement navigation"
        current="/engage"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="engage-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="engage-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> ENGAGE / SAFE FIRST BRIEF</p>
            <h1 id="engage-heading">Start with the<br /><span>decision.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Bring the question, the decision owner, and the outcome you need to make clearer. A high-level brief is enough to begin a useful conversation.</p>
            <p className={styles.heroBoundary}><strong>Do not send secrets.</strong> Keep credentials, tokens, customer records, private incident evidence, and live target details out of ordinary email. We can establish a safer exchange path after scope and authority are understood.</p>
            {selectedRole ? (
              <aside className={styles.roleContext} aria-labelledby="selected-role-heading">
                <p className={styles.roleContextLabel}>ROLE CONTEXT / {selectedRole.tag}</p>
                <p><strong id="selected-role-heading">{selectedRole.title}</strong><br />{selectedRole.briefPrompt}</p>
                <p className={styles.roleContextGate}><strong>First gate:</strong> {selectedRole.briefGate}</p>
                <Link className={styles.roleContextReset} href="/engage">Start with a neutral brief <span aria-hidden="true">↺</span></Link>
              </aside>
            ) : null}
            <BriefActions mailtoHref={briefMailto} copyText={briefText} linkLabel="Open a high-level brief template" classNames={briefActionClassNames} />
          </div>
        </section>

        <RouteIndex ariaLabel="Engagement page sections" pageIndexClassName={styles.pageIndex} pageIndexLabelClassName={styles.pageIndexLabel} sections={[
          { href: '#role-prep', number: '01', label: 'Prepare by role' },
          { href: '#intake', number: '02', label: 'Safe intake' },
          { href: '#brief-template', number: '03', label: 'Brief template' },
          { href: '#engagement-readiness', number: '04', label: 'Engagement readiness' },
          { href: '#print-brief', number: '05', label: 'Print review copy' },
          { href: '#handling', number: '06', label: 'Handling rules' },
          { href: '#decision-lanes', number: '07', label: 'Decision lanes' },
          { href: '#response', number: '08', label: 'What happens next' },
        ]} />

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="role-prep" aria-labelledby="role-prep-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// PREPARE BY RESPONSIBILITY'}</p>
            <h2 id="role-prep-heading">Bring the right<br /><span>decision owner.</span></h2>
            <p>The first brief becomes more useful when it names who owns the question, what decision is due, and what evidence can safely support it. Choose the closest responsibility; the service lane can remain undecided.</p>
          </div>
          <div className={styles.outputGrid}>
            {rolePreparation.map(([number, role, title, guidance, action, href]) => (
              <article className={styles.outputCard} key={number}>
                <p className={styles.artifactAudience}>{number} / {role}</p>
                <h3>{title}</h3>
                <p>{guidance}</p>
                <p className={styles.cardBoundary}><strong>Safe first step:</strong> Keep the description high-level; do not attach credentials, customer records, private incident evidence, or live target details.</p>
                <p><Link className={styles.primaryLink} href={href}>{action} <span aria-hidden="true">→</span></Link></p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="intake" aria-labelledby="intake-heading">
          <div>
            <p className={styles.eyebrow}>{'// FIRST CONTACT'}</p>
            <h2 id="intake-heading">Give the work<br /><span>its boundary.</span></h2>
            <p className={styles.bodyCopy}>The first message is not a penetration-test authorization, incident submission, or evidence transfer. It is a way to decide whether a properly scoped engagement is appropriate.</p>
          </div>
          <div className={styles.checkList}>
            {intakeItems.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="brief-template" aria-labelledby="template-heading">
          <div>
            <p className={styles.eyebrow}>{'// SAFE BRIEF TEMPLATE'}</p>
            <h2 id="template-heading">Give the first<br /><span>message a shape.</span></h2>
            <p className={styles.bodyCopy}>Use these headings for an initial note. Leave unknown fields blank and keep sensitive evidence out until the recipient, purpose, and handling path are agreed.</p>
          </div>
          <div>
            <div className={styles.checkList}>
              {briefTemplate.map(([label, prompt], index) => <div key={label}><span>{String(index + 1).padStart(2, '0')}</span><p><strong>{label}:</strong> {prompt}</p></div>)}
            </div>
            <p className={styles.templateNote}><strong>Safe boundary:</strong> Do not add credentials, secrets, customer records, private incident evidence, or live target details to the template.</p>
            {selectedRole ? <p className={styles.templateNote}><strong>Role route included:</strong> The email and copy actions include the {selectedRole.title.toLowerCase()} question above as planning context only.</p> : null}
            <BriefActions mailtoHref={briefMailto} copyText={briefText} linkLabel="Open this structure in email" classNames={briefActionClassNames} />
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="engagement-readiness" aria-labelledby="readiness-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// ENGAGEMENT READINESS / SOW STARTER'}</p>
            <h2 id="readiness-heading">Define the work.<br /><span>Own the gates.</span></h2>
            <p>This synthetic outline helps a public-sector, defense-supplier, procurement, security, continuity, or risk owner prepare a proportionate engagement record before a proposal or controlled exchange.</p>
            <p className={styles.templateNote}><strong>Owner gate.</strong> This is a readiness outline, not a proposal, statement of work, contract, authorization, classification policy, or certification evidence. The applicable contract, authority, handling process, and owner decisions control the real engagement.</p>
            <p><Link className={styles.primaryLink} href="/methodology#rules-of-engagement">Review the rules-of-engagement starter <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/deliverables">Review deliverable acceptance shapes <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/assurance#claims-proof">Review claims and proof gates <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.actionTableWrap} tabIndex={0} role="region" aria-label="Engagement readiness and SOW starter table">
            <table className={`${styles.actionTable} ${styles.sowReadinessMap}`}>
              <caption className={styles.tableCaption}>Synthetic engagement readiness and SOW starter — structure and owner gates only; not a contract, proposal, authorization, or operational instruction.</caption>
              <thead>
                <tr>
                  <th scope="col">Readiness stage</th>
                  <th scope="col">Draft record</th>
                  <th scope="col">Owner acceptance or stop condition</th>
                </tr>
              </thead>
              <tbody>
                {engagementReadiness.map(([number, stage, record, gate]) => (
                  <tr key={stage}>
                    <td><span className={styles.tableNumber}>{number}</span>{stage}</td>
                    <td>{record}</td>
                    <td>{gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="print-brief" aria-labelledby="print-brief-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// PRINT / INTERNAL REVIEW COPY'}</p>
            <h2 id="print-brief-heading">Make the first brief<br /><span>portable.</span></h2>
            <p>Use this static sheet for an internal review or to prepare a high-level message in an approved channel. It is not a submission form, authorization, proposal, classification policy, or evidence-transfer route.</p>
            <p className={styles.templateNote}><strong>Review boundary:</strong> Print or copy only the high-level prompts. Do not complete this sheet with credentials, customer records, private incident evidence, exploit payloads, or live target details.</p>
          </div>
          <article className={`${styles.outputCard} ${styles.briefSheet}`} aria-label="ZeroDevLLC first brief review copy">
            <div className={styles.briefSheetHeader}>
              <div><p className={styles.artifactAudience}>ZERODEVLLC // FIRST BRIEF</p><h3>Decision frame</h3></div>
              <span className={styles.briefSheetStatus}>NOT AUTHORIZATION</span>
            </div>
            <dl className={styles.briefSheetFields}>
              {briefSheetFields.map(([label, prompt]) => <div key={label}><dt>{label}</dt><dd>[{prompt}]</dd></div>)}
            </dl>
            <p className={styles.briefSheetBoundary}><strong>Safe starting boundary:</strong> This review copy records a question and a possible next gate. It does not approve testing, accept evidence, establish certification, confirm clearance, or transfer responsibility for residual risk.</p>
            <div className={styles.briefSheetFooter}><span>STATUS / DRAFT FOR OWNER REVIEW</span><span>CHANNEL / APPROVED PATH REQUIRED</span></div>
          </article>
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="handling" aria-labelledby="handling-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// INFORMATION HANDLING GUIDANCE'}</p>
            <h2 id="handling-heading">Match the evidence<br /><span>to the channel.</span></h2>
            <p>Use the least sensitive information needed to decide whether an engagement is appropriate. This is public engagement guidance, not a classification policy or a substitute for the applicable contract and authority.</p>
          </div>
          <div className={styles.actionTableWrap} tabIndex={0} role="region" aria-label="Information handling guidance table">
            <table className={styles.actionTable}>
              <caption className={styles.tableCaption}>Illustrative handling guidance — not a classified-information handling policy.</caption>
              <thead>
                <tr>
                  <th scope="col">Information lane</th>
                  <th scope="col">Examples</th>
                  <th scope="col">First-contact rule</th>
                  <th scope="col">Next gate</th>
                </tr>
              </thead>
              <tbody>
                {handlingMatrix.map(([lane, examples, rule, gate]) => (
                  <tr key={lane}>
                    <td>{lane}</td>
                    <td>{examples}</td>
                    <td>{rule}</td>
                    <td>{gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.frameworkSection} ${styles.routeSection}`} id="decision-lanes" aria-labelledby="lane-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// CHOOSE THE DECISION'}</p>
            <h2 id="lane-heading">Three lanes.<br /><span>One boundary.</span></h2>
            <p>If the right service is not obvious, start with the decision rather than forcing the problem into a product name.</p>
          </div>
          <div className={styles.frameworkGrid}>
            {lanes.map(([number, title, question, services, serviceRefs]) => (
              <article className={styles.frameworkCard} key={number}>
                <span className={styles.frameworkTag}>{number} / DECISION LANE</span>
                <h3>{title}</h3>
                <p>{question}</p>
                <p className={styles.cardBoundary}><strong>Possible scope:</strong> {services}</p>
                <p className={styles.cardBoundary}><strong>Review aligned services:</strong>{serviceRefs.map(([serviceNumber, serviceTitle], index) => <span key={serviceNumber}>{index > 0 ? ' / ' : ' '}<Link href={`/services#service-${serviceNumber}`}>{serviceTitle}</Link></span>)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="response" aria-labelledby="response-heading">
          <div>
            <p className={styles.eyebrow}>{'// WHAT HAPPENS NEXT'}</p>
            <h2 id="response-heading">Useful before<br /><span>technical activity.</span></h2>
            <p className={styles.bodyCopy}>A response should make the next decision easier, even when the right answer is to narrow the scope, involve another owner, or stop.</p>
          </div>
          <div className={styles.checkList}>
            {firstResponse.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
          </div>
        </section>

        <section className={styles.noticeSection} aria-labelledby="not-send-heading">
          <p className={styles.eyebrow}>{'// INFORMATION BOUNDARY'}</p>
          <h2 id="not-send-heading">No credentials.<br /><span>No live targets.</span></h2>
          <p>Do not send passwords, tokens, private keys, customer records, payment details, malware, exploit payloads, private incident evidence, or unredacted system inventories through ordinary email. Do not request activity against a system you do not own or have written authority to test. Start with a high-level problem statement and the relevant decision owner.</p>
          <p>Read the <Link href="/privacy">privacy boundary</Link> and <Link href="/methodology">controlled engagement methodology</Link> before sharing anything more specific.</p>
        </section>

        <section className={styles.cta} aria-labelledby="engage-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="engage-cta-heading">Make the first<br /><span>message useful.</span></h2></div>
          <div><p>Send only a high-level objective, the service question, the intended audience, and the person who can confirm authority. No sensitive evidence is required to start.</p><p><a className={styles.primaryLink} href={briefMailto}>Start with the brief template <span aria-hidden="true">↗</span></a><br /><Link className={styles.primaryLink} href="/services">Review all services <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/deliverables">Review deliverable shapes <span aria-hidden="true">→</span></Link></p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
