import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isProblemUser, isErrorUser } from "../utils/Credentials";
import { ROUTES } from "../utils/Constants";
import { ShoppingCart } from "../utils/shopping-cart";
import { InventoryData } from "../utils/InventoryData";
import HeaderContainer from "../components/HeaderContainer";
import Button, { BUTTON_SIZES, BUTTON_TYPES } from "../components/Button";
import SwagLabsFooter from "../components/Footer";
import "./InventoryItem.css";
import BrokenComponent from "../components/BrokenComponent";
import { ErrorBoundary } from "@backtrace/react";
import Backtrace from "@backtrace/react";

const InventoryItem = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  // Get our query params now
  const queryParams = new URLSearchParams(window.location.search);
  let inventoryId = -1;
  let item;

  if (queryParams.has("id")) {
    inventoryId = parseInt(queryParams.get("id"));
  }

  if (inventoryId >= 0 && InventoryData.length > inventoryId) {
    item = InventoryData[inventoryId];
  } else {
    item = {
      name: "ITEM NOT FOUND",
      desc: `We're sorry, but your call could not be completed as dialled.
          Please check your number, and try your call again.
          If you are in need of assistance, please dial 0 to be connected with an operator.
          This is a recording.
          4 T 1.`,
      image_url: "sl-404.jpg",
      price: "√-1",
    };
  }

  item.id = inventoryId;

  const [itemInCart, setItemInCart] = useState(
    ShoppingCart.isItemInCart(inventoryId)
  );

  const goBack = () => {
    navigate(ROUTES.INVENTORY);
  };

  const addToCart = (itemId) => {
    if (isProblemUser()) {
      if (itemId % 2 === 1) return;
    } else if (isErrorUser()) {
      if (itemId % 2 === 1) {
        throw new Error("Failed to add item to the cart.");
      }
    }

    ShoppingCart.addItem(itemId);
    setItemInCart(true);
  };

  const removeFromCart = (itemId) => {
    if (isProblemUser()) {
      if (itemId % 2 === 0) return;
    } else if (isErrorUser()) {
      if (itemId % 2 === 0) {
        throw new Error("Failed to remove item from cart.");
      }
    }

    ShoppingCart.removeItem(itemId);
    setItemInCart(false);
  };

  const ButtonType = ({ id, itemInCart }) => {
    const label = itemInCart ? "Remove" : "Add to cart";
    const onClick = itemInCart ? () => removeFromCart(id) : () => addToCart(id);
    const type = itemInCart ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PRIMARY;
    const testId = label === "Remove" ? "remove" : "add-to-cart";

    return (
      <Button
        customClass="btn_inventory"
        label={label}
        onClick={onClick}
        size={BUTTON_SIZES.SMALL}
        testId={testId}
        type={type}
      />
    );
  };

  return (
    <div id="page_wrapper">
      <div id="contents_wrapper">
        <HeaderContainer
          customClass="inventory_details"
          secondaryLeftComponent={
            <Button
              customClass="inventory_details_back_button"
              label="Back to products"
              onClick={goBack}
              type={BUTTON_TYPES.BACK}
              testId="back-to-products"
            />
          }
        />
        <div id="inventory_item_container" className="inventory_item_container" data-test="inventory-container">
          <div className="inventory_details">
            <div className="inventory_details_container" data-test="inventory-item">
              <div className="inventory_details_img_container">
                <img
                  alt={item.name}
                  className="inventory_details_img"
                  src={require(`../assets/img/${item.image_url}`).default}
                  data-test={`item-${item.name.replace(/\s+/g, "-").toLowerCase()}-img`}
                />
              </div>
              <div className="inventory_details_desc_container">
                <div className="inventory_details_name large_size" data-test="inventory-item-name">
                  {item.name}
                </div>

                <ErrorBoundary
                  name="description-boundary"
                  fallback={
                    <div className="inventory_details_desc large_size" data-test="inventory-item-desc">
                      A description should be here, but it failed to render!
                      This error has been reported to Backtrace.
                    </div>
                  }
                >
                  {!isErrorUser() ? (
                    <div className="inventory_details_desc large_size" data-test="inventory-item-desc">
                      {item.desc}
                    </div>
                  ) : (
                    <BrokenComponent />
                  )}
                </ErrorBoundary>

                <div className="inventory_details_price" data-test="inventory-item-price">
                  ${item.price}
                </div>
                <ButtonType id={item.id} itemInCart={itemInCart} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwagLabsFooter />
    </div>
  );
};

export default InventoryItem;
