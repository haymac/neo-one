/* @flow */
import type { Blockchain } from '@neo-one/node-core';
import type { Context } from 'koa';

import mount from 'koa-mount';

import checkReady, { type Options as CheckReadyOptions } from './checkReady';
import { getMonitor, simpleMiddleware } from './common';

export type Options = CheckReadyOptions;

export default ({
  blockchain,
  options,
}: {|
  blockchain: Blockchain,
  options: Options,
|}) =>
  simpleMiddleware(
    'readyHealthCheck',
    mount('/ready_health_check', async (ctx: Context) => {
      const monitor = getMonitor(ctx);
      const counter = monitor.getCounter({
        name: 'ready_health_check',
        labelNames: [monitor.labels.ERROR],
      });
      const ready = await checkReady({ monitor, blockchain, options });
      if (ready) {
        ctx.status = 200;
        counter.inc({ [monitor.labels.ERROR]: false });
      } else {
        ctx.status = 500;
        counter.inc({ [monitor.labels.ERROR]: true });
      }
    }),
  );
