/* eslint-disable @typescript-eslint/no-explicit-any */
import zoomSdk from '@zoom/appssdk';

export const invokeZoomAppsSdk = (api: any) => () => {
  const { name, buttonName = '', options = null } = api
  const zoomAppsSdkApi = (zoomSdk as any)[name].bind(zoomSdk)

  zoomAppsSdkApi(options)
    .then((clientResponse: any) => {
      console.log(`${buttonName || name} success with response: ${JSON.stringify(clientResponse)}`);
    })
    .catch((clientError: any) => {
      console.log(`${buttonName || name} error: ${JSON.stringify(clientError)}`);
    });
}
