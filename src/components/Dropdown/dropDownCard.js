import React from "react";

const liCls =
  "p-3 border text-gray-700 hover:text-white hover:bg-indigo-700 cursor-pointer";

const DropDownCard = ({ data = [], setOpen, onChange, selected, count }) => {
  const handleClick = (option) => {
    if(selected.includes(option)) {
      onChange(selected.filter( item => item !== option ))
    }
    else {
      onChange([...selected, option])
    }
  }
  return(
  <div className="shadow h-auto w-56 absolute">
    <ul className="mul-dropdown-content">
      <li className={selected.length === 0 ? "active" : null} onClick={() => onChange([])}>ALL</li>
      {data.map((item, i) => (
        <li key={i} className={selected.includes(item) ? "active" : null} onClick={() => handleClick(item)}>
          {item} ({count[item] ? count[item] : 0})
        </li>
      ))}
    </ul>
  </div>
)};

export default DropDownCard;
