export const serviceRoutes = [
  {
    slug: 'authorized-penetration-testing',
    tag: 'AUTHORIZED PENETRATION TESTING',
    title: 'Authorized penetration testing',
    briefPrompt: 'Which agreed attack surface or testing decision must become clearer?',
    briefGate: 'Name the written authority, in-scope assets, safety contact, and stop conditions before technical activity.',
  },
  {
    slug: 'vulnerability-assessment',
    tag: 'VULNERABILITY ASSESSMENT',
    title: 'Vulnerability assessment',
    briefPrompt: 'Which asset, configuration, or dependency needs priority and verified treatment?',
    briefGate: 'Name the asset boundary, permission to assess, source or inventory context, and evidence owner.',
  },
  {
    slug: 'cyber-risk-management',
    tag: 'CYBER RISK MANAGEMENT',
    title: 'Cyber risk management',
    briefPrompt: 'Which risk needs a treatment, acceptance, transfer, avoidance, or monitoring decision?',
    briefGate: 'Name the decision owner, risk criteria, control evidence, and authority for treatment.',
  },
  {
    slug: 'technical-due-diligence',
    tag: 'TECHNICAL DUE DILIGENCE',
    title: 'Technical due diligence',
    briefPrompt: 'Which technical condition could change an important program, supplier, or investment decision?',
    briefGate: 'Name the decision, review boundary, permitted evidence sources, and technical owner.',
  },
  {
    slug: 'vendor-due-diligence',
    tag: 'VENDOR DUE DILIGENCE',
    title: 'Vendor due diligence',
    briefPrompt: 'Does the supplier evidence fit the service, data, access, incident, and exit relationship?',
    briefGate: 'Name the supplier relationship, service or data boundary, procurement owner, and evidence contact.',
  },
  {
    slug: 'compliance-readiness',
    tag: 'COMPLIANCE READINESS',
    title: 'Compliance readiness',
    briefPrompt: 'What requirement applies, what evidence exists, and what remains to be addressed?',
    briefGate: 'Name the applicable contract, framework, jurisdiction, control owner, and evidence boundary.',
  },
  {
    slug: 'disaster-recovery-bcp',
    tag: 'DISASTER RECOVERY / BCP',
    title: 'Disaster recovery and BCP',
    briefPrompt: 'Can the critical service continue and recover under the agreed disruption scenario?',
    briefGate: 'Name the critical service, disruption scenario, dependency owner, recovery assumptions, and exercise authority.',
  },
  {
    slug: 'incident-readiness',
    tag: 'INCIDENT READINESS',
    title: 'Incident readiness',
    briefPrompt: 'Can the organization make safe decisions, coordinate, preserve evidence, and improve after an exercise?',
    briefGate: 'Name the scenario, participants, escalation owner, evidence boundary, and exercise authorization.',
  },
] as const;

export type ServiceRoute = (typeof serviceRoutes)[number];

export function getServiceRoute(slug: string | undefined): ServiceRoute | undefined {
  return serviceRoutes.find((route) => route.slug === slug);
}
