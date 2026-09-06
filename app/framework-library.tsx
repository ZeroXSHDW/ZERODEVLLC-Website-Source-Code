'use client';

import { useState } from 'react';

export type FrameworkLibraryEntry = {
  name: string;
  publisher: string;
  version: string;
  purpose: string;
  boundary: string;
  sourceLabel: string;
  sourceHref: string;
  category: string;
};

export type FrameworkLibraryClassNames = {
  libraryShell: string;
  libraryControls: string;
  libraryControlTop: string;
  librarySearch: string;
  libraryResults: string;
  libraryFilters: string;
  libraryFilter: string;
  frameworkGrid: string;
  frameworkCard: string;
  frameworkTag: string;
  frameworkSource: string;
  frameworkFreshness: string;
  cardBoundary: string;
  referenceLink: string;
  libraryEmpty: string;
  libraryClear: string;
};

type FrameworkLibraryProps = {
  frameworks: readonly FrameworkLibraryEntry[];
  reviewDate: string;
  classNames: FrameworkLibraryClassNames;
};

const categories = [
  'All references',
  'Governance / controls',
  'Defense / CUI',
  'EU / regulatory',
  'Testing',
  'Resilience',
  'Supply chain',
] as const;

export default function FrameworkLibrary({ frameworks, reviewDate, classNames }: FrameworkLibraryProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All references');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredFrameworks = frameworks.filter((framework) => {
    const matchesCategory = category === 'All references' || framework.category === category;
    const searchText = [
      framework.name,
      framework.publisher,
      framework.version,
      framework.purpose,
      framework.boundary,
      framework.sourceLabel,
      framework.category,
    ].join(' ').toLowerCase();
    return matchesCategory && (!normalizedQuery || searchText.includes(normalizedQuery));
  });
  const resultLabel = filteredFrameworks.length === 1 ? 'reference' : 'references';

  return (
    <div className={classNames.libraryShell}>
      <div className={classNames.libraryControls} aria-label="Standards library controls">
        <div className={classNames.libraryControlTop}>
          <label className={classNames.librarySearch} htmlFor="framework-library-search">
            <span aria-hidden="true">⌕</span>
            <input
              id="framework-library-search"
              type="search"
              aria-label="Search framework references"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search framework, publisher, or decision question"
              aria-describedby="framework-library-hint"
            />
          </label>
          <p className={classNames.libraryResults} id="framework-library-hint" role="status" aria-live="polite">
            <strong>{filteredFrameworks.length}</strong> / {frameworks.length} {resultLabel} shown
          </p>
        </div>
        <div className={classNames.libraryFilters} role="group" aria-label="Filter framework references by category">
          {categories.map((option) => (
            <button
              className={classNames.libraryFilter}
              type="button"
              aria-pressed={category === option}
              key={option}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filteredFrameworks.length > 0 ? (
        <div className={classNames.frameworkGrid} id="framework-library-results">
          {filteredFrameworks.map((framework) => (
            <article className={classNames.frameworkCard} key={framework.name}>
              <span className={classNames.frameworkTag}>REFERENCE / {framework.category.toUpperCase()}</span>
              <h3>{framework.name}</h3>
              <dl className={classNames.frameworkSource} aria-label={`${framework.name} reference details`}>
                <div><dt>Publisher</dt><dd>{framework.publisher}</dd></div>
                <div><dt>Version / edition named</dt><dd>{framework.version}</dd></div>
              </dl>
              <p className={classNames.frameworkFreshness}><strong>Source check:</strong> {reviewDate} / recheck before use</p>
              <p>{framework.purpose}</p>
              <p className={classNames.cardBoundary}><strong>Boundary:</strong> {framework.boundary}</p>
              <a className={classNames.referenceLink} href={framework.sourceHref} target="_blank" rel="noopener noreferrer" aria-label={`${framework.name} primary reference; opens in a new tab`}>{framework.sourceLabel} <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      ) : (
        <div className={classNames.libraryEmpty} role="status" aria-live="polite">
          <p><strong>No reference matches that route.</strong> Try a broader term or return to the full library.</p>
          <button className={classNames.libraryClear} type="button" onClick={() => { setQuery(''); setCategory('All references'); }}>
            Clear library filters <span aria-hidden="true">↺</span>
          </button>
        </div>
      )}
    </div>
  );
}
