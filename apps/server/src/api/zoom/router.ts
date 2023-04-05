import { Router } from 'express';

import * as controller from './controller';
import * as middleware from './middleware'

const router = Router();

router.use(
  '/api',
  middleware.getUser,
  middleware.refreshToken,
  middleware.setZoomAuthHeader,
  controller.proxy
);

export default router;
