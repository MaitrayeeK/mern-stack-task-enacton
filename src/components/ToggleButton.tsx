"use client";

import { useState } from "react";

function ToggleButton({ children, text, hidden }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!hidden && (
        <button className="ml-4" onClick={() => setIsOpen((prev) => !prev)}>
          {text}
        </button>
      )}
      {isOpen && children}
    </>
  );
}

export default ToggleButton;
