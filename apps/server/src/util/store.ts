import * as redis from 'redis';

import * as encrypt from './encrypt';
import { generateCodeVerifier } from './zoom-helpers';

/**
 * The auth token exchange happens before the Zoom App is launched. Therefore,
 * we need a place to store the tokens so we can later use them when a session
 * is established.
 *
 * We're using Redis here, but this could be replaced by a cache or other means
 * of persistence.
 */

const db = redis.createClient({
  url: process.env.REDIS_URL
})

db.connect().catch(console.error);

db.on('error', console.error);

export const getUser = async (zoomUserId: string) => {
  const user = await db.get(zoomUserId)
  if (!user) {
    console.log(
      'User not found.  This is normal if the user has added via In-Client (or if you have restarted Docker without closing and reloading the app)'
    )
    return Promise.reject('User not found')
  }
  return JSON.parse(encrypt.beforeDeserialization(user))
};

export const upsertUser = (zoomUserId: string, accessToken: string, refreshToken: string, expired_at: number) => {
  const isValidUser = Boolean(
    typeof zoomUserId === 'string' &&
    typeof accessToken === 'string' &&
    typeof refreshToken === 'string' &&
    typeof expired_at === 'number'
  )

  if (!isValidUser) {
    return Promise.reject('Invalid user input')
  }

  return db.set(
    zoomUserId,
    encrypt.afterSerialization(
      JSON.stringify({ accessToken, refreshToken, expired_at })
    )
  )
};

export const updateUser = async (zoomUserId: string, data: object) => {
  const userData = await db.get(zoomUserId)
  const existingUser = JSON.parse(encrypt.beforeDeserialization(userData))
  const updatedUser = { ...existingUser, ...data }

  return db.set(
    zoomUserId,
    encrypt.afterSerialization(JSON.stringify(updatedUser))
  )
};

export const logoutUser = async (zoomUserId: string) => {
  const reply = await db.get(zoomUserId)
  const decrypted = JSON.parse(encrypt.beforeDeserialization(reply))
  delete decrypted.thirdPartyAccessToken

  return db.set(
    zoomUserId,
    encrypt.afterSerialization(JSON.stringify(decrypted))
  )
};

export const deleteUser = (zoomUserId: string) => db.del(zoomUserId);

export const storeInvite = (invitationID: string, tabState: string) => {
  const dbKey = `invite:${invitationID}`
  return db.set(dbKey, tabState)
};

export const getInvite = (invitationID: string) => {
  const dbKey = `invite:${invitationID}`
  return db.get(dbKey)
};

export const createCounter = async () => {
  const id = generateCodeVerifier();

  const dbKey = `counter:${id}`;
  await db.set(dbKey, 0);

  return id;
}

export const getCounter = (id: string) => {
  const dbKey = `counter:${id}`;
  return db.get(dbKey);
}

export const incCounter = (id: string) => {
  const dbKey = `counter:${id}`;
  return db.incr(dbKey);
}

export const decCounter = (id: string) => {
  const dbKey = `counter:${id}`;
  return db.decr(dbKey);
}

export const createCounterInvite = (id: string, mid: string) => {
  const dbKey = `counterInvite:${mid}`;
  return db.set(dbKey, id);
}

export const getCounterInvite = (mid: string) => {
  const dbKey = `counterInvite:${mid}`;
  return db.get(dbKey);
}
