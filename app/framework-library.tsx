'use client';

import { useEffect, useRef, useState } from 'react';

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
  libraryShareNote: string;
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

type FrameworkCategory = (typeof categories)[number];

type LibraryFilterState = {
  query: string;
  category: FrameworkCategory;
};

type FilterHistoryMode = 'push' | 'replace';

const readFilterState = (): LibraryFilterState => {
  if (typeof window === 'undefined') return { query: '', category: categories[0] };

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('category');
  const category = categories.includes(requestedCategory as FrameworkCategory)
    ? requestedCategory as FrameworkCategory
    : categories[0];

  return { query: params.get('q') ?? '', category };
};

const writeFilterState = (query: string, category: FrameworkCategory, historyMode: FilterHistoryMode) => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const normalizedQuery = query.trim();
  if (normalizedQuery) url.searchParams.set('q', normalizedQuery);
  else url.searchParams.delete('q');
  if (category === categories[0]) url.searchParams.delete('category');
  else url.searchParams.set('category', category);
  const nextLocation = `${url.pathname}${url.search}${url.hash}`;
  const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentLocation === nextLocation) return;
  if (historyMode === 'push') window.history.pushState(window.history.state, '', nextLocation);
  else window.history.replaceState(window.history.state, '', nextLocation);
};

export default function FrameworkLibrary({ frameworks, reviewDate, classNames }: FrameworkLibraryProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FrameworkCategory>(categories[0]);
  const queryHistoryActiveRef = useRef(false);
  const queryHistoryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const syncFilterState = () => {
      queryHistoryActiveRef.current = false;
      if (queryHistoryTimerRef.current !== null) {
        window.clearTimeout(queryHistoryTimerRef.current);
        queryHistoryTimerRef.current = null;
      }
      const next = readFilterState();
      setQuery(next.query);
      setCategory(next.category);
    };

    syncFilterState();
    window.addEventListener('popstate', syncFilterState);
    return () => {
      window.removeEventListener('popstate', syncFilterState);
      if (queryHistoryTimerRef.current !== null) window.clearTimeout(queryHistoryTimerRef.current);
    };
  }, []);

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    const historyMode = queryHistoryActiveRef.current ? 'replace' : 'push';
    queryHistoryActiveRef.current = true;
    writeFilterState(nextQuery, category, historyMode);
    if (queryHistoryTimerRef.current !== null) window.clearTimeout(queryHistoryTimerRef.current);
    queryHistoryTimerRef.current = window.setTimeout(() => {
      queryHistoryActiveRef.current = false;
      queryHistoryTimerRef.current = null;
    }, 700);
  };

  const handleCategoryChange = (nextCategory: FrameworkCategory) => {
    queryHistoryActiveRef.current = false;
    if (queryHistoryTimerRef.current !== null) {
      window.clearTimeout(queryHistoryTimerRef.current);
      queryHistoryTimerRef.current = null;
    }
    setCategory(nextCategory);
    writeFilterState(query, nextCategory, 'push');
  };

  const clearFilters = () => {
    queryHistoryActiveRef.current = false;
    if (queryHistoryTimerRef.current !== null) {
      window.clearTimeout(queryHistoryTimerRef.current);
      queryHistoryTimerRef.current = null;
    }
    setQuery('');
    setCategory(categories[0]);
    writeFilterState('', categories[0], 'push');
  };

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
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search framework, publisher, or decision question"
              aria-describedby="framework-library-hint"
            />
          </label>
          <p className={classNames.libraryResults} id="framework-library-hint" role="status" aria-live="polite">
            <strong>{filteredFrameworks.length}</strong> / {frameworks.length} {resultLabel} shown
            <span className={classNames.libraryShareNote}>FILTERS PERSIST IN LINK</span>
          </p>
        </div>
        <div className={classNames.libraryFilters} role="group" aria-label="Filter framework references by category">
          {categories.map((option) => (
            <button
              className={classNames.libraryFilter}
              type="button"
              aria-pressed={category === option}
              key={option}
              onClick={() => handleCategoryChange(option)}
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
          <button className={classNames.libraryClear} type="button" onClick={clearFilters}>
            Clear library filters <span aria-hidden="true">↺</span>
          </button>
        </div>
      )}
    </div>
  );
}
