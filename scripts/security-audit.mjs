import { spawn } from 'node:child_process';

export const DEFAULT_TIMEOUT_MS = 300_000;

export function parseTimeoutMs(raw = process.env.NPM_AUDIT_TIMEOUT_MS) {
  const timeoutMs = Number(raw ?? DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('NPM_AUDIT_TIMEOUT_MS must be a finite positive number');
  }
  return timeoutMs;
}

export function runAudit({
  command = process.platform === 'win32' ? 'npm.cmd' : 'npm',
  args = ['audit', '--audit-level=moderate'],
  timeoutMs = parseTimeoutMs(),
} = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      detached: process.platform !== 'win32',
      stdio: 'inherit',
    });
    let timedOut = false;
    let settled = false;
    let escalationTimer;

    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === 'win32' || !child.pid) {
        child.kill();
        return;
      }
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch (error) {
        if (error?.code !== 'ESRCH') child.kill('SIGTERM');
      }
      escalationTimer = setTimeout(() => {
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch (error) {
          if (error?.code !== 'ESRCH') child.kill('SIGKILL');
        }
      }, 5_000);
      escalationTimer.unref();
    }, timeoutMs);

    const finish = (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (escalationTimer) clearTimeout(escalationTimer);
      resolve(timedOut ? 124 : exitCode ?? 1);
    };

    child.once('error', (error) => {
      if (!timedOut) console.error(`npm audit could not start: ${error.message}`);
      finish(1);
    });
    child.once('close', (exitCode) => finish(exitCode));
  });
}

const invokedScript = process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href;

if (invokedScript) {
  let timeoutMs;
  try {
    timeoutMs = parseTimeoutMs();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
  if (timeoutMs) {
    process.exitCode = await runAudit({ timeoutMs });
  }
}
