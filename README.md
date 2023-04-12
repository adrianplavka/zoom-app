# Zoom App Example

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

Zoom App Example covers a sample app using React & Express (w/ Vite).

Currently, the app covers the authentication flow w/ Zoom & displays this information to the client.

## Usage

Requirements:

- Docker
- Ngrok or Cloudflare Tunnel

### Setup .env files

Please see the .env.example file in the repository.

- Create a .env file by copying the example and filling in the values (under apps/client & apps/server directories)
  - If you are in development, use the Client ID and Client secret under Development
  - Lines starting with a '$' are terminal commands; you'll need the openssl program. Run the command in your terminal and capture the output, or you can use what those values are currently set at for now.
  - Note that the three 'AUTH0' - prefixed fields are optional - see instructions for the Third Party OAuth below. Leaving out any of these three values will disable this demonstration feature.

### Start your reverse proxy

Zoom Apps do not support localhost, and must be served over https. To develop locally, you need to tunnel traffic to this application via https, because the application runs in Docker containers serving traffic from http://localhost. You can use Ngrok to do this. Once installed you may run this command from your terminal:

```bash
ngrok http 3001
```

or

```bash
cloudflared tunnel --url http://localhost:3001
```

This will output the origin it has created for your tunnel, e.g. https://9a20-38-99-100-7.ngrok.io. You'll need to use this across your Zoom App configuration in the Zoom Marketplace (web) build flow (see below).

Please copy the https origin from the Ngrok terminal output and paste it in the PUBLIC_URL value in the .env file.

Please note that this ngrok URL will change once you restart ngrok (unless you purchased your own ngrok pro account). If you shut down your Ngrok (there's no harm to leaving it on), upon restart you'll need to copy and paste the new origin into the .env file AND also to your Marketplace build flow.

### Setup in Zoom Marketplace app build flow

The Zoom Marketplace build flow for a Zoom App may be found [here](https://marketplace.zoom.us/develop/create).  You will need a developer account with Zoom Apps enabled.

The following are steps to take in each of the tabs in the build flow...

#### App Credentials


If you enabled the "List app on Marketplace to be added by any Zoom user" toggle while creating your app on the Marketplace, you will see the following two sections: Development and Production.
Note: The above option should only be selected if you intend to publish the app to the marketplace. This option can be enabled later as well under the "Activation" tab. The "Activation" tab only appears if you have not selected to list the app to be published 

`your Ngrok origin` = ie. `https://9a20-38-99-100-7.ngrok.io`
Follow these instructions for the "Development" section
- Add `<your Ngrok origin>/api/zoomapp/home` in the Home URL field
- Copy and paste your Client ID and Client secret (from the "Development" section, not "Production" section) into the `.env` file for this application
- Add `<your Ngrok origin>/api/zoomapp/auth` in the Redirect URL for OAuth field
- Add `<your Ngrok origin>/api/zoomapp/auth` in the OAuth allow list
- Add `<your Ngrok origin>/api/zoomapp/proxy#/userinfo` in the OAuth allow list
  - Not needed if you are not using in-client oauth.  This is the exact window location where authorize method is invoked
- Add your Ngrok domain only (no protocol, eg `9a20-38-99-100-7.ngrok.io`) in the Domain allow list
- Add the SDK url `appssdk.zoom.us` in the Domain allow list
- Add `images.unsplash.com` to the Domain allow list
- Add any other required domains (eg `my-cdn.example.com`) in the Domain allow list*

*Important: All requests to domains **NOT** in the Domain allow list in the app's Marketplace build flow will be blocked in the Zoom Apps embedded browser.

#### Information

- Please fill out the developer contact name and developer contact email fields to test the application locally. In order to submit the application for review, you will need to fill out the rest of the fields. 

#### Features

- Under `Zoom App SDK` click **Add APIs**
  - For the purposes of this app, please add the following APIs and events:
    - `allowParticipantToRecord`
    - `authorize`
    - `cloudRecording`
    - `connect`
    - `expandApp`
    - `getMeetingContext`
    - `getMeetingJoinUrl`
    - `getMeetingParticipants`
    - `getMeetingUUID`
    - `getRecordingContext`
    - `getRunningContext`
    - `getSupportedjsApis`
    - `getUserContext`
    - `listCameras`
    - `onActiveSpeakerChange`
    - `onAuthorized`
    - `onConnect`
    - `onMeeting`
    - `onMessage`
    - `onMyUserContextChange`
    - `onSendAppInvitation`
    - `onShareApp`
    - `openUrl`
    - `postMessage`
    - `promptAuthorize`
    - `removeVirtualBackground`
    - `sendAppInvitation`
    - `shareApp`
    - `showAppInvitationDialog`
    - `sendAppInvitationToMeetingOwner`
    - `sendAppInvitationToAllParticipants`
    - `setVideoMirrorEffect`
    - `setVirtualBackground`
    - `showNotification`
  - Users will be asked to consent to these scopes during the add flow before being allowed to use the Zoom App
  - Important: The added or checked items must at least include those in the "capabilities" list in the call to zoomSdk.config in the embedded browser, eg frontend/src/App.js
- Select any additional features you would like to enable, eg Guest mode, In-client OAuth, Collaborate mode, etc. For this app, have Guest mode, In-client OAuth, and Collaborate Mode turned on.
  - Important: For legacy reasons, Guest mode is NOT enabled by default. Please make sure your app supports this - particularly relevant for applications live prior to June 2022. Newer applications will want to take advantage of these features from the start

#### Scopes

- Add the following Scopes required for this Advanced Sample Zoom App: `zoomapp:inmeeting`, `user:read`
  - The Scopes referred to here are for the Zoom API - they are not exclusive to Zoom Apps. Please find documentation for the Zoom API [here](https://marketplace.zoom.us/docs/api-reference/introduction)
  - As with the Zoom App SDK APIs and events from the 'Features' tab, scopes selected here will be presented to users for consent before they may use the Zoom App.


## Start developing

### Start containers

- Use the `docker-compose` tool from the root directory to start Redis container.

### Start applications

- Use the `npx nx serve client` & `npx nx serve server` to start client building & server.

### Install the app

Before proceeding, make sure to:
  - Log in to zoom.us on the web (if not already signed in there)
  - Make sure the user matches the user you've used to log in to the Zoom client 
  - While developing, make sure the user is in the developer account

To install your app and open it the Zoom client's embedded browser, visit:

```
<your Ngrok origin>/api/zoomapp/install
```
 
Any errors you encounter during the add flow are likely related to user mismatches or different/non-developer accounts.  You may also want to double check that your Client ID and Client secret (in the `.env` file) are up to date.
