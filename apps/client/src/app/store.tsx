import { createContext, useContext } from 'react'
import { observer } from 'mobx-react'

import ZoomStore from '../features/zoom/store';

export class RootStore {
  zoom: ZoomStore

  constructor() {
    this.zoom = new ZoomStore(this)
  }
}

const RootStoreContext = createContext(new RootStore())

const _RootStoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  )
}

export const RootStoreProvider = observer(_RootStoreProvider)

export const useStore = () => useContext(RootStoreContext)
