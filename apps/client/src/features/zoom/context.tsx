/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react';

import { apis } from './api';
import { useStore } from '../../app/store';

const ZoomContext = createContext(null);

const _ZoomProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useStore()
  const [counter, setCounter] = useState(0);
  // const [user, setUser] = useState(null);
  const [preMeeting, setPreMeeting] = useState(true); // start with pre-meeting code

  useEffect(() => {
    async function configureSdk() {
      // to account for the 2 hour timeout for config
      const configTimer = setTimeout(() => {
        setCounter(counter + 1);
      }, 120 * 60 * 1000);

      try {
        // Configure the JS SDK, required to call JS APIs in the Zoom App
        // These items must be selected in the Features -> Zoom App SDK -> Add APIs tool in Marketplace
        const configResponse = await zoomSdk.config({
          capabilities: [
            // apis demoed in the buttons
            ...apis.map((api) => api.name), // IMPORTANT

            // demo events
            "onSendAppInvitation",
            "onShareApp",
            "onActiveSpeakerChange",
            "onMeeting",

            // connect api and event
            "connect",
            "onConnect",
            "postMessage",
            "onMessage",

            // in-client api and event
            "authorize",
            "onAuthorized",
            "promptAuthorize",
            "getUserContext",
            "onMyUserContextChange",
            "sendAppInvitationToAllParticipants",
            "sendAppInvitation",
          ],
          version: "0.16.0",
        });

        console.log("App configured", configResponse);
        // The config method returns the running context of the Zoom App
        store.zoom.setRunningContext(configResponse.runningContext);
        store.zoom.setUserContextStatus(configResponse.auth.status);
        zoomSdk.onSendAppInvitation((data: any) => {
          console.log(data);
        });

        zoomSdk.onShareApp((data: any) => {
          console.log(data);
        });

      } catch (error) {
        console.log(error);
        store.zoom.setError("There was an error configuring the JS SDK");
      }
      return () => {
        clearTimeout(configTimer);
      };
    }
    configureSdk();
  }, [counter, store.zoom])

  async function sendMessage(msg: any, sender: any) {
    console.log(
      "Message sent from " + sender + " with data: " + JSON.stringify(msg)
    );
    console.log("Calling postmessage...", msg);
    await zoomSdk.postMessage({
      payload: msg,
    });
  }

  useEffect(() => {
    async function connectInstances() {
      // only can call connect when in-meeting
      if (store.zoom.runningContext === "inMeeting") {
        zoomSdk.addEventListener("onConnect", (event: any) => {
          console.log("Connected");
          store.zoom.setConnected(true);

          // PRE-MEETING
          // first message to send after connecting instances is for the meeting
          // instance to catch up with the client instance
          if (preMeeting === true) {
            console.log("Letting client know meeting instance exists.");
            sendMessage("connected", "meeting");
            console.log("Adding message listener for client's current state.");

            const on_message_handler_mtg = (message: any) => {
              console.log(
                "Message from client received. Meeting instance updating its state:",
                message.payload.payload
              );
              window.location.replace(message.payload.payload);
              zoomSdk.removeEventListener("onMessage", on_message_handler_mtg);
              setPreMeeting(false); // meeting instance is finished with pre-meeting
            };
            zoomSdk.addEventListener("onMessage", on_message_handler_mtg);
          }
        });

        await zoomSdk.connect();
        console.log("Connecting...");
      }
    }

    if (store.zoom.connected === false) {
      // console.log(runningContext, location.pathname);
      connectInstances();
    }
  }, [store.zoom, store.zoom.connected, preMeeting, store.zoom.runningContext]);

  return (
    <ZoomContext.Provider value={null} >
      {children}
    </ZoomContext.Provider>
  )
}

export const ZoomProvider = observer(_ZoomProvider);
