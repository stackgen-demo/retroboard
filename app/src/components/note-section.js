import React, { Fragment } from "react";
import Note from "./note";

const NoteSection = ({ section, onAddNote, index, sectionsInCurrentRow }) => {
  let columnClassForNotes;

  if (sectionsInCurrentRow === 3) {
    columnClassForNotes = 'grid-cols-3'; // show 3 notes per column if there are 3 sections
  } else if (sectionsInCurrentRow === 2) {
    columnClassForNotes = 'grid-cols-4'; // show 4 notes per column if there are 2 section
  } else {
    columnClassForNotes = 'grid-cols-6'; // show 6 notes per column if there is only 1 section
  }
  return (
    <>
      <div className="flex justify-center flex-col gap-2">
        <div className="flex justify-center items-center gap-2">
          <h3 className="p-1">{section.name}</h3>
          <div
            onClick={() => onAddNote(section.name)}
            className="flex items-center justify-center text-white p-1 rounded-full bg-gradient-to-tr from-green-500 to-green-600 h-7 w-7 cursor-pointer active:bg-gradient-to-bl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>
        {section.notes && section.notes.length > 0 ? (
          <div className={`grid gap-2 ${columnClassForNotes}`}>
            {section.notes.map((note) => (
              <Fragment key={note.id}>
                <Note note={note} index={index} />
              </Fragment>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No notes for this section.
          </p>
        )}
      </div>
    </>
  );
};

export default NoteSection;
