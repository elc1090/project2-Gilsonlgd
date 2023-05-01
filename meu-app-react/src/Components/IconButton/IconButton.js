import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./IconButton.css";

function IconButton({ icon, onClick, animation }) {
  const [pressed, setPressed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [justUnhovered, setJustUnhovered] = useState(false);

  const handleClick = () => {
    onClick();
  };

  const handleMouseEnter = () => {
    setHovering(true);
    setJustUnhovered(false);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setJustUnhovered(true);
  };

  const handleMouseDown = () => {
    setHovering(false);
    setPressed(true);
  };

  const handleMouseUp = () => {
    setPressed(false);
    setHovering(true);
  };

  return (
    <i
      className={`cursor-pointer ${icon} ${hovering ? "hover" : ""} ${
        pressed ? "bounce" : ""
      } ${justUnhovered ? "unhover" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    ></i>
  );
}

export default IconButton;
