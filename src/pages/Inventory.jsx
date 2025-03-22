import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of withRouter
import {
  isErrorUser,
  isPerformanceGlitchUser,
  isProblemUser,
  isVisualUser,
} from "../utils/Credentials";
import InventoryListItem from "../components/InventoryListItem";
import SwagLabsFooter from "../components/Footer";
import HeaderContainer from "../components/HeaderContainer";
import { sortAsc, sortDesc, sortHiLo, sortLoHi } from "../utils/Sorting";
import Select from "../components/Select";
import "./Inventory.css";
import { BacktraceClient } from "@backtrace-labs/react";

const Inventory = ({ data }) => {
  const navigate = useNavigate(); // Use navigate if you need routing

  const InventoryData = data;
  const [inventoryList, setInventoryList] = useState(
    sortAsc(InventoryData, "name")
  );
  const [activeOption, setActiveOption] = useState("az");

  /* istanbul ignore next */
  const startPerformanceGlitch = (duration) => {
    const start = new Date().getTime();
    while (new Date().getTime() < start + duration) {
      // Simulating performance issue
    }
  };

  const isVisualFailure = isVisualUser();
  const randomPrice = () => Math.round(Math.random() * 10000) / 100;

  /* istanbul ignore next */
  if (isPerformanceGlitchUser()) {
    startPerformanceGlitch(5000);
  }

  /* istanbul ignore next */
  const sortByOption = (event) => {
    if (isProblemUser()) {
      return;
    } else if (isErrorUser()) {
      BacktraceClient.instance.send("Sorting is broken!", {
        sortOption: event.target.value,
        InventoryData,
      });
      return alert("Sorting is broken! This error has been reported to Backtrace.");
    }

    setActiveOption(event.target.value);

    switch (event.target.value) {
      case "az":
        setInventoryList(sortAsc(InventoryData, "name"));
        break;
      case "za":
        setInventoryList(sortDesc(InventoryData, "name"));
        break;
      case "hilo":
        setInventoryList(sortHiLo(InventoryData, "price"));
        break;
      case "lohi":
        setInventoryList(sortLoHi(InventoryData, "price"));
        break;
      default:
        return;
    }
  };

  return (
    <div id="page_wrapper" className="page_wrapper">
      <div id="contents_wrapper">
        <HeaderContainer
          secondaryTitle="Products"
          secondaryRightComponent={
            <Select
              activeOption={activeOption}
              options={[
                { key: "az", value: "Name (A to Z)" },
                { key: "za", value: "Name (Z to A)" },
                { key: "lohi", value: "Price (low to high)" },
                { key: "hilo", value: "Price (high to low)" },
              ]}
              onChange={sortByOption}
              testId="product-sort-container"
            />
          }
        />
        <div id="inventory_container">
          <div>
            <div
              id="inventory_container"
              className="inventory_container"
              data-test="inventory-container"
            >
              <div className="inventory_list" data-test="inventory-list">
                {inventoryList.map((item, i) => {
                  console.log("Item ID:", item.id, "Image URL:", item.image_url);

                  return (
                    <InventoryListItem
                      key={item.id}
                      id={item.id}
                      image_url={
                        isProblemUser() || (isVisualFailure && i === 0)
                          ? "sl-404.jpg"
                          : item.image_url
                      }
                      name={item.name}
                      desc={item.desc}
                      price={isVisualFailure ? randomPrice() : item.price}
                      isTextAlignRight={isVisualFailure && i > 1 && i < 4}
                      missAlignButton={isVisualFailure && i === 5}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwagLabsFooter />
    </div>
  );
};

export default Inventory; // No need for withRouter
