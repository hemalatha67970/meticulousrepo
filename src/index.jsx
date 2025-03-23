/** @jsxRuntime classic */
/** @jsxRuntime classic */
import "react-app-polyfill/ie11";
//import { BacktraceClient } from "@backtrace/react";
import "react-app-polyfill/stable";
import { BacktraceClient, ErrorBoundary } from "@backtrace/react";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ROUTES } from "./utils/Constants";
import { currentUser } from "./utils/Credentials";
import { ShoppingCart } from "./utils/shopping-cart";
import { InventoryData } from "./utils/InventoryData.js";
import { InventoryDataLong } from "./utils/InventoryDataLong.js";

// Lazy load pages for better performance
const Cart = React.lazy(() => import("./pages/Cart"));
const CheckOutStepOne = React.lazy(() => import("./pages/CheckOutStepOne"));
const CheckOutStepTwo = React.lazy(() => import("./pages/CheckOutStepTwo"));
const Finish = React.lazy(() => import("./pages/Finish"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const InventoryItem = React.lazy(() => import("./pages/InventoryItem"));
const Login = React.lazy(() => import("./pages/Login"));

// ✅ Explicitly initialize BacktraceClient before rendering the app
const backtraceClient = new BacktraceClient({
  name: "Swag Store",
  version: "3.0.0",
  url: "https://submit.backtrace.io/UNIVERSE/TOKEN/json",
  userAttributes: () => ({
    user: currentUser(),
    shoppingCart: ShoppingCart.getCartContents(),
  }),
});

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.INVENTORY} element={<Inventory data={InventoryData} />} />
              <Route path={ROUTES.INVENTORY_LONG} element={<Inventory data={InventoryDataLong} />} />
              <Route path={ROUTES.INVENTORY_LIST} element={<InventoryItem />} />
              <Route path={ROUTES.CART} element={<Cart />} />
              <Route path={ROUTES.CHECKOUT_STEP_ONE} element={<CheckOutStepOne />} />
              <Route path={ROUTES.CHECKOUT_STEP_TWO} element={<CheckOutStepTwo />} />
              <Route path={ROUTES.CHECKOUT_COMPLETE} element={<Finish />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorkerRegistration.register();
