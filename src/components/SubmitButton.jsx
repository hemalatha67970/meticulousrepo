import React from "react";
import PropTypes from "prop-types";
import "./SubmitButton.css";

const SubmitButton = ({ customClass = "", testId, value = "Submit", ...props }) => {
  return (
    <input
      type="submit"
      className={`submit-button ${customClass}`.trim()}
      value={value}
      {...(testId && { "data-testid": testId, id: testId, name: testId })}
      {...props}
    />
  );
};

SubmitButton.propTypes = {
  customClass: PropTypes.string,
  testId: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default SubmitButton;


