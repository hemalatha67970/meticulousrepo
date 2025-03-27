import React from "react";
import { useNavigate } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { ShoppingCart } from "../utils/shopping-cart";
import { ROUTES } from "../utils/Constants";
import {
  isProblemUser,
  isVisualUser,
  removeCredentials,
} from "../utils/Credentials";
import menuClosePng from "../assets/img/close.png";
import menuCloseSvg from "../assets/svg/close@3x.svg";
import menuIconPng from "../assets/img/menu.png";
import menuIconSvg from "../assets/svg/menu3x.svg";

import "./DrawerMenu.css";

const DrawerMenu = () => {
  const navigate = useNavigate();

  const resetStorage = () => {
    ShoppingCart.resetCart();
  };

  const aboutLink = isProblemUser()
    ? "https://saucelabs.com/error/404"
    : "https://saucelabs.com/";
  const isVisualFailure = isVisualUser();
  const imageClass = isVisualFailure ? "visual_failure" : "";

  return (
    <Menu
      customBurgerIcon={
        <img
          src={menuIconPng}
          className={imageClass}
          srcSet={menuIconSvg}
          alt="Open Menu"
          data-test="open-menu"
        />
      }
      customCrossIcon={
        <img
          src={menuClosePng}
          className={imageClass}
          srcSet={menuCloseSvg}
          alt="Close Menu"
          data-test="close-menu"
        />
      }
      outerContainerId="page_wrapper"
      pageWrapId="contents_wrapper"
      noOverlay
    >
      <button
        id="inventory_sidebar_link"
        className="menu-item"
        onClick={() => navigate(ROUTES.INVENTORY)}
        data-test="inventory-sidebar-link"
      >
        All Items
      </button>
      <a
        id="about_sidebar_link"
        className="menu-item"
        href={aboutLink}
        data-test="about-sidebar-link"
      >
        About
      </a>
      <button
        id="logout_sidebar_link"
        className="menu-item"
        onClick={() => {
          removeCredentials();
          navigate(ROUTES.LOGIN);
        }}
        data-test="logout-sidebar-link"
      >
        Logout
      </button>
      <button
        id="reset_sidebar_link"
        className="menu-item"
        onClick={resetStorage}
        data-test="reset-sidebar-link"
      >
        Reset App State
      </button>
    </Menu>
  );
};

export default DrawerMenu;
