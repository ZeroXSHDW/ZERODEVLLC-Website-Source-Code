import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://zerodevllc.com/' },
    { url: 'https://zerodevllc.com/services' },
    { url: 'https://zerodevllc.com/methodology' },
    { url: 'https://zerodevllc.com/frameworks' },
    { url: 'https://zerodevllc.com/engage' },
    { url: 'https://zerodevllc.com/deliverables' },
    { url: 'https://zerodevllc.com/sectors' },
    { url: 'https://zerodevllc.com/remediation' },
    { url: 'https://zerodevllc.com/privacy' },
  ];
}
