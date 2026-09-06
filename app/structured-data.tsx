const serviceTypes = [
  ['Authorized penetration testing', 'Authorized penetration testing under written scope, rules of engagement, and safety conditions.', '#service-01'],
  ['Vulnerability assessment', 'Evidence-led vulnerability assessment with asset context, prioritization, and treatment paths.', '#service-02'],
  ['Cyber risk management', 'Cyber-risk review, treatment options, residual-risk decisions, and review triggers.', '#service-03'],
  ['Technical due diligence', 'Technical architecture, dependency, delivery-practice, and resilience due diligence.', '#service-04'],
  ['Vendor due diligence', 'Supplier, subprocessor, access, incident, concentration, continuity, and exit-risk due diligence.', '#service-05'],
  ['Compliance readiness', 'Framework and requirement mapping to controls, evidence, gaps, owners, and treatment.', '#service-06'],
  ['Disaster recovery and BCP', 'Continuity, recovery assumptions, dependency review, exercises, and restore validation.', '#service-07'],
  ['Incident readiness', 'Incident roles, escalation, communications, bounded exercises, and lessons learned.', '#service-08'],
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://zerodevllc.com/#organization',
      name: 'ZeroDev LLC',
      url: 'https://zerodevllc.com',
      logo: 'https://zerodevllc.com/favicon.svg',
      email: 'mailto:hello@zerodevllc.com',
      description: 'Authorized defensive cybersecurity, cyber-risk, due-diligence, compliance-readiness, and operational-resilience services from Ireland.',
      areaServed: ['Ireland', 'European Union'],
      knowsAbout: serviceTypes.map(([name]) => name),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'security reporting',
        email: 'mailto:hello@zerodevllc.com',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://zerodevllc.com/#website',
      url: 'https://zerodevllc.com',
      name: 'ZeroDev LLC // Defensive cyber risk and resilience',
      description: 'Public information about authorized defensive cybersecurity and operational resilience services; a capability description does not create a certification, clearance, contract, or government appointment.',
      publisher: { '@id': 'https://zerodevllc.com/#organization' },
      inLanguage: 'en-IE',
    },
    {
      '@type': 'ItemList',
      '@id': 'https://zerodevllc.com/services#service-catalog',
      name: 'Authorized defensive cyber and resilience services',
      url: 'https://zerodevllc.com/services',
      numberOfItems: serviceTypes.length,
      itemListElement: serviceTypes.map(([name, description, anchor], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          '@id': `https://zerodevllc.com/services${anchor}`,
          name,
          serviceType: name,
          description,
          provider: { '@id': 'https://zerodevllc.com/#organization' },
          areaServed: ['Ireland', 'European Union'],
          url: `https://zerodevllc.com/services${anchor}`,
        },
      })),
    },
  ],
};

export default function StructuredData() {
  return <script id="zerodevllc-structured-data" type="application/ld+json">{JSON.stringify(structuredData)}</script>;
}
