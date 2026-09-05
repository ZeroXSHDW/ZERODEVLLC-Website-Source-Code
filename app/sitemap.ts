import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://zerodevllc.com/' },
    { url: 'https://zerodevllc.com/privacy' },
  ];
}
