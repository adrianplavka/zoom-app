import axios from 'axios';

export const createCounter = async () => {
  const res = await axios.post('/api/zoomapp/counter');
  return res.data as { id: string };
}

export const createCounterInvite = (id: string, mid: string) => {
  return axios.post('/api/zoomapp/counter/invite', { id, mid });
}

export const getCounterInvite = async (mid: string) => {
  const res = await axios.get(`/api/zoomapp/counter/invite?mid=${mid}`);
  return res.data as { id: string | null };
}
