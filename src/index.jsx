/** @jsxRuntime classic */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { BacktraceClient, ErrorBoundary } from "@backtrace-labs/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        BacktraceClient.initialize({
          name: "Swag Store",
          version: "3.0.0",
          url: "https://submit.backtrace.io/UNIVERSE/TOKEN/json",
          userAttributes: () => ({
            user: currentUser(),
            shoppingCart: ShoppingCart.getCartContents(),
          }),
        });
        console.log("Backtrace Client initialized.");
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const passwordField = document.querySelector("input[type='password']");
    if (passwordField) {
      passwordField.value = "";
      passwordField.dispatchEvent(new Event("input", { bubbles: true }));
      passwordField.value = "secret_sauce";
      passwordField.dispatchEvent(new Event("input", { bubbles: true }));
      passwordField.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
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
      </Router>
    </ErrorBoundary>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorkerRegistration.register();