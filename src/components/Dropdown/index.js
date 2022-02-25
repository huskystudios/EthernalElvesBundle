import React from "react";
import Button from "./button";
import DropDownCard from "./dropDownCard";
const Dropdown = ({options, title, onChange, selected, count}) => {
  const [open, setOpen] = React.useState(false);
  const drop = React.useRef(title);
  const handleClick = (e) => {
    if(!drop.current) return
    if (!e.target.closest(`#${drop.current.id}`) && open) {
      setOpen(false);
    }
  }
  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
  return (
    <div
      className="mul-dropdown"
      ref={drop}
      id={title}
    >
      <Button value={title} count={selected.length === options.length ? "All" : selected.length} onClick={() => setOpen(open => !open)} />
      {open && <DropDownCard data={options} count={count} selected={selected} setOpen={setOpen} onChange={onChange} />}
    </div>
  );
};

export default Dropdown;