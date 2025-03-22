import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { ShoppingCart } from "../utils/shopping-cart";
import { ROUTES } from "../utils/Constants";
import "./CartButton.css";

const CartButton = () => {
  const navigate = useNavigate(); // useNavigate replaces useHistory
  const [cartContents, setCartContents] = useState(ShoppingCart.getCartContents() || []);

  // Memoized listener to update state when cart contents change
  const cartListener = useCallback(() => {
    setCartContents([...ShoppingCart.getCartContents() || []]); // Ensuring a valid array
  }, []);

  useEffect(() => {
    ShoppingCart.registerCartListener(cartListener);

    return () => {
      if (ShoppingCart.unregisterCartListener) {
        ShoppingCart.unregisterCartListener(cartListener);
      }
    };
  }, [cartListener]);

  return (
    <button
      className="shopping_cart_link"
      onClick={() => navigate(ROUTES.CART)} // Use navigate instead of history.push
      data-test="shopping-cart-link"
    >
      {cartContents.length > 0 && (
        <span className="shopping_cart_badge" data-test="shopping-cart-badge">
          {cartContents.length}
        </span>
      )}
    </button>
  );
};

export default CartButton;
