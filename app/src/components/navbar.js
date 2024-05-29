import React, { useState } from "react";
import { NavbarTypes } from "../constants/app-constants";
import Button from "./button";

const Navbar = ({ className = "", type = NavbarTypes.AUTH, name = "", onSendEmailButtonClick = () => { } }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000); // Change back after 3 seconds
  };

  return type === NavbarTypes.AUTH ? (
    <header className={`flex items-center pl-3 ${className}`}>
      <img src="/logo.png" alt="Retroboard logo" className="w-6 h-6" />
      <h2 className="font-mono text-xl px-3 py-2 text-yellow-500 font-semibold">
        boards
      </h2>
    </header>
  ) : (
    <header className="flex justify-between">
      <div className="flex items-center pl-3">
        <img src="/logo.png" alt="Retroboard logo" className="w-6 h-6" />
        <h2 className="font-mono text-lg px-3 py-2 text-yellow-500 font-semibold">
          Board: {name}
        </h2>
      </div>
      <div className="flex gap-2 pt-2 pr-2">
        <Button
          variant="primary2"
          onClick={copyToClipboard}
          label={copySuccess ? "✅ Copied!" : "🔗 copy"}
        />
        <Button variant="primary2" label={"✉️ summary"} onClick={onSendEmailButtonClick} />
      </div>
    </header>
  );
};

export default Navbar;
