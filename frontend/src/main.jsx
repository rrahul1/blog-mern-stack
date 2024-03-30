import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <PersistGate persistor={persistor}>
         <Provider store={store}>
            <App />
         </Provider>
      </PersistGate>
   </React.StrictMode>
);
