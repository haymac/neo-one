/* @flow */
import type { Context } from 'mali';

import compose from 'mali-compose';
import onError from 'mali-onerror';

import { getMonitor, setMonitor } from './common';

export default compose([
  async (ctx: Context, next: () => Promise<void>) => {
    const monitor = getMonitor(ctx);
    await monitor.captureSpanLog(span => setMonitor(ctx, span, () => next()), {
      name: 'request',
    });
  },
  onError((error: Error, ctx: Context) => {
    const monitor = getMonitor(ctx);
    monitor.logError({
      name: 'uncaught_request',
      message: 'Uncaught request error.',
      error,
    });
  }),
]);
