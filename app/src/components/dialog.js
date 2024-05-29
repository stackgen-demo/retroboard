import React from "react";

const Dialog = ({
  isOpen,
  footerRenderer,
  headerRenderer,
  title = "",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto text-gray-800">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Dialog Header */}
          {headerRenderer && (
            <div className="p-4 pb-0">
              <span>{headerRenderer}</span>
            </div>
          )}
          {/* Dialog Body */}
          <div className="p-4">
            <span className=" ctext-sm font-normal">{children}</span>
          </div>
          {/* Dialog Footer */}
          {footerRenderer && <div className={`p-4 pt-0`}>{footerRenderer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
