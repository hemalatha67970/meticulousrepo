import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use `useNavigate` instead of `useHistory`
import PropTypes from "prop-types";
import { ShoppingCart } from "../utils/shopping-cart";
import { isErrorUser, isProblemUser } from "../utils/Credentials";
import { ROUTES } from "../utils/Constants";
import Button, { BUTTON_SIZES, BUTTON_TYPES } from "./Button";
import "./InventoryListItem.css";

const InventoryListItem = ({
  isTextAlignRight,
  missAlignButton,
  desc,
  id,
  image_url,
  name,
  price,
}) => {
  const navigate = useNavigate(); // Use useNavigate hook
  const [itemInCart, setItemInCart] = useState(ShoppingCart.isItemInCart(id));

  const addToCart = (itemId) => {
    if (isProblemUser() && itemId % 2 === 1) return;
    if (isErrorUser() && itemId % 2 === 1) {
      throw new Error("Failed to add item to the cart.");
    }

    ShoppingCart.addItem(itemId);
    setItemInCart(true);
  };

  const removeFromCart = (itemId) => {
    if (isProblemUser() && itemId % 2 === 0) return;
    if (isErrorUser() && itemId % 2 === 0) {
      throw new Error("Failed to remove item from cart.");
    }

    ShoppingCart.removeItem(itemId);
    setItemInCart(false);
  };

  const linkId = isProblemUser() ? id + 1 : id;
  const itemLink = `${ROUTES.INVENTORY_LIST}?id=${linkId}`;
  const itemNameClass = `inventory_item_name ${isTextAlignRight ? "align_right" : ""}`;

  // Set default image if `image_url` is missing
  const imagePath = image_url
    ? `/assets/img/${image_url}`
    : "/assets/img/default.jpg";

  return (
    <div className="inventory_item" data-test="inventory-item">
      <div className="inventory_item_img">
        <a
          href="#"
          id={`item_${id}_img_link`}
          onClick={(e) => {
            e.preventDefault();
            navigate(itemLink); // Use navigate to change the route
          }}
          data-test={`item-${id}-img-link`}
        >
          <img src={imagePath} alt={name} onError={(e) => (e.target.src = "/assets/img/default.jpg")} />
        </a>
      </div>

      <div className="inventory_item_description" data-test="inventory-item-description">
        <div className="inventory_item_label">
          <a
            href="#"
            id={`item_${id}_title_link`}
            onClick={(e) => {
              e.preventDefault();
              navigate(itemLink); // Use navigate to change the route
            }}
            data-test={`item-${id}-title-link`}
          >
            <div className={itemNameClass} data-test="inventory-item-name">
              {name}
            </div>
          </a>
          <div className="inventory_item_desc" data-test="inventory-item-desc">
            {desc}
          </div>
        </div>

        <div className="pricebar">
          <div className="inventory_item_price" data-test="inventory-item-price">
            ${price}
          </div>
          <ButtonType
            id={id}
            item={name}
            itemInCart={itemInCart}
            missAlignButton={missAlignButton}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        </div>
      </div>
    </div>
  );
};

// Extracted ButtonType Component
const ButtonType = ({ id, item, itemInCart, missAlignButton, addToCart, removeFromCart }) => {
  const label = itemInCart ? "Remove" : "Add to cart";
  const onClick = itemInCart ? () => removeFromCart(id) : () => addToCart(id);
  const type = itemInCart ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PRIMARY;
  const testId = `${label}-${item}`.replace(/\s+/g, "-").toLowerCase();
  const buttonClass = `btn_inventory ${missAlignButton ? "btn_inventory_misaligned" : ""}`;

  return (
    <Button
      customClass={buttonClass}
      label={label}
      onClick={onClick}
      size={BUTTON_SIZES.SMALL}
      testId={testId}
      type={type}
    />
  );
};

InventoryListItem.propTypes = {
  desc: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  image_url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isTextAlignRight: PropTypes.bool.isRequired,
  missAlignButton: PropTypes.bool.isRequired,
};

export default InventoryListItem;
