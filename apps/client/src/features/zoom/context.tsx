import { createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from '../../app/store';

const ZoomContext = createContext(null);

const _ZoomProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();
  const location = useLocation();

  // Zoom SDK needs to be re-configured everytime when the URL changes, as the
  // signed token is signed with the opening URL.
  useEffect(() => {
    store.zoom.configureSdk();
  }, [location.pathname, store.zoom])

  // When the running context of the Zoom has been changed to `inMeeting`, connect
  // the instance of the app to the Zoom SDK.
  useEffect(() => {
    store.zoom.runningContext === 'inMeeting' && store.zoom.connectInstances();
  }, [
    location.pathname,
    store.zoom,
    store.zoom.connected,
    store.zoom.runningContext
  ]);

  return (
    <ZoomContext.Provider value={null} >
      {children}
    </ZoomContext.Provider>
  )
}

export const ZoomProvider = observer(_ZoomProvider);
