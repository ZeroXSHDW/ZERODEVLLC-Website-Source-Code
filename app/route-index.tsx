'use client';

import { useEffect, useMemo, useState } from 'react';

export type RouteIndexSection = {
  href: `#${string}`;
  number: string;
  label: string;
};

type RouteIndexProps = {
  ariaLabel: string;
  pageIndexClassName: string;
  pageIndexLabelClassName: string;
  sections: readonly RouteIndexSection[];
};

export default function RouteIndex({ ariaLabel, pageIndexClassName, pageIndexLabelClassName, sections }: RouteIndexProps) {
  const sectionsKey = JSON.stringify(sections);
  const stableSections = useMemo(() => JSON.parse(sectionsKey) as RouteIndexSection[], [sectionsKey]);
  const [activeSection, setActiveSection] = useState(sections[0]?.href ?? '');

  useEffect(() => {
    const syncHash = () => {
      const nextHash = window.location.hash as `#${string}`;
      if (stableSections.some((section) => section.href === nextHash)) setActiveSection(nextHash);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);

    const sectionTargets = stableSections
      .map((section) => document.getElementById(section.href.slice(1)))
      .filter((target): target is HTMLElement => Boolean(target));

    if (!('IntersectionObserver' in window) || sectionTargets.length === 0) {
      return () => window.removeEventListener('hashchange', syncHash);
    }

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibility.set(`#${entry.target.id}`, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const nextSection = stableSections
        .map((section) => ({ href: section.href, ratio: visibility.get(section.href) ?? 0 }))
        .sort((left, right) => right.ratio - left.ratio)
        .find((section) => section.ratio > 0);

      if (nextSection) setActiveSection(nextSection.href);
    }, { rootMargin: '-150px 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    sectionTargets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncHash);
    };
  }, [stableSections]);

  return (
    <nav className={pageIndexClassName} aria-label={ariaLabel}>
      <p className={pageIndexLabelClassName}>{'// ROUTE INDEX'}</p>
      <ol>
        {sections.map((section) => (
          <li key={section.href}>
            <a href={section.href} aria-current={activeSection === section.href ? 'location' : undefined} onClick={() => setActiveSection(section.href)}>
              <span>{section.number}</span>{section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
