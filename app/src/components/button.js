import React from "react";

export const ButtonVariant = {
  primary: "bg-emerald-800 text-white hover:bg-emerald-900",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  tertiary: "bg-black text-gray-300",
  danger: "bg-red-700 text-gray-100 hover:bg-red-800",
  primary2: "bg-amber-700 text-white hover:bg-amber-800",
};

export const ButtonWidth = {
  full: "w-full",
  fit: "w-fit",
};

export const ButtonSize = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2.5 text-sm",
};

function Button ({
  label,
  variant = "primary",
  width = ButtonWidth.full,
  size = "md",
  ...props
}) {
  return (
    <button
      {...props}
      className={`${ButtonVariant[variant]} ${ButtonWidth[width]} ${ButtonSize[size]
        } rounded-md font-semibold shadow-sm disabled:opacity-50 ${props.className ? props.className : ""
        }`}
    >
      {label}
    </button>
  );
}

export default Button;
