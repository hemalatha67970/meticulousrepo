// Needed to add the below due to issues in IE11, see this thread
// https://github.com/facebook/create-react-app/issues/9906#issuecomment-720905753
/** @jsxRuntime classic */

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { tryLoadAndStartRecorder } from "@alwaysmeticulous/recorder-loader";
import { BacktraceClient, ErrorBoundary } from "@backtrace-labs/react";
import React from "react";
import ReactDOM from "react-dom/client"; // ✅ React 19 requires 'react-dom/client'
import { Route, BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import Cart from "./pages/Cart";
import CheckOutStepOne from "./pages/CheckOutStepOne";
import CheckOutStepTwo from "./pages/CheckOutStepTwo";
import Finish from "./pages/Finish";
import Inventory from "./pages/Inventory";
import InventoryItem from "./pages/InventoryItem";
import Login from "./pages/Login";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ROUTES } from "./utils/Constants";
import { currentUser } from "./utils/Credentials";
import { ShoppingCart } from "./utils/shopping-cart";
import { InventoryData } from "./utils/InventoryData.js";
import { InventoryDataLong } from "./utils/InventoryDataLong.js";

// Initialize Backtrace Client
BacktraceClient.initialize({
  name: "Swag Store",
  version: "3.0.0",
  url: "https://submit.backtrace.io/UNIVERSE/TOKEN/json",
  userAttributes: () => ({
    user: currentUser(),
    shoppingCart: ShoppingCart.getCartContents(),
  }),
});

// Function to start Meticulous Recorder and then render the app
(async function startApp() {
  try {
    await tryLoadAndStartRecorder({
      recordingToken: "vyBbclZ59wHhyNBeK3UuJbmiLFz3NUVSIwBtbIuC",
      isProduction: false,
    });
    console.log("Meticulous Recorder started successfully.");
  } catch (error) {
    console.error("Meticulous Recorder failed to start:", error);
  }

  // ✅ React 19 requires `createRoot` instead of `ReactDOM.render`
  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(
    <ErrorBoundary>
      <Router>
        <Route exact path={ROUTES.LOGIN} component={Login} />
        <Route path={ROUTES.INVENTORY} component={(props) => <Inventory data={InventoryData} {...props} />} />
        <Route path={ROUTES.INVENTORY_LONG} component={(props) => <Inventory data={InventoryDataLong} {...props} />} />
        <Route path={ROUTES.INVENTORY_LIST} component={InventoryItem} />
        <Route path={ROUTES.CART} component={Cart} />
        <Route path={ROUTES.CHECKOUT_STEP_ONE} component={CheckOutStepOne} />
        <Route path={ROUTES.CHECKOUT_STEP_TWO} component={CheckOutStepTwo} />
        <Route path={ROUTES.CHECKOUT_COMPLETE} component={Finish} />
      </Router>
    </ErrorBoundary>
  );

  console.log(ROUTES);
})();

// Register Service Worker
serviceWorkerRegistration.register();
