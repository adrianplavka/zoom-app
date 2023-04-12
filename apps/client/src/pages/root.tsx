import { Outlet } from 'react-router-dom';

import { RootStoreProvider } from '../app/store';
import { ZoomProvider } from '../features/zoom/context';

const Root = () => (
  <RootStoreProvider>
    <ZoomProvider>
      <Outlet />
    </ZoomProvider>
  </RootStoreProvider>
)

export default Root;
