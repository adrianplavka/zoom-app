import axios from 'axios';

import * as zoomHelpers from './zoom-helpers';

export const getZoomAccessToken = async (
  zoomAuthorizationCode: string,
  redirect_uri = process.env.ZOOM_APP_REDIRECT_URI,
  pkceVerifier?: string
) => {
  const params = {
    grant_type: 'authorization_code',
    code: zoomAuthorizationCode,
    redirect_uri,
  };

  if (typeof pkceVerifier === 'string') {
    params['code_verifier'] = pkceVerifier;
  }

  const tokenRequestParamString = zoomHelpers.createRequestParamString(params);

  return await axios({
    url: `${process.env.ZOOM_HOST}/oauth/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.ZOOM_APP_CLIENT_ID,
      password: process.env.ZOOM_APP_CLIENT_SECRET,
    },
    data: tokenRequestParamString,
  });
};

export const refreshZoomAccessToken = async (zoomRefreshToken: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set('grant_type', 'refresh_token');
  searchParams.set('refresh_token', zoomRefreshToken);

  return await axios({
    url: `${process.env.ZOOM_HOST}/oauth/token?${searchParams.toString()}`,
    method: 'POST',
    auth: {
      username: process.env.ZOOM_APP_CLIENT_ID,
      password: process.env.ZOOM_APP_CLIENT_SECRET,
    },
  });
};

export const getZoomUser = async (accessToken: string) => {
  return await axios({
    url: `${process.env.ZOOM_HOST}/v2/users/me`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getDeeplink = async (accessToken: string) => {
  return await axios({
    url: `${process.env.ZOOM_HOST}/v2/zoomapp/deeplink`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      action: JSON.stringify({
        url: '/your/url',
        role_name: 'Owner',
        verified: 1,
        role_id: 0,
      }),
    },
  });
};
