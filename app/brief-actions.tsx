'use client';

import { useState } from 'react';

export type BriefActionClassNames = {
  group: string;
  link: string;
  button: string;
  status: string;
};

type BriefActionsProps = {
  mailtoHref: string;
  copyText: string;
  linkLabel: string;
  classNames: BriefActionClassNames;
};

export default function BriefActions({ mailtoHref, copyText, linkLabel, classNames }: BriefActionsProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle');

  const copyBrief = async () => {
    if (!navigator.clipboard?.writeText) {
      setStatus('unavailable');
      return;
    }

    try {
      await navigator.clipboard.writeText(copyText);
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
  };

  return (
    <div className={classNames.group}>
      <a className={classNames.link} href={mailtoHref}>{linkLabel} <span aria-hidden="true">↗</span></a>
      <button className={classNames.button} type="button" onClick={() => void copyBrief()} aria-label="Copy the safe high-level brief to the clipboard">
        Copy safe brief <span aria-hidden="true">⧉</span>
      </button>
      {status === 'copied' ? <span className={classNames.status} role="status" aria-live="polite">Copied safe brief.</span> : null}
      {status === 'unavailable' ? <span className={classNames.status} role="status" aria-live="polite">Clipboard unavailable here; use the email template.</span> : null}
    </div>
  );
}
