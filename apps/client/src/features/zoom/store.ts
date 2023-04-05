import { makeAutoObservable } from 'mobx';

import { RootStore } from '../../app/store';

export default class ZoomStore {
  runningContext: string | null = null;
  connected = false;
  userContextStatus = ""
  error: string | null = null

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this)
  }

  setRunningContext(value: string | null) {
    this.runningContext = value;
  }

  setConnected(value: boolean) {
    this.connected = value;
  }

  setUserContextStatus(value: string) {
    this.userContextStatus = value;
  }

  setError(value: string | null) {
    this.error = value;
  }
}
