import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
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
  twitter: {
    card: 'summary_large_image',
    title: 'Services // ZeroDev LLC',
    description: 'Authorized defensive cybersecurity, cyber-risk, due-diligence, compliance-readiness, and resilience engagement areas.',
    images: ['/og.png'],
  },
};

const services = [
  {
    number: '01',
    title: 'Authorized penetration testing',
    summary: 'Test agreed attack surfaces under written authority, bounded rules of engagement, and safety controls.',
    activities: ['External and internal surfaces', 'Web, API, cloud, identity, and segmentation review', 'Remediation validation and retesting'],
    output: 'Scope, evidence, findings, risk context, and a remediation path.',
    audience: 'Security or service owner with written authority.',
    tone: 'cyan',
  },
  {
    number: '02',
    title: 'Vulnerability assessment',
    summary: 'Turn scanner output and technical observations into a prioritized, evidence-backed risk view.',
    activities: ['Asset and exposure context', 'Manual verification where appropriate', 'Severity, exploitability, and business-impact analysis'],
    output: 'Validated findings register with owners, priorities, and next checks.',
    audience: 'Security or engineering owner with asset context.',
    tone: 'amber',
  },
  {
    number: '03',
    title: 'Cyber risk management',
    summary: 'Connect assets, threats, controls, decisions, exceptions, and residual risk in one usable operating view.',
    activities: ['Risk identification and treatment planning', 'Control ownership and evidence mapping', 'Executive and board-ready reporting'],
    output: 'A decision-ready risk register and measurable treatment roadmap.',
    audience: 'Risk, executive, or service owner setting treatment.',
    tone: 'green',
  },
  {
    number: '04',
    title: 'Technical due diligence',
    summary: 'Assess architecture, delivery practices, dependencies, resilience, and technical risk before an important decision.',
    activities: ['Architecture and control review', 'Secure development and supply-chain review', 'Open questions, assumptions, and red flags'],
    output: 'Technical brief, evidence requests, risk summary, and decision support.',
    audience: 'Decision owner and technical lead before a material decision.',
    tone: 'violet',
  },
  {
    number: '05',
    title: 'Vendor due diligence',
    summary: 'Evaluate whether a supplier’s security, continuity, access, incident, and evidence posture fits the relationship.',
    activities: ['Questionnaire and evidence review', 'Data-flow, subprocessor, and access analysis', 'Concentration, exit, and fourth-party risk'],
    output: 'A proportionate supplier-risk view with open evidence gaps.',
    audience: 'Procurement or third-party risk owner.',
    tone: 'cyan',
  },
  {
    number: '06',
    title: 'Compliance readiness',
    summary: 'Map applicable requirements to current evidence, owners, gaps, and an implementation sequence.',
    activities: ['Framework and control-family mapping', 'Evidence preparation and gap analysis', 'Exception and remediation tracking'],
    output: 'Readiness plan—not a certification, accreditation, or legal opinion.',
    audience: 'Assurance, compliance, or control owner.',
    tone: 'amber',
  },
  {
    number: '07',
    title: 'Disaster recovery and BCP',
    summary: 'Make critical services, dependencies, recovery priorities, and continuity assumptions testable.',
    activities: ['Business impact and dependency mapping', 'RTO/RPO and recovery strategy review', 'Restore testing, tabletop exercises, and lessons learned'],
    output: 'A practical resilience roadmap tied to tested recovery outcomes.',
    audience: 'Continuity or service owner responsible for recovery.',
    tone: 'green',
  },
  {
    number: '08',
    title: 'Incident readiness',
    summary: 'Prepare people, decisions, evidence, communications, and technical response paths before pressure arrives.',
    activities: ['Roles, escalation, and evidence boundaries', 'Tabletop and purple-team exercise design', 'Post-exercise actions and control improvements'],
    output: 'An exercise record, lessons learned, and owned improvement backlog.',
    audience: 'Incident, risk, or executive owner convening an exercise.',
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

const decisionMatrix = [
  ['Authorized penetration testing', 'Can agreed attack paths be safely demonstrated under written authority?', 'Scoped test evidence, validated findings, limitations, and retest condition', 'Security and service owner', 'Written authority, in-scope assets, rules of engagement, safety contact, and stop conditions'],
  ['Vulnerability assessment', 'Which assets, configurations, or dependencies expose a material weakness?', 'Asset context, verified observations, prioritization, and treatment path', 'Security and engineering owner', 'Named asset boundary, permission to assess, source or inventory context, and evidence owner'],
  ['Cyber risk management', 'Which risks require treatment, acceptance, transfer, avoidance, or monitoring?', 'Risk register, control evidence, owner, residual risk, and review trigger', 'Risk and executive owner', 'Decision owner, mission or business context, risk criteria, and treatment authority'],
  ['Technical due diligence', 'What technical conditions could change an important business or investment decision?', 'Architecture, delivery practice, dependency, resilience, and open-question brief', 'Decision and technical owner', 'Defined decision, review boundary, permitted evidence sources, and technical owner'],
  ['Vendor due diligence', 'Does the supplier evidence fit the service, data, access, and exit relationship?', 'Evidence state, data flow, subprocessor, concentration, incident, and exit view', 'Procurement and third-party risk owner', 'Supplier relationship, service/data boundary, evidence contact, and procurement owner'],
  ['Compliance readiness', 'What requirement applies, what evidence exists, and what remains to be addressed?', 'Control map, applicability decision, owner, gap, exception, and review date', 'Assurance and control owner', 'Applicable contract, framework, jurisdiction, control owner, and evidence boundary'],
  ['Disaster recovery and BCP', 'Can the critical service continue and recover under the agreed scenario?', 'Impact priorities, dependencies, RTO/RPO discussion, exercise or restore result', 'Continuity and service owner', 'Critical service, scenario, dependency owner, recovery assumptions, and exercise authority'],
  ['Incident readiness', 'Can the organization make safe decisions, coordinate, preserve evidence, and improve after an exercise?', 'Roles, escalation, communications, exercise record, lessons, and owned actions', 'Incident and risk owner', 'Scenario, participants, escalation owner, evidence boundary, and exercise authorization'],
] as const;

const serviceBriefs = [
  {
    number: '01',
    title: 'Authorized penetration testing',
    decision: 'Can approved attack paths be demonstrated safely against the named boundary?',
    gate: 'Written authority, in-scope assets, rules of engagement, safety contact, and stop conditions.',
    output: 'Scoped findings, evidence confidence, limitations, remediation choices, and a retest condition.',
    noFit: 'No written authority, unclear ownership, or live target details supplied through a public channel.',
  },
  {
    number: '02',
    title: 'Vulnerability assessment',
    decision: 'Which assets, configurations, or dependencies need priority and verified treatment?',
    gate: 'Named asset boundary, permission to assess, source or inventory context, and an evidence owner.',
    output: 'A validated findings register with prioritization, owners, treatment path, and next checks.',
    noFit: 'An unbounded scanner export with no asset owner, permission, or business-impact context.',
  },
  {
    number: '03',
    title: 'Cyber risk management',
    decision: 'Which risks require treatment, acceptance, transfer, avoidance, or monitoring?',
    gate: 'Decision owner, mission or business context, risk criteria, control evidence, and treatment authority.',
    output: 'A decision-ready risk register, control/evidence map, treatment roadmap, and review trigger.',
    noFit: 'A request for an objective score without context, criteria, evidence quality, or an accountable owner.',
  },
  {
    number: '04',
    title: 'Technical due diligence',
    decision: 'What technical conditions could change an important program, investment, or supplier decision?',
    gate: 'Defined decision, review boundary, permitted evidence sources, and a technical decision owner.',
    output: 'A technical brief covering architecture, delivery practice, dependencies, assumptions, and open questions.',
    noFit: 'A request for a legal, financial, investment, or procurement verdict beyond the agreed technical review.',
  },
  {
    number: '05',
    title: 'Vendor due diligence',
    decision: 'Does the supplier evidence fit the service, data, access, incident, and exit relationship?',
    gate: 'Supplier relationship, service/data boundary, procurement owner, evidence contact, and review purpose.',
    output: 'A supplier-risk matrix with evidence states, gaps, subprocessor, concentration, fourth-party, and exit questions.',
    noFit: 'Treating a questionnaire response as independent assurance or asking for a supplier verdict without owner judgment.',
  },
  {
    number: '06',
    title: 'Compliance readiness',
    decision: 'What requirement applies, what evidence exists, and what remains to be addressed?',
    gate: 'Applicable contract, framework, jurisdiction, control owner, evidence boundary, and assessment objective.',
    output: 'A control map with applicability decisions, implementation state, gaps, exceptions, and remediation sequence.',
    noFit: 'A request for certification, accreditation, clearance, legal advice, or regulator approval from a readiness review.',
  },
  {
    number: '07',
    title: 'Disaster recovery and BCP',
    decision: 'Can the critical service continue and recover under the agreed disruption scenario?',
    gate: 'Critical service, impact priorities, dependencies, recovery assumptions, RTO/RPO discussion, and exercise authority.',
    output: 'A resilience roadmap tied to restore or exercise results, unresolved gaps, owners, and next validation.',
    noFit: 'Claiming recovery capability from a document or unexercised plan without an observed result and owner decision.',
  },
  {
    number: '08',
    title: 'Incident readiness',
    decision: 'Can the organization make safe decisions, coordinate, preserve evidence, and improve after an exercise?',
    gate: 'Scenario, participants, escalation owner, evidence boundary, communications path, and exercise authorization.',
    output: 'An exercise record, decision points, lessons learned, owned actions, and a rehearsal or retest trigger.',
    noFit: 'A live incident or sensitive evidence transfer through this public site; use the approved incident channel and authority.',
  },
] as const;

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#services-content">Skip to services content</a>
      <SiteHeader
        ariaLabel="Services navigation"
        current="/services"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="services-content">
        <section className={styles.hero} aria-labelledby="services-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> SERVICES / DEFENSIVE CYBER OPERATIONS</p>
            <h1 id="services-heading">Make risk<br /><span>worth acting on.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>ZeroDev helps organizations turn technical evidence into safer decisions, stronger controls, and more recoverable operations.</p>
            <p className={styles.heroBoundary}><strong>Authorized work only.</strong> Every assessment begins with scope, authority, safety boundaries, and an agreed evidence path.</p>
            <p><Link className={styles.primaryLink} href="/engage">Start with the authorized engagement brief <span aria-hidden="true">↗</span></Link><br /><a className={styles.primaryLink} href="#briefing-packs">Review service briefing packs <span aria-hidden="true">↓</span></a></p>
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
              <article className={`${styles.serviceCard} ${styles[`tone${service.tone}`]}`} id={`service-${service.number}`} key={service.number}>
                <div className={styles.cardTopline}><span>{service.number} / 08</span><span>ENGAGEMENT AREA</span></div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <p className={styles.audience}><strong>Best starting point:</strong> {service.audience}</p>
                <ul>{service.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
                <p className={styles.output}><strong>Typical output:</strong> {service.output}</p>
                <p className={styles.serviceCardAction}><a className={styles.primaryLink} href={`#brief-${service.number}`}>Review the service briefing pack <span aria-hidden="true">↓</span></a></p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.outputSection} id="briefing-packs" aria-labelledby="briefing-packs-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// SERVICE BRIEFING PACKS'}</p>
            <h2 id="briefing-packs-heading">Know the<br /><span>first boundary.</span></h2>
            <p>These synthetic service briefs help a buyer compare the decision, entry gate, representative output, and no-fit condition before a detailed proposal or sensitive exchange.</p>
            <p><Link className={styles.primaryLink} href="/deliverables">Review deliverable shapes <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/deliverables#evidence-request-map">Review evidence request map <span aria-hidden="true">↗</span></Link><br /><Link className={styles.primaryLink} href="/frameworks#service-framework-map">Review framework applicability <span aria-hidden="true">↗</span></Link></p>
          </div>
          <div className={styles.briefingPackGrid}>
            {serviceBriefs.map((brief) => (
              <article className={styles.briefingPackCard} id={`brief-${brief.number}`} key={brief.number}>
                <span className={styles.frameworkTag}>{brief.number} / SYNTHETIC BRIEF / NOT A PROPOSAL</span>
                <h3>{brief.title}</h3>
                <dl className={styles.briefingPackFacts}>
                  <div><dt>Decision</dt><dd>{brief.decision}</dd></div>
                  <div><dt>Entry gate</dt><dd>{brief.gate}</dd></div>
                  <div><dt>Typical output</dt><dd>{brief.output}</dd></div>
                </dl>
                <p className={styles.briefingPackBoundary}><strong>No-fit or owner gate:</strong> {brief.noFit}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.outputSection} aria-labelledby="decision-matrix-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// CAPABILITY DECISION MATRIX'}</p>
            <h2 id="decision-matrix-heading">Choose the evidence<br /><span>the decision needs.</span></h2>
            <p>These paths can overlap in one engagement, but they are not interchangeable. Start with the decision question, then agree the authority, scope, evidence, and accountable owner.</p>
          </div>
          <div className={styles.actionTableWrap}>
            <table className={`${styles.actionTable} ${styles.servicesMatrix}`}>
              <caption className={styles.tableCaption}>Capability decision matrix — illustrative scope, not a service guarantee.</caption>
              <thead>
                <tr>
                  <th scope="col">Engagement path</th>
                  <th scope="col">Decision question</th>
                  <th scope="col">Evidence lens</th>
                  <th scope="col">Typical accountable owner</th>
                  <th scope="col">Minimum entry gate</th>
                </tr>
              </thead>
              <tbody>
                {decisionMatrix.map(([path, question, evidence, owner, gate]) => (
                  <tr key={path}>
                    <td>{path}</td>
                    <td>{question}</td>
                    <td>{evidence}</td>
                    <td>{owner}</td>
                    <td>{gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      <SiteFooter />
    </main>
  );
}
