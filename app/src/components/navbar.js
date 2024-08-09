import React, { useState } from "react";
import { NavbarTypes, SortOptions } from "../constants/app-constants";
import Button from "./button";

const Navbar = ({
  className = "",
  type = NavbarTypes.AUTH,
  name = "",
  onSendEmailButtonClick = () => {},
  onNotesSortByChange = () => {},
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000); // Change back after 3 seconds
  };

  const redirectToGithubRepo = () => {
    if (!window) return;
    window.open("https://github.com/appcd-demo/retroboard", "_blank");
  };

  const GithubButton = () => (
    <button
      className="opacity-90 hover:opacity-100 cursor-pointer"
      onClick={() => redirectToGithubRepo()}
    >
      <img src="/github.png" alt="Github logo" className="w-6 h-6" />
    </button>
  );

  return type === NavbarTypes.AUTH ? (
    <header className={`flex items-center justify-between px-3 ${className}`}>
      <div className="flex items-center">
        <img src="/logo.png" alt="Retroboard logo" className="w-6 h-6" />
        <h2 className="font-mono text-xl px-3 py-2 text-yellow-500 font-semibold">
          boards
        </h2>
      </div>
      <GithubButton />
    </header>
  ) : (
    <header className="flex justify-between">
      <div className="flex items-center pl-3">
        <img src="/logo.png" alt="Retroboard logo" className="w-6 h-6" />
        <h2 className="font-mono text-lg px-3 py-2 text-yellow-500 font-semibold">
          Board: {name}
        </h2>
      </div>
      <div className="flex gap-2 pt-1 pr-2 items-center">
        <div className="flex items-center mr-1">
          Sort By:
          <select
            className="ml-2 border-gray-300 rounded-md text-gray-800 text-sm p-1 px-2"
            defaultValue={SortOptions[0].value}
            onChange={(e) => onNotesSortByChange(e.target.value)}
          >
            {SortOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {navigator.clipboard && (
          <Button
            variant="primary2"
            onClick={copyToClipboard}
            label={copySuccess ? "✅ Copied!" : "🔗 copy"}
          />
        )}
        <Button
          variant="primary2"
          label={"✉️ summary"}
          onClick={onSendEmailButtonClick}
        />
        <GithubButton />
      </div>
    </header>
  );
};

export default Navbar;
