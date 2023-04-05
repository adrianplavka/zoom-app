import { observer } from "mobx-react";

import { useStore } from "./store";

const App = observer(() => {
  const store = useStore()

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
      <p>{`User Context Status: ${store.zoom.userContextStatus}`}</p>
      <p>
        {store.zoom.runningContext ?
          `Running Context: ${store.zoom.runningContext}` :
          "Configuring Zoom JavaScript SDK..."
        }
      </p>
    </div>
  );
})

export default App;
