#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { StaticSiteStack } from '../src/static-site-stack';

const app = new App();

new StaticSiteStack(app, 'RetroPieStatsViewerStack', {
  /* You can provide env here or rely on default account/region via AWS profile */
});
