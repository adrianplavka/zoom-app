import { Router } from 'express';

import * as controller from './controller';

const router = Router();

router
  .get('/install', controller.install)
  .get('/auth', controller.auth)
  .get('/home', controller.home)
  .get('/authorize', controller.inClientAuthorize)
  .post('/onauthorized', controller.inClientOnAuthorized)
  .post('/counter', controller.newCounter)
  .get('/counter/invite', controller.getCounterInvite)
  .post('/counter/invite', controller.newCounterInvite)

export default router;
