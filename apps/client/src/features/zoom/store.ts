/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx';
import zoomSdk, {
  OnConnectEvent,
  OnSendAppInvitationEvent,
  OnShareAppEvent,
  RunningContext,
  GetUserContextResponse
} from '@zoom/appssdk';

import { RootStore } from '../../app/store';

export default class ZoomStore {
  connected = false;
  preMeeting = true;
  runningContext: RunningContext | null = null;
  userContext: GetUserContextResponse | null = null;
  error: string | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this);
  }

  async configureSdk() {
    try {
      // Configure the JS SDK, required to call JS APIs in the Zoom App
      // These items must be selected in the Features -> Zoom App SDK -> Add APIs tool in Marketplace
      const configResponse = await zoomSdk.config({
        capabilities: [
          'setVirtualBackground',
          'removeVirtualBackground',
          'getSupportedJsApis',
          'openUrl',
          'getMeetingContext',
          'getRunningContext',
          'showNotification',
          'sendAppInvitationToAllParticipants',
          'sendAppInvitationToMeetingOwner',
          'showAppInvitationDialog',
          'getMeetingParticipants',
          'getMeetingUUID',
          'getMeetingJoinUrl',
          'listCameras',
          'expandApp',
          'allowParticipantToRecord',
          'getRecordingContext',
          'cloudRecording',
          'cloudRecording',
          'cloudRecording',
          'cloudRecording',
          'setVideoMirrorEffect',
          'setVideoMirrorEffect',
          'shareApp',
          'shareApp',

          // demo events
          'onSendAppInvitation',
          'onShareApp',
          'onActiveSpeakerChange',
          'onMeeting',

          // connect api and event
          'connect',
          'onConnect',
          'postMessage',
          'onMessage',

          // in-client api and event
          'authorize',
          'onAuthorized',
          'promptAuthorize',
          'getUserContext',
          'onMyUserContextChange',
          'sendAppInvitationToAllParticipants',
          'sendAppInvitation',
        ],
        version: '0.16.0',
      });

      console.log('App configured', configResponse);

      // The config method returns the running context of the Zoom App
      this.setRunningContext(configResponse.runningContext);
      // this.setUserContext(await zoomSdk.getUserContext());

      zoomSdk.removeEventListener('sendAppInvitation', this.onSendAppInvitation);
      zoomSdk.removeEventListener('shareApp', this.onShareApp);
      zoomSdk.addEventListener('sendAppInvitation', this.onSendAppInvitation);
      zoomSdk.addEventListener('shareApp', this.onShareApp);
    } catch (error) {
      console.log(error);
      this.setError('There was an error configuring the JS SDK');
    }
  }

  async connectInstances() {
    zoomSdk.removeEventListener('onConnect', this.onConnect);
    zoomSdk.addEventListener('onConnect', this.onConnect);

    await zoomSdk.connect();
    console.log('Connecting...');
  }

  private setRunningContext(value: RunningContext | null) {
    this.runningContext = value;
  }

  private setConnected(value: boolean) {
    this.connected = value;
  }

  private setUserContext(value: GetUserContextResponse | null) {
    this.userContext = value;
  }

  private setPreMeeting(value: boolean) {
    this.preMeeting = value;
  }

  private setError(value: string | null) {
    this.error = value;
  }

  private onSendAppInvitation(e: OnSendAppInvitationEvent) {
    console.log('onSendAppInvitation', e);
  }

  private onShareApp(e: OnShareAppEvent) {
    console.log('onShareApp', e);
  }

  private async onConnect(e: OnConnectEvent) {
    console.log('Connected');
    this.setConnected(true);

    // PRE-MEETING
    // first message to send after connecting instances is for the meeting
    // instance to catch up with the client instance
    if (this.preMeeting === true) {
      console.log('Letting client know meeting instance exists.');
      await this.sendMessage('connected', 'meeting');
      console.log("Adding message listener for client's current state.");

      const onMessageHandler = (message: any) => {
        console.log(
          'Message from client received. Meeting instance updating its state:',
          message.payload.payload
        );
        window.location.replace(message.payload.payload);
        zoomSdk.removeEventListener('onMessage', onMessageHandler);
        this.setPreMeeting(false); // meeting instance is finished with pre-meeting
      };

      zoomSdk.addEventListener('onMessage', onMessageHandler);
    }
  }

  private async sendMessage(msg: string, sender: string) {
    console.log(
      'Message sent from ' + sender + ' with data: ' + JSON.stringify(msg)
    );

    console.log('Calling postmessage...', msg);

    await zoomSdk.postMessage({ payload: msg });
  }
}
