import React from "react";

const cls = "dropdown-btn";

const Button = ({ onClick, value, count=-1 }) => {
  if(count !== -1) return (
    <button className={cls} onClick={onClick}>
      {value}({count ? count : "ALL"}) <i className="arrow down"></i>
    </button>
  )
  return(
    <button className={cls} onClick={onClick}>
      {value}
    </button>
  )
};

export default Button;
