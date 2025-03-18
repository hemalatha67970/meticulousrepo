import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ShoppingCart } from "../utils/shopping-cart";
import { ROUTES } from "../utils/Constants";
import "./CartButton.css";

const CartButton = () => {
  const history = useHistory();
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
      onClick={() => history.push(ROUTES.CART)}
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


