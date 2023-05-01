import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

function BaseButton({ iconOnly, icon, label, type, onClick }) {
  return (
    <button type="button" className={"btn" + type} onClick={onClick}>
      {iconOnly && <i className={icon}></i>}
      {!iconOnly && icon && <i className={icon}></i>}
      {!iconOnly && label && label}
    </button>
  );
}

export default BaseButton;
