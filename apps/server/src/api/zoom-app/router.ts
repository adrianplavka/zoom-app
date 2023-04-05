import { Router } from 'express';

import * as controller from './controller';

const router = Router();

router
  .get('/install', controller.install)
  .get('/auth', controller.auth)
  .get('/home', controller.home)
  .get('/authorize', controller.inClientAuthorize)
  .post('/onauthorized', controller.inClientOnAuthorized)

export default router;
