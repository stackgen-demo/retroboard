import React, { useState } from "react";
import Dialog from "./dialog";
import Button from "./button";
import { isValidEmail } from "../utils/common-utils";

const EmailDialog = ({ open, onToggleDialog, onCreateNoteSubmit }) => {
  const [email, setEmail] = useState("");
  return (
    <Dialog
      isOpen={open}
      onClose={() => onToggleDialog(false)}
      headerRenderer={
        <span className="text-xl font-normal text-gray-800">
          Send email for board summary
        </span>
      }
      footerRenderer={
        <div className="flex gap-2 justify-end">
          <Button
            width="fit"
            onClick={() => {
              onToggleDialog(false);
            }}
            label={"Cancel"}
            variant="secondary"
          />
          <Button
            type="submit"
            width="fit"
            onClick={() => {
              if (email && isValidEmail(email)) {
                onCreateNoteSubmit(email);
              }
            }}
            label={"Send"}
          />
        </div>
      }
    >
      <input
        className="w-full p-1 border border-gray-300 rounded text-gray-800"
        placeholder="Enter Email"
        type="email"
        required
        onInput={(e) => setEmail(e.target.value)}
      />
    </Dialog>
  );
};

export default EmailDialog;
