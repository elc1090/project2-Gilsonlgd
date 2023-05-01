import React, { useState } from "react";
import "./BaseInput.css";

function BaseInput({ placeholder, value, setValue }) {
  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <input
      className="base-input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
    />
  );
}

export default BaseInput;
