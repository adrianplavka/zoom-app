import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";

import { useStore } from "../app/store";
import { createCounter } from "../features/counter/api";

const HomePage = observer(() => {
  const navigate = useNavigate();
  const store = useStore();

  const onCreateCounter = useCallback(() => {
    async function create() {
      const { id } = await createCounter();
      navigate(`/counter/${id}`);
    }

    create()
  }, [navigate]);

  if (store.zoom.error) {
    console.log(store.zoom.error);

    return (
      <div className="App">
        <h1>{store.zoom.error}</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <p>
        {`User Context Status: ${JSON.stringify(store.zoom.userContext)}`}
      </p>

      <p>
        {store.zoom.runningContext ?
          `Running Context: ${store.zoom.runningContext}` :
          "Configuring Zoom JavaScript SDK..."
        }
      </p>

      <button onClick={onCreateCounter}>
        Create a counter
      </button>
    </div>
  );
});

export default HomePage;
