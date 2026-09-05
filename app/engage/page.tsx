import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
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

const briefMailto = `mailto:hello@zerodevllc.com?subject=ZeroDevLLC%20engagement%20brief&body=${encodeURIComponent([
  'Objective or decision:',
  'High-level context:',
  'Service question:',
  'Audience and decision date:',
  'Authority owner:',
  'Applicability or boundary questions:',
  '',
  'I have not included credentials, secrets, customer records, private incident evidence, or live target details.',
].join('\n'))}`;

const lanes = [
  ['01', 'Assess', 'You need to understand exposure, weakness, risk, or technical condition.', 'Penetration testing, vulnerability assessment, technical due diligence, and cyber-risk review.', [['01', 'Authorized penetration testing'], ['02', 'Vulnerability assessment'], ['04', 'Technical due diligence'], ['03', 'Cyber risk management']]],
  ['02', 'Assure', 'You need evidence about controls, suppliers, readiness, or a decision boundary.', 'Vendor due diligence, compliance readiness, framework mapping, and assurance reporting.', [['05', 'Vendor due diligence'], ['06', 'Compliance readiness'], ['03', 'Cyber risk management']]],
  ['03', 'Recover', 'You need to know whether critical work can continue and recover under pressure.', 'Incident readiness, disaster recovery, BCP, tabletop exercises, and recovery validation.', [['07', 'Disaster recovery and BCP'], ['08', 'Incident readiness'], ['03', 'Cyber risk management']]],
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

export default function EngagePage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#engage-content">Skip to engagement content</a>
      <SiteHeader
        ariaLabel="Engagement navigation"
        current="/engage"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="engage-content">
        <section className={styles.hero} aria-labelledby="engage-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> ENGAGE / SAFE FIRST BRIEF</p>
            <h1 id="engage-heading">Start with the<br /><span>decision.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Bring the question, the decision owner, and the outcome you need to make clearer. A high-level brief is enough to begin a useful conversation.</p>
            <p className={styles.heroBoundary}><strong>Do not send secrets.</strong> Keep credentials, tokens, customer records, private incident evidence, and live target details out of ordinary email. We can establish a safer exchange path after scope and authority are understood.</p>
            <p><a className={styles.primaryLink} href={briefMailto}>Open a high-level brief template <span aria-hidden="true">↗</span></a></p>
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="intake-heading">
          <div>
            <p className={styles.eyebrow}>{'// FIRST CONTACT'}</p>
            <h2 id="intake-heading">Give the work<br /><span>its boundary.</span></h2>
            <p className={styles.bodyCopy}>The first message is not a penetration-test authorization, incident submission, or evidence transfer. It is a way to decide whether a properly scoped engagement is appropriate.</p>
          </div>
          <div className={styles.checkList}>
            {intakeItems.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
          </div>
        </section>

        <section className={styles.twoColumn} aria-labelledby="template-heading">
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
            <p><a className={styles.primaryLink} href={briefMailto}>Open this structure in email <span aria-hidden="true">↗</span></a></p>
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="handling-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// INFORMATION HANDLING GUIDANCE'}</p>
            <h2 id="handling-heading">Match the evidence<br /><span>to the channel.</span></h2>
            <p>Use the least sensitive information needed to decide whether an engagement is appropriate. This is public engagement guidance, not a classification policy or a substitute for the applicable contract and authority.</p>
          </div>
          <div className={styles.actionTableWrap}>
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

        <section className={styles.frameworkSection} aria-labelledby="lane-heading">
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

        <section className={styles.twoColumn} aria-labelledby="response-heading">
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
          <div><p>Send only a high-level objective, the service question, the intended audience, and the person who can confirm authority. No sensitive evidence is required to start.</p><p><a className={styles.primaryLink} href={briefMailto}>Start with the brief template <span aria-hidden="true">↗</span></a><br /><Link className={styles.primaryLink} href="/services">Review all services <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/deliverables">Review deliverable shapes <span aria-hidden="true">↗</span></Link></p></div>
        </section>
      </div>
    </main>
  );
}
