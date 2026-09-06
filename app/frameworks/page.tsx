import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from '../site-header';
import SiteFooter from '../site-footer';
import RouteIndex from '../route-index';
import FrameworkLibrary, { type FrameworkLibraryClassNames } from '../framework-library';
import styles from '../services/services.module.css';

export const metadata: Metadata = {
  title: 'Frameworks and standards // ZeroDev LLC',
  description: 'A practical standards, CMMC, EU regulatory, and control-family library for cyber risk, testing, resilience, supply-chain, and readiness conversations.',
  alternates: { canonical: 'https://zerodevllc.com/frameworks' },
  openGraph: {
    title: 'Frameworks and standards // ZeroDev LLC',
    description: 'A practical standards, CMMC, EU regulatory, and control-family library for cyber risk, testing, resilience, supply-chain, and readiness conversations.',
    url: 'https://zerodevllc.com/frameworks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frameworks and standards // ZeroDev LLC',
    description: 'A practical standards, CMMC, EU regulatory, and control-family library for cyber risk, testing, resilience, supply-chain, and readiness conversations.',
    images: ['/og.png'],
  },
};

const frameworkReviewDate = '2026-09-06';

const frameworks = [
  ['NIST CSF 2.0', 'NIST', '2.0', 'Organize cybersecurity outcomes across Govern, Identify, Protect, Detect, Respond, and Recover.', 'Use it as an outcome and communication layer; it is not itself a certification.', 'NIST CSF 2.0 resource center', 'https://www.nist.gov/cyberframework'],
  ['NIST Risk Management Framework (SP 800-37 Rev. 2)', 'NIST', 'Rev. 2 / December 2018', 'Frame prepare, categorize, select, implement, assess, authorize, and monitor activities for system and organizational risk.', 'RMF language does not create an authorization to operate, authorizing-official decision, or agency approval.', 'NIST SP 800-37 Rev. 2', 'https://csrc.nist.gov/pubs/sp/800/37/r2/final'],
  ['NIST SP 800-115', 'NIST', 'Final / September 2008', 'Structure technical security testing, planning, execution, analysis, and reporting.', 'Apply it to an agreed testing scope and rules of engagement.', 'NIST SP 800-115', 'https://csrc.nist.gov/pubs/sp/800/115/final'],
  ['NIST SP 800-30 Rev. 1', 'NIST', 'Rev. 1 / September 2012', 'Support threat, vulnerability, likelihood, impact, and risk-assessment reasoning.', 'Risk scores require organizational context and evidence quality.', 'NIST SP 800-30 Rev. 1', 'https://csrc.nist.gov/pubs/sp/800/30/r1/final'],
  ['NIST SP 800-34 Rev. 1', 'NIST', 'Rev. 1 / updated November 2010', 'Frame contingency planning, recovery priorities, alternate operations, and testing.', 'A plan is not proof of recovery until it is exercised and evidenced.', 'NIST SP 800-34 Rev. 1', 'https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final'],
  ['NIST SP 800-53 Rev. 5', 'NIST', 'Rev. 5 / Release 5.2.0 published August 27, 2025', 'Map security and privacy control families to systems, owners, and evidence.', 'Control presence must be verified in the relevant system and scope.', 'NIST SP 800-53 Rev. 5', 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'],
  ['NIST SP 800-61 Rev. 3', 'NIST', 'Rev. 3', 'Structure incident-response preparation, handling, coordination, and lessons learned.', 'Incident readiness depends on people, authority, communications, and practice.', 'NIST SP 800-61 Rev. 3', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final'],
  ['NIST SP 800-161 Rev. 1', 'NIST', 'Rev. 1 / updates through 2024-11-01', 'Assess cyber-supply-chain risk across products, services, dependencies, and suppliers.', 'Vendor questionnaires alone are not sufficient evidence of supplier security.', 'NIST SP 800-161 Rev. 1', 'https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final'],
  ['NIST SP 800-171 Rev. 3 / 800-171A Rev. 3', 'NIST', 'Rev. 3 final / published May 14, 2024', 'Discuss protection and assessment of controlled unclassified information in applicable nonfederal systems.', 'Applicability, contract language, assessment method, and evidence expectations must be confirmed for each engagement.', 'NIST CUI publications (SP 800-171/171A Rev. 3)', 'https://csrc.nist.gov/Projects/protecting-controlled-unclassified-information/publications'],
  ['NIST SP 800-172 Rev. 3 / 800-172A Rev. 3', 'NIST', 'Rev. 3 final / published May 13, 2026', 'Frame enhanced CUI requirements and assessment procedures for critical programs and high-value assets when selected by the responsible federal agency.', 'Enhanced CUI requirements are contract- and mission-dependent; this reference does not create a certification, clearance, or federal authorization.', 'NIST CUI publications (SP 800-172/172A Rev. 3)', 'https://csrc.nist.gov/Projects/protecting-controlled-unclassified-information/publications'],
  ['CISA Cross-Sector Cybersecurity Performance Goals', 'CISA', 'Publisher-controlled current release; recheck latest', 'Prioritize voluntary, high-impact cybersecurity practices for critical-infrastructure risk reduction and measurable improvement.', 'CPGs are an orientation and prioritization aid, not a universal compliance result, sector designation, or regulator determination.', 'CISA Cybersecurity Performance Goals', 'https://www.cisa.gov/cybersecurity-performance-goals'],
  ['NCSC Cyber Assessment Framework 4.0', 'UK NCSC', '4.0 / page reviewed 2025-08-06', 'Frame outcome-based cyber resilience assessment for essential functions, critical infrastructure, and public-sector contexts.', 'CAF alignment is a scoped assessment conversation; it is not an NCSC endorsement, regulatory decision, or certification.', 'NCSC CAF collection', 'https://www.ncsc.gov.uk/collection/cyber-assessment-framework'],
  ['CIS Controls v8.1', 'Center for Internet Security', 'v8.1', 'Translate common defensive priorities into a practical control improvement sequence.', 'Control adoption should be tied to asset context, ownership, and evidence.', 'CIS Controls v8.1', 'https://www.cisecurity.org/controls/cis-controls-list'],
  ['OWASP testing guidance', 'OWASP', 'Publisher-controlled WSTG release', 'Support web, API, and application-security testing conversations and verification.', 'Testing remains authorized, bounded, and appropriate to the application and environment.', 'OWASP Web Security Testing Guide', 'https://wstg.owasp.org/'],
  ['ISO/IEC 27001:2022', 'ISO', '2022', 'Support information-security management, control, risk, and evidence discussions.', 'Readiness support does not create certification or an auditor’s opinion.', 'ISO/IEC 27001:2022', 'https://www.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/08/28/82875.html'],
  ['ISO 22301:2019 / ISO 31000:2018', 'ISO', '2019 + Amendment 1 (2024); to be revised / 2018', 'Frame continuity, risk, impact, decision, and improvement conversations.', 'Business continuity and risk management must reflect the organization’s actual objectives.', 'ISO 22301:2019', 'https://www.iso.org/standard/75106.html'],
  ['DoD CMMC Program', 'U.S. Department of Defense', 'DoD CIO current program page; recheck latest', 'Frame defense-industrial-base questions about FCI/CUI scope, contract requirements, safeguarding evidence, assessment route, and responsible owner.', 'CMMC applicability and required level depend on the solicitation or contract, information type, system boundary, flow-down, and current DoD rules; this page is not a CMMC assessment, certification, C3PAO, DIBCAC, or DoD authorization.', 'DoD CIO CMMC — About', 'https://dodcio.defense.gov/CMMC/about/'],
  ['EU NIS2 Directive (EU) 2022/2555', 'European Union', 'Directive (EU) 2022/2555 / EUR-Lex text', 'Frame cybersecurity risk-management, incident-reporting, supply-chain, and governance questions for entities that fall within scope.', 'Applicability depends on entity type, size, sector, national transposition, and competent authority; this reference is not a certification or legal determination.', 'EUR-Lex NIS2 Directive', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555'],
  ['EU DORA Regulation (EU) 2022/2554', 'European Union', 'Regulation (EU) 2022/2554 / in force', 'Frame ICT risk management, incident reporting, resilience testing, and ICT third-party risk for applicable financial entities.', 'Financial-sector scope, proportionality, supervisory expectations, and implementation requirements must be confirmed for the specific entity and service.', 'EUR-Lex DORA Regulation', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554'],
  ['EU GDPR Regulation (EU) 2016/679', 'European Union', 'Regulation (EU) 2016/679 / EUR-Lex text', 'Frame personal-data security, breach, processor, accountability, and data-governance questions alongside privacy and legal review.', 'GDPR is not a cybersecurity certification; roles, lawful basis, territorial scope, and obligations require the responsible privacy or legal owner.', 'EUR-Lex GDPR', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679'],
  ['EU Cyber Resilience Act (EU) 2024/2847', 'European Union', 'Regulation (EU) 2024/2847 / EUR-Lex text', 'Frame secure-by-design, vulnerability-handling, product-security, and economic-operator questions for products with digital elements.', 'Product scope, role, exemptions, obligations, and implementation timing require a specialist applicability review; this page is not a conformity assessment.', 'EUR-Lex Cyber Resilience Act', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R2847'],
  ['EU Critical Entities Resilience Directive (EU) 2022/2557', 'European Union', 'Directive (EU) 2022/2557 / EUR-Lex text', 'Frame continuity, physical and cyber resilience, dependency, incident, and recovery questions for critical entities that fall within scope.', 'Entity designation, sector, national implementation, risk measures, and competent-authority expectations must be confirmed; this is not a resilience designation or legal opinion.', 'EUR-Lex Critical Entities Resilience Directive', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2557'],
] as const;

const procurementRules = [
  'Confirm the jurisdiction, contract, data category, system boundary, and responsible authority.',
  'Map the requirement to evidence, owner, implementation state, and review date.',
  'Record what the control or framework does not prove.',
  'Separate technical readiness from certification, accreditation, legal advice, or procurement approval.',
];

const frameworkFreshnessRules = [
  'Version or edition labels describe the reference named for orientation; they are not a promise that the text remains current or applicable.',
  'Each card links to a primary publisher source. Recheck revision history, errata, withdrawal, replacement, and publisher-controlled releases before relying on it.',
  `Primary source labels and URLs were reviewed for this candidate on ${frameworkReviewDate}; that local review date is not certification, regulator validation, or an assessor opinion.`,
  'For EU legal or regulatory references, also confirm national transposition, delegated or implementing acts, effective dates, supervisory guidance, entity designation, and the responsible authority.',
  'For CMMC or defense-contract references, confirm the solicitation or contract clause, FCI/CUI flow, contractor information system boundary, required level, assessment route, flow-down, current DoD guidance, and responsible assessor or authority.',
  'At engagement start, confirm the current text, contract, jurisdiction, system scope, evidence owner, applicable assessor or authority, and required review method.',
] as const;

const frameworkCategory = (name: string) => {
  if (name.startsWith('EU ')) return 'EU / regulatory';
  if (name.includes('CMMC') || name.includes('800-171') || name.includes('800-172')) return 'Defense / CUI';
  if (name.includes('testing') || name.includes('800-115') || name.includes('OWASP')) return 'Testing';
  if (name.includes('800-34') || name.includes('800-61') || name.includes('22301') || name.includes('Cyber Assessment Framework')) return 'Resilience';
  if (name.includes('800-161')) return 'Supply chain';
  return 'Governance / controls';
};

const frameworkLibraryClassNames: FrameworkLibraryClassNames = {
  libraryShell: styles.libraryShell,
  libraryControls: styles.libraryControls,
  libraryControlTop: styles.libraryControlTop,
  librarySearch: styles.librarySearch,
  libraryResults: styles.libraryResults,
  libraryFilters: styles.libraryFilters,
  libraryFilter: styles.libraryFilter,
  frameworkGrid: styles.frameworkGrid,
  frameworkCard: styles.frameworkCard,
  frameworkTag: styles.frameworkTag,
  frameworkSource: styles.frameworkSource,
  frameworkFreshness: styles.frameworkFreshness,
  cardBoundary: styles.cardBoundary,
  referenceLink: styles.referenceLink,
  libraryEmpty: styles.libraryEmpty,
  libraryClear: styles.libraryClear,
};

const serviceFrameworkMap = [
  {
    service: 'Authorized penetration testing',
    references: ['NIST SP 800-115', 'OWASP testing guidance'],
    applicability: 'Is the proposed test scope, authority, method, and evidence path proportionate?',
    record: {
      evidence: 'Written authority, target inventory, exclusions, rules of engagement, safety contact, and approved handling path.',
      owner: 'Authority owner and security/service owner.',
      treatment: 'Remediate, accept, or defer each validated finding; ZeroDev records options, not acceptance.',
      retest: 'Scope change, remediation completion, or agreed retest window.',
    },
    boundary: 'Testing guidance does not grant authorization or prove that a system is secure.',
  },
  {
    service: 'Vulnerability assessment',
    references: ['NIST CSF 2.0', 'NIST SP 800-30 Rev. 1', 'CIS Controls v8.1'],
    applicability: 'How will an observed weakness become context, priority, ownership, and treatment?',
    record: {
      evidence: 'Asset inventory or scanner context, source date, criticality, permission, and an owner who can validate observations.',
      owner: 'Security, engineering, and asset owner.',
      treatment: 'Validate, prioritize, assign, mitigate, monitor, or record an authorized exception.',
      retest: 'Coverage change, patch/configuration change, or material exposure or threat change.',
    },
    boundary: 'A scanner result or control list is not, by itself, a validated finding or risk-acceptance decision.',
  },
  {
    service: 'Cyber risk management',
    references: ['NIST CSF 2.0', 'NIST Risk Management Framework (SP 800-37 Rev. 2)', 'NIST SP 800-30 Rev. 1', 'CISA Cross-Sector Cybersecurity Performance Goals'],
    applicability: 'What outcomes, risk criteria, evidence quality, and decision owner apply?',
    record: {
      evidence: 'Mission or business objective, risk criteria, important services, current controls, dependencies, and review date.',
      owner: 'Risk or executive owner with control owners.',
      treatment: 'Choose treatment, transfer, avoidance, monitoring, or residual-risk acceptance through the accountable owner.',
      retest: 'Decision review date, control change, mission change, or material threat and dependency change.',
    },
    boundary: 'A reference family is not a universal score, board decision, or residual-risk acceptance.',
  },
  {
    service: 'Technical due diligence',
    references: ['NIST CSF 2.0', 'NIST SP 800-53 Rev. 5', 'NIST SP 800-161 Rev. 1', 'EU GDPR Regulation (EU) 2016/679', 'EU Cyber Resilience Act (EU) 2024/2847'],
    applicability: 'Which architecture, control, dependency, product, data, or delivery questions could change the material decision?',
    record: {
      evidence: 'Architecture and data-flow context, delivery evidence, critical dependencies, resilience evidence, and open questions.',
      owner: 'Decision owner and technical lead.',
      treatment: 'Set conditions, request remediation, escalate an open question, or defer the decision with limitations recorded.',
      retest: 'Material architecture, product, provider, data-flow, or delivery-practice change.',
    },
    boundary: 'Reference alignment is not independent assurance and does not create a legal, financial, investment, or procurement verdict.',
  },
  {
    service: 'Vendor due diligence',
    references: ['NIST SP 800-161 Rev. 1', 'NIST CSF 2.0', 'CIS Controls v8.1', 'DoD CMMC Program', 'EU NIS2 Directive (EU) 2022/2555', 'EU DORA Regulation (EU) 2022/2554', 'EU GDPR Regulation (EU) 2016/679'],
    applicability: 'Does the supplier evidence fit the service, data, access, incident, concentration, exit, and applicable contract or regulatory relationship?',
    record: {
      evidence: 'Contract and service boundary, data flow, evidence dates, subprocessors, continuity, incident route, and exit assumptions.',
      owner: 'Procurement or third-party risk owner with the service owner.',
      treatment: 'Approve with conditions, mitigate, escalate, defer, or decline; ZeroDev does not approve the supplier.',
      retest: 'Renewal, material service or subprocessor change, incident, control expiry, or exit-plan change.',
    },
    boundary: 'A questionnaire or reference map is not supplier assurance, a CMMC status, a regulatory determination, or a procurement decision.',
  },
  {
    service: 'Government and defense readiness',
    references: ['NIST Risk Management Framework (SP 800-37 Rev. 2)', 'NIST SP 800-171 Rev. 3 / 800-171A Rev. 3', 'NIST SP 800-172 Rev. 3 / 800-172A Rev. 3', 'DoD CMMC Program', 'EU NIS2 Directive (EU) 2022/2555', 'EU Critical Entities Resilience Directive (EU) 2022/2557'],
    applicability: 'Which mission, solicitation or contract, FCI/CUI boundary, system boundary, required level, assessment route, critical-entity context, and authorizing role define the actual requirement?',
    record: {
      evidence: 'Solicitation or contract clauses, FCI/CUI flow, system boundary, required level, assessment route, designation, and authority.',
      owner: 'Responsible program authority and system owner, with the required assessor or authority.',
      treatment: 'Record remediation, exception, assessment route, flow-down, or authority referral; do not infer status from a framework name.',
      retest: 'Contract or data-flow change, boundary change, assessment rule update, or authority direction.',
    },
    boundary: 'Reference alignment is not an authorization to operate, CMMC status, clearance, contract award, critical-entity designation, or government approval.',
  },
  {
    service: 'Compliance readiness',
    references: ['NIST SP 800-53 Rev. 5', 'NIST Risk Management Framework (SP 800-37 Rev. 2)', 'NIST SP 800-171 Rev. 3 / 800-171A Rev. 3', 'NIST SP 800-172 Rev. 3 / 800-172A Rev. 3', 'DoD CMMC Program', 'ISO/IEC 27001:2022', 'EU NIS2 Directive (EU) 2022/2555', 'EU DORA Regulation (EU) 2022/2554', 'EU GDPR Regulation (EU) 2016/679', 'EU Cyber Resilience Act (EU) 2024/2847'],
    applicability: 'Which requirement applies, what evidence is expected, which legal, contracting, or supervisory role is relevant, and who owns the control or exception?',
    record: {
      evidence: 'Requirement or contract, jurisdiction, control inventory, implementation state, evidence owner, exception record, and CUI applicability decision where relevant.',
      owner: 'Compliance or control owner with the appropriate assessor, legal adviser, or authority.',
      treatment: 'Record remediation, exception, referral, assessment route, or certification path without claiming the outcome.',
      retest: 'Requirement/version change, evidence expiry, scope change, audit or assessment date, or control change.',
    },
    boundary: 'Readiness mapping is not certification, accreditation, clearance, CMMC status, legal advice, conformity assessment, or regulator approval.',
  },
  {
    service: 'Disaster recovery and BCP',
    references: ['NIST SP 800-34 Rev. 1', 'ISO 22301:2019 / ISO 31000:2018', 'NIST CSF 2.0', 'EU DORA Regulation (EU) 2022/2554', 'EU Critical Entities Resilience Directive (EU) 2022/2557'],
    applicability: 'What critical service, dependencies, recovery assumptions, regulatory context, and exercise evidence determine continuity?',
    record: {
      evidence: 'Business-impact context, critical-service map, dependencies, recovery assumptions, RTO/RPO discussion, and test result.',
      owner: 'Continuity or service owner with dependency owners.',
      treatment: 'Prioritize recoverability actions, alternate arrangements, capacity, dependency mitigation, or residual-risk review.',
      retest: 'Restore test, exercise, architecture/dependency change, or recovery-objective change.',
    },
    boundary: 'A plan, directive, or framework does not prove recovery until the relevant capability is exercised and evidenced.',
  },
  {
    service: 'Incident readiness',
    references: ['NIST SP 800-61 Rev. 3', 'NIST CSF 2.0', 'CISA Cross-Sector Cybersecurity Performance Goals', 'NCSC Cyber Assessment Framework 4.0', 'EU NIS2 Directive (EU) 2022/2555', 'EU DORA Regulation (EU) 2022/2554', 'EU GDPR Regulation (EU) 2016/679'],
    applicability: 'What roles, decisions, communications, evidence boundaries, reporting duties, and lessons must be practiced?',
    record: {
      evidence: 'Scenario, roles, escalation, communications path, evidence boundary, exercise authority, and participant record.',
      owner: 'Incident or executive owner with legal, privacy, and service authorities as applicable.',
      treatment: 'Approve lessons, improve controls, escalate reporting questions, and route live-incident decisions to the authorized channel.',
      retest: 'Exercise cadence, organization or technology change, contract/reporting change, or lessons-learned review.',
    },
    boundary: 'A readiness exercise is not live incident response, attribution, a breach notification decision, or a regulator determination.',
  },
] as const;

const frameworkReferenceByName = Object.fromEntries(
  frameworks.map(([name, publisher, version, , , sourceLabel, sourceHref]) => [name, { publisher, version, sourceLabel, sourceHref }]),
);

export default function FrameworksPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#frameworks-content">Skip to frameworks content</a>
      <SiteHeader
        ariaLabel="Framework navigation"
        current="/frameworks"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="frameworks-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="frameworks-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> FRAMEWORKS / EVIDENCE MAP</p>
            <h1 id="frameworks-heading">Map the rule.<br /><span>Prove the control.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>Frameworks help teams agree on outcomes, controls, evidence, and priorities. They do not replace scope, ownership, judgment, legal review, or testing.</p>
            <p className={styles.heroBoundary}><strong>Applicability is assessed.</strong> The right framework depends on jurisdiction, contract, data, service, system boundary, and organizational objective.</p>
          </div>
        </section>

        <RouteIndex ariaLabel="Frameworks page sections" pageIndexClassName={styles.pageIndex} pageIndexLabelClassName={styles.pageIndexLabel} sections={[
          { href: '#reference-control', number: '01', label: 'Reference control' },
          { href: '#standards-library', number: '02', label: 'Standards library' },
          { href: '#service-framework-map', number: '03', label: 'Service fit' },
          { href: '#procurement-governance', number: '04', label: 'Procurement' },
          { href: '#claims-control', number: '05', label: 'Claims control' },
        ]} />

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="reference-control" aria-labelledby="reference-control-heading">
          <div>
            <p className={styles.eyebrow}>{'// REFERENCE CURRENCY CONTROL'}</p>
            <h2 id="reference-control-heading">Keep the source<br /><span>current at the gate.</span></h2>
            <p className={styles.bodyCopy}>A framework name on a public page is an orientation signal, not a compliance result. Treat the publisher page, contract, jurisdiction, scope, and evidence owner as the source of truth at the start of each engagement.</p>
          </div>
          <div className={styles.checkList}>
            {frameworkFreshnessRules.map((rule, index) => <div key={rule}><span>{String(index + 1).padStart(2, '0')}</span><p>{rule}</p></div>)}
          </div>
        </section>

        <section className={`${styles.frameworkSection} ${styles.routeSection}`} id="standards-library" aria-labelledby="library-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// STANDARDS LIBRARY'}</p>
            <h2 id="library-heading">A useful map.<br /><span>Not a badge wall.</span></h2>
            <p>Use this library to frame a conversation, identify evidence, and choose a proportionate next action. Each card links to a primary publisher reference; confirm the current authoritative text and applicability before relying on a requirement.</p>
          </div>
          <FrameworkLibrary
            reviewDate={frameworkReviewDate}
            classNames={frameworkLibraryClassNames}
            frameworks={frameworks.map(([name, publisher, version, purpose, boundary, sourceLabel, sourceHref]) => ({
              name,
              publisher,
              version,
              purpose,
              boundary,
              sourceLabel,
              sourceHref,
              category: frameworkCategory(name),
            }))}
          />
        </section>

        <section className={`${styles.outputSection} ${styles.routeSection}`} id="service-framework-map" aria-labelledby="service-framework-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{'// SERVICE / FRAMEWORK FIT'}</p>
            <h2 id="service-framework-heading">Choose a reference.<br /><span>Confirm applicability.</span></h2>
            <p>This orientation map connects each service question to candidate reference families. It is not a formal crosswalk, audit plan, certification route, legal interpretation, or evidence of compliance.</p>
            <p><Link className={styles.primaryLink} href="/services#briefing-packs">Review the service briefing packs <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className={styles.actionTableWrap} tabIndex={0} role="region" aria-label="Service-to-framework orientation map table">
            <table className={`${styles.actionTable} ${styles.frameworkMap}`}>
              <caption className={styles.tableCaption}>Service-to-framework orientation map — confirm current publisher text, contract, jurisdiction, scope, authority, and evidence before relying on a reference.</caption>
              <thead>
                <tr>
                  <th scope="col">Service question</th>
                  <th scope="col">Candidate reference families</th>
                  <th scope="col">Applicability question</th>
                  <th scope="col">Applicability record</th>
                  <th scope="col">Boundary</th>
                </tr>
              </thead>
              <tbody>
                {serviceFrameworkMap.map(({ service, references, applicability, record, boundary }) => (
                  <tr key={service}>
                    <td>{service}</td>
                    <td>
                      <ul className={styles.fieldList}>
                        {references.map((referenceName) => {
                          const reference = frameworkReferenceByName[referenceName];
                          return <li key={referenceName}><a href={reference?.sourceHref ?? '#library-heading'} target={reference ? '_blank' : undefined} rel={reference ? 'noopener noreferrer' : undefined}>{reference?.sourceLabel ?? referenceName} <span aria-hidden="true">↗</span>{reference ? <span className="sr-only"> (opens in a new tab)</span> : null}</a></li>;
                        })}
                      </ul>
                    </td>
                    <td>{applicability}</td>
                    <td>
                      <dl className={styles.frameworkRecord}>
                        <div><dt>Evidence to confirm</dt><dd>{record.evidence}</dd></div>
                        <div><dt>Decision owner</dt><dd>{record.owner}</dd></div>
                        <div><dt>Treatment gate</dt><dd>{record.treatment}</dd></div>
                        <div><dt>Retest trigger</dt><dd>{record.retest}</dd></div>
                      </dl>
                    </td>
                    <td>{boundary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.twoColumn} ${styles.routeSection}`} id="procurement-governance" aria-labelledby="procurement-heading">
          <div>
            <p className={styles.eyebrow}>{'// PROCUREMENT / GOVERNANCE'}</p>
            <h2 id="procurement-heading">Make the<br /><span>scope explicit.</span></h2>
            <p className={styles.bodyCopy}>Government and defense-supplier work is strongest when the requirement, evidence, authority, and decision owner are visible before technical activity begins.</p>
          </div>
          <div className={styles.checkList}>
            {procurementRules.map((rule, index) => <div key={rule}><span>{String(index + 1).padStart(2, '0')}</span><p>{rule}</p></div>)}
          </div>
        </section>

        <section className={`${styles.noticeSection} ${styles.routeSection}`} id="claims-control" aria-labelledby="claims-heading">
          <p className={styles.eyebrow}>{'// CLAIMS CONTROL'}</p>
          <h2 id="claims-heading">Readiness support is not<br /><span>certification or clearance.</span></h2>
          <p>ZeroDev can help structure evidence, identify gaps, plan remediation, and prepare questions for an appropriate assessor, auditor, legal adviser, procurement owner, or authority. The site does not claim certification, accreditation, government approval, security clearance, or formal compliance without exact evidence.</p>
          <p><Link className={styles.primaryLink} href="/assurance#claims-proof">Check the claims-to-proof matrix <span aria-hidden="true">→</span></Link></p>
        </section>

        <section className={styles.cta} aria-labelledby="frameworks-cta-heading">
          <div><p className={styles.eyebrow}>{'// NEXT MOVE'}</p><h2 id="frameworks-cta-heading">Choose the<br /><span>decision to support.</span></h2></div>
          <div><p>Start with the requirement, the system, or the risk decision. Do not send secrets or sensitive evidence through ordinary email.</p><Link className={styles.primaryLink} href="/assurance">Review assurance boundaries <span aria-hidden="true">→</span></Link><br /><Link className={styles.primaryLink} href="/services">Review services <span aria-hidden="true">→</span></Link></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
