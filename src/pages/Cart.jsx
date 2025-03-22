import React from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of withRouter
import { ROUTES } from "../utils/Constants";
import { ShoppingCart } from "../utils/shopping-cart";
import { InventoryData } from "../utils/InventoryData";
import CartItem from "../components/CartItem";
import SwagLabsFooter from "../components/Footer";
import HeaderContainer from "../components/HeaderContainer";
import Button, { BUTTON_SIZES, BUTTON_TYPES } from "../components/Button";
import "./Cart.css";
import { isVisualUser } from "../utils/Credentials";

const Cart = () => {
  const navigate = useNavigate(); // Replaces history.push
  const contents = ShoppingCart.getCartContents();
  const buttonClass = `checkout_button ${isVisualUser() ? "btn_visual_failure" : ""}`;

  return (
    <div id="page_wrapper" className="page_wrapper">
      <div id="contents_wrapper">
        <HeaderContainer secondaryTitle="Your Cart" />
        <div
          id="cart_contents_container"
          className="cart_contents_container"
          data-test="cart-contents-container"
        >
          <div>
            <div className="cart_list" data-test="cart-list">
              <div
                className="cart_quantity_label"
                data-test="cart-quantity-label"
              >
                QTY
              </div>
              <div className="cart_desc_label" data-test="cart-desc-label">
                Description
              </div>
              {contents.map((item, i) => (
                <CartItem key={i} item={InventoryData[item]} showButton />
              ))}
            </div>
            <div className="cart_footer">
              <Button
                label="Continue Shopping"
                onClick={(evt) => {
                  evt.preventDefault();
                  navigate(ROUTES.INVENTORY); // Use navigate instead of history.push
                }}
                size={BUTTON_SIZES.MEDIUM}
                testId="continue-shopping"
                type={BUTTON_TYPES.BACK}
              />
              <Button
                label="Checkout"
                customClass={buttonClass}
                onClick={(evt) => {
                  evt.preventDefault();
                  navigate(ROUTES.CHECKOUT_STEP_ONE); // Use navigate instead of history.push
                }}
                size={BUTTON_SIZES.MEDIUM}
                testId="checkout"
                type={BUTTON_TYPES.ACTION}
              />
            </div>
          </div>
        </div>
      </div>
      <SwagLabsFooter />
    </div>
  );
};

export default Cart; // No need for withRouter anymore

