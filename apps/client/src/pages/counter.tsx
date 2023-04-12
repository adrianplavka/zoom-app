import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import zoomSdk from '@zoom/appssdk';

import { useStore } from "../app/store";
import { createCounterInvite } from "../features/counter/api";

export function loader(args: LoaderFunctionArgs) {
  return args.params.id as string;
}

const CounterPage = observer(() => {
  const store = useStore();
  const [counter, setCounter] = useState<number | null>(null);
  const counterId = useLoaderData() as ReturnType<typeof loader>;
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(window.location.origin.replace(/http/, 'ws'));

    socket.current.addEventListener('open', () => {
      socket.current?.send(`getCounter:${counterId}`);
    });

    socket.current.addEventListener('message', (message: MessageEvent<string>) => {
      const [type, payload] = message.data.split(':');

      switch (type) {
        case "counter":
          setCounter(Number(payload));
          break;

        default:
          break;
      }
    });

    return () => socket.current?.close();
  }, [counterId, socket, store.zoom]);

  const sendCounterInvitation = useCallback(async () => {
    const res = await zoomSdk.sendAppInvitationToAllParticipants();

    await createCounterInvite(counterId, res.invitationUUID);
  }, [counterId]);

  const incCounter = useCallback(() =>
    socket.current?.send(`incCounter:${counterId}`),
    [socket, counterId]
  );

  const decCounter = useCallback(() =>
    socket.current?.send(`decCounter:${counterId}`),
    [socket, counterId]
  );

  return (
    <div>
      <Link to='/'>
        <button>Go home</button>
      </Link>

      <p>Counter ID: {counterId}</p>

      <p>Counter value: {counter}</p>

      <button onClick={sendCounterInvitation}>
        Send counter invitation
      </button>

      <button onClick={incCounter}>
        Increment counter
      </button>

      <button onClick={decCounter}>
        Decrement counter
      </button>
    </div>
  );
});

export default CounterPage;
