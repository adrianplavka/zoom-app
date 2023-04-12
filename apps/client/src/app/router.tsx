import { createBrowserRouter } from 'react-router-dom';

import Root from '../pages/root';
import HomePage from "../pages/home";
import CounterPage, { loader as counterLoader } from '../pages/counter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/counter/:id',
        element: <CounterPage />,
        loader: counterLoader
      }
    ]
  },
]);

export default router;
