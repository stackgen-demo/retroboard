import React, { useContext, useMemo, useState } from "react";
import { NavbarTypes } from "../constants/app-constants";
import Navbar from "./navbar";
import NoteSection from "./note-section";
import Dialog from "./dialog";
import { BoardContext } from "../pages/board";
import Button from "./button";

const ActionableBoard = ({ name, section_details, notes }) => {
  const { id: boardId } = useContext(BoardContext);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [activeSectionForDialog, setActiveSectionForDialog] = useState({
    sectionName: "",
    noteText: "",
  });

  const sectionNotes = useMemo(
    () =>
      section_details.map((name, index) => ({
        name: name,
        notes: notes.filter((note) => note.section_number === index),
        section_number: index + 1,
      })),
    [section_details]
  );

  // Split sections into rows
  const rows = [];
  for (let i = 0; i < sectionNotes.length; i += 3) {
    rows.push(sectionNotes.slice(i, i + 3));
  }

  const createNote = async () => {
    const newNoteRequest = {
      section_number: section_details.findIndex(
        (sectionName) => sectionName === activeSectionForDialog.sectionName
      ),
      text: activeSectionForDialog.noteText,
      votes: 0,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST_URL}/boards/${boardId}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNoteRequest),
      }
    );
    const res = await response.json();
  };

  return (
    <div className="flex flex-col gap-5">
      <Navbar type={NavbarTypes.IN_APP} name={name} />
      <div className="p-8 pt-0 overflow-auto h-[calc(100vh-5rem)]">
        <div className="bg-gray-100 h-full overflow-auto text-black rounded-md">
          {console.log('rows-59::> ', rows)}
          {rows.map((row, rowIndex) => {
            // Determine grid classes based on number of sections in the row
            let gridClasses = "grid grid-cols-1";
            if (row.length === 2) {
              gridClasses = "grid grid-cols-2";
            } else if (row.length === 3) {
              gridClasses = "grid grid-cols-3";
            }

            return (
              <div
                key={rowIndex}
                className={`gap-4 p-1 ${gridClasses}`}
              >
                {row.map((section, index) => (
                  <div
                    key={index}
                    className={`flex flex-col p-4 min-h-60 `}
                  // ${index < row.length - 1 ? 'border-r border-gray-300' : ''}
                  >
                    <NoteSection
                      section={section}
                      onAddNote={(sectionName) => {
                        setActiveSectionForDialog({
                          sectionName,
                          noteText: "",
                        });
                        setOpenNoteDialog(true);
                      }}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        isOpen={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
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
              size="fit"
              onClick={() => {
                setOpenNoteDialog(false);
                setActiveSectionForDialog({ sectionName: "", noteText: "" });
              }}
              label={"Cancel"}
              variant="secondary"
            />
            <Button
              size="fit"
              onClick={async () => {
                await createNote()
                setActiveSectionForDialog({ sectionName: "", noteText: "" });
                setOpenNoteDialog(false);
              }}
              label={"Create Note"}
            />
          </div>
        }
      >
        <textarea
          className="w-full p-1 h-40 border border-gray-300 rounded"
          onInput={(e) =>
            setActiveSectionForDialog({
              ...activeSectionForDialog,
              noteText: e.target.value,
            })
          }
        />
      </Dialog>
    </div>
  );
};

export default ActionableBoard;

