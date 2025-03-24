import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of withRouter
import PropTypes from "prop-types";
import { isProblemUser, isErrorUser } from "../utils/Credentials";
import { ROUTES } from "../utils/Constants";
import SwagLabsFooter from "../components/Footer";
import HeaderContainer from "../components/HeaderContainer";
import InputError, { INPUT_TYPES } from "../components/InputError";
import ErrorMessage from "../components/ErrorMessage";
import SubmitButton from "../components/SubmitButton";
import Button, { BUTTON_SIZES, BUTTON_TYPES } from "../components/Button";
import "./CheckOutStepOne.css";
import Backtrace from "@backtrace/react";
const CheckOutStepOne = () => {
  const navigate = useNavigate(); // Replaces history.push
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");

  const dismissError = () => {
    setError("");
  };

  const handleFirstNameChange = (evt) => {
    setFirstName(evt.target.value);
  };

  const handleLastNameChange = (evt) => {
    if (isProblemUser()) {
      return setFirstName(evt.target.value);
    } else if (isErrorUser()) {
      return setLastName(evt.totallyUndefined?.value); // Prevent crashes by checking undefined
    }
    setLastName(evt.target.value);
  };

  const handlePostalCodeChange = (evt) => {
    setPostalCode(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (!firstName) {
      return setError("First Name is required");
    }

    if (!lastName && !isErrorUser()) {
      return setError("Last Name is required");
    }

    if (!postalCode) {
      return setError("Postal Code is required");
    }

    // Redirect to next step
    navigate(ROUTES.CHECKOUT_STEP_TWO);

    return "";
  };

  return (
    <div id="page_wrapper" className="page_wrapper">
      <div id="contents_wrapper">
        <HeaderContainer secondaryTitle="Checkout: Your Information" />
        <div
          id="checkout_info_container"
          className="checkout_info_container"
          data-test="checkout-info-container"
        >
          <div className="checkout_info_wrapper">
            <form onSubmit={handleSubmit}>
              <div className="checkout_info">
                <InputError
                  isError={Boolean(error)}
                  type={INPUT_TYPES.TEXT}
                  value={firstName}
                  onChange={handleFirstNameChange}
                  testId="firstName"
                  placeholder="First Name"
                  id="first-name"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
                <InputError
                  isError={Boolean(error)}
                  type={INPUT_TYPES.TEXT}
                  value={lastName}
                  onChange={handleLastNameChange}
                  testId="lastName"
                  placeholder="Last Name"
                  id="last-name"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
                <InputError
                  isError={Boolean(error)}
                  type={INPUT_TYPES.TEXT}
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                  testId="postalCode"
                  placeholder="Zip/Postal Code"
                  id="postal-code"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
                <ErrorMessage
                  isError={Boolean(error)}
                  errorMessage={`Error: ${error}`}
                  onClick={dismissError}
                />
              </div>
              <div className="checkout_buttons">
                <Button
                  customClass="cart_cancel_link"
                  label="Cancel"
                  onClick={(evt) => {
                    evt.preventDefault();
                    navigate(ROUTES.CART); // Use navigate instead of history.push
                  }}
                  size={BUTTON_SIZES.MEDIUM}
                  testId="cancel"
                  type={BUTTON_TYPES.BACK}
                />
                <SubmitButton
                  customClass="btn btn_primary cart_button btn_action"
                  testId="continue"
                  value="Continue"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <SwagLabsFooter />
    </div>
  );
};

export default CheckOutStepOne; // No need for withRouter anymore
