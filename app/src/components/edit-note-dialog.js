import React from "react";
import Dialog from "./dialog";
import Button from "./button";

const EditNoteDialog = ({
  open,
  activeNoteForEdit,
  onToggleDialog,
  updateDialogActiveNote,
  isSubmissionInProgress,
  onEditNoteSubmit,
  onDeleteNote,
}) => {
  return (
    <Dialog
      isOpen={open}
      onClose={() => onToggleDialog(false)}
      headerRenderer={
        <span className="text-xl font-normal text-gray-800">Edit note</span>
      }
      footerRenderer={
        <div className="flex gap-2 justify-between">
          <Button
            width="fit"
            onClick={onDeleteNote}
            label={"Remove"}
            variant="danger"
            disabled={isSubmissionInProgress}
          />
          <div className="flex gap-2">
            <Button
              width="fit"
              onClick={() => {
                onToggleDialog(false);
                updateDialogActiveNote({});
              }}
              label={"Cancel"}
              variant="secondary"
            />
            <Button
              width="fit"
              onClick={onEditNoteSubmit}
              label={"Update Note"}
              disabled={isSubmissionInProgress || !activeNoteForEdit.text}
            />
          </div>
        </div>
      }
    >
      <textarea
        className="w-full p-1 h-40 border border-gray-300 rounded"
        onInput={(e) =>
          updateDialogActiveNote({
            ...activeNoteForEdit,
            text: e.target.value,
          })
        }
        defaultValue={activeNoteForEdit.text}
      />
    </Dialog>
  );
};

export default EditNoteDialog;
