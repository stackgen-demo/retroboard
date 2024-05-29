import React from "react";

const Spinner = ({ className = "" }) => {
  return (
    <div
      className={`border-gray-500 h-5 w-5 animate-spin rounded-full border-2 border-t-gray-200 ${className}`}
    />
  );
};

export default Spinner;
