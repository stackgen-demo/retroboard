import React from "react";
import Dialog from "./dialog";
import Button from "./button";

const AddNoteDialog = ({
    open,
    activeSectionForDialog,
    onToggleDialog,
    updateDialogActiveSection,
    onCreateNoteSubmit,
}) => {
    return (
        <Dialog
            isOpen={open}
            onClose={() => onToggleDialog(false)}
            headerRenderer={
                <span className="text-xl font-normal text-gray-800">
                    Add note for{" "}
                    <span className="font-bold">
                        {activeSectionForDialog.sectionName}
                    </span>
                </span>
            }
            footerRenderer={
                <div className="flex gap-2 justify-end">
                    <Button
                        width="fit"
                        onClick={() => {
                            onToggleDialog(false);
                            updateDialogActiveSection({ sectionName: "", text: "" });
                        }}
                        label={"Cancel"}
                        variant="secondary"
                    />
                    <Button
                        width="fit"
                        onClick={onCreateNoteSubmit}
                        label={"Create Note"}
                    />
                </div>
            }
        >
            <textarea
                className="w-full p-1 h-40 border border-gray-300 rounded"
                onInput={(e) =>
                    updateDialogActiveSection({
                        ...activeSectionForDialog,
                        text: e.target.value,
                    })
                }
            />
        </Dialog>
    );
};

export default AddNoteDialog;
