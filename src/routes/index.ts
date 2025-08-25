// src/routes/index.ts

import { Express, Router } from 'express';

import { env } from '@/config';
import { userRouter } from '@/routes/auth.route';
import { workspaceRouter } from '@/routes/workspace.route';
import { projectsRouter } from '@/routes/projects.route';
import { queryRouter } from '@/routes/query.route';
import { assetsRouter } from '@/routes/asset.route';

interface AppRoute {
  path: string;
  router: Router;
  excludeAPIPrefix?: boolean;
}

const routes: AppRoute[] = [
  { path: '/auth', router: userRouter },
  { path: '/workspaces', router: workspaceRouter },
  { path: '/projects', router: projectsRouter },
  { path: '/query', router: queryRouter },
  { path: '/assets', router: assetsRouter },
];

export const registerRoutes = (app: Express): void => {
  routes.forEach(({ path, router, excludeAPIPrefix }) => {
    const routePath = excludeAPIPrefix ? path : `${env.API_PREFIX}${path}`;
    app.use(routePath, router);
  });
};
