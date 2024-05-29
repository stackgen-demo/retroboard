import React, { useContext, useMemo, useState, useEffect } from "react";

import { NavbarTypes } from "../constants/app-constants";
import Navbar from "./navbar";
import NoteSection from "./note-section";
import { BoardContext } from "../pages/board";
import AddNoteDialog from "./add-note-dialog";
import EditNoteDialog from "./edit-note-dialog";
import { addVoteToNote, createNote, deleteNote, sendBoardSummaryEmail, updateNote } from "../utils/network-utils";
import EmailDialog from "./email-dialog";

const ActionableBoard = ({ name, section_details, notes }) => {
  const { id: boardId } = useContext(BoardContext);
  const [openAddNoteDialog, setOpenAddNoteDialog] = useState(false);
  const [openEditNoteDialog, setOpenEditNoteDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [activeSectionForDialog, setActiveSectionForDialog] = useState({
    sectionName: "",
    text: "",
  });
  const [activeNoteForEdit, setActiveNoteForEdit] = useState({});
  const [sectionDetails, setSectionDetails] = useState(section_details);
  const [notesList, setNotesList] = useState(notes);

  useEffect(() => {
    setNotesList(notes)
  }, [notes])

  const sectionNotes = useMemo(
    () =>
      sectionDetails.map((name, index) => ({
        name: name,
        notes: notesList.filter((note) => note.section_number === index + 1),
        section_number: index + 1,
      })),
    [sectionDetails, notesList]
  );

  // Split sections into rows
  const rows = [];
  for (let i = 0; i < sectionNotes.length; i += 3) {
    rows.push(sectionNotes.slice(i, i + 3));
  }

  const handleCreateNote = async () => {
    const newNoteRequest = {
      section_number: sectionDetails.findIndex(
        (sectionName) => sectionName === activeSectionForDialog.sectionName
      ) + 1,
      text: activeSectionForDialog.text,
      votes: 0,
    };
    const responseObj = await createNote(newNoteRequest, boardId);
    if (responseObj) {
      setNotesList([...notesList, responseObj]) // pushing new note in notes list
      setActiveSectionForDialog({ sectionName: "", text: "" });
      setOpenAddNoteDialog(false);
    }
  };

  const handleUpdateNote = async () => {
    const updatedNoteRequest = {
      section_number: activeNoteForEdit.section_number,
      text: activeNoteForEdit.text,
      votes: activeNoteForEdit.votes,
    };
    const responseObj = await updateNote(updatedNoteRequest, boardId, activeNoteForEdit.id);
    if (responseObj) {
      setNotesList(
        notesList.map((note) => (note.id === activeNoteForEdit.id ? responseObj : note))
      );
      setActiveNoteForEdit({});
      setOpenEditNoteDialog(false);
    }
  };

  const handleDeleteNote = async () => {
    const responseObj = await deleteNote(boardId, activeNoteForEdit.id);
    if (responseObj) {
      setNotesList(notes => [...notes.filter((note) => note.id !== activeNoteForEdit.id)]);
      setOpenEditNoteDialog(false);
      setActiveNoteForEdit({});
    }
  };

  const handleNoteUpVote = async (note) => {
    const responseObj = await addVoteToNote(boardId, note.id);
    if (responseObj) {
      setNotesList(
        notesList.map((note) =>
          note.id === responseObj.id ? { ...note, votes: responseObj.votes } : note
        )
      )
    }
  };

  const handleSendEmail = async (email) => {
    const boardSummaryEmailRequest = {
      board_id: boardId,
      email_address: email,
    }
    const responseObj = await sendBoardSummaryEmail(boardSummaryEmailRequest)
    if (responseObj) {
      setOpenEmailDialog(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Navbar type={NavbarTypes.IN_APP} name={name} onSendEmailButtonClick={() => setOpenEmailDialog(true)} />
      <div className="p-8 pt-0 pb-4 overflow-auto h-[calc(100vh-5rem)]">
        <div className="bg-gray-100 h-full overflow-auto text-black rounded-md">
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
                className={`gap-1 p-1 ${gridClasses}`}
              >
                {row.map((section, index) => (
                  <div
                    key={index}
                    className={`flex flex-col p-4 min-h-60 ${index < row.length - 1 ? 'border-r border-gray-200' : ''}`}
                  >
                    <NoteSection
                      section={section}
                      sectionsInCurrentRow={row.length}
                      onAddNote={(sectionName) => {
                        setActiveSectionForDialog({
                          sectionName,
                          text: "",
                        });
                        setOpenAddNoteDialog(true);
                      }}
                      onEditNote={(note) => {
                        setActiveNoteForEdit(note);
                        setOpenEditNoteDialog(true);
                      }}
                      onUpVoteClick={handleNoteUpVote}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <AddNoteDialog
        activeSectionForDialog={activeSectionForDialog}
        onToggleDialog={(newStatus) => setOpenAddNoteDialog(newStatus)}
        updateDialogActiveSection={(updatedSectionObj) => setActiveSectionForDialog(updatedSectionObj)}
        open={openAddNoteDialog}
        onCreateNoteSubmit={handleCreateNote}
      />
      <EditNoteDialog
        open={openEditNoteDialog}
        onToggleDialog={(newStatus) => setOpenEditNoteDialog(newStatus)}
        updateDialogActiveNote={(updatedNotesObj) => setActiveNoteForEdit(updatedNotesObj)}
        activeNoteForEdit={activeNoteForEdit}
        onEditNoteSubmit={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
      <EmailDialog
        open={openEmailDialog}
        onToggleDialog={(newStatus) => setOpenEmailDialog(newStatus)}
        onCreateNoteSubmit={handleSendEmail}
      />
    </div>
  );
};

export default ActionableBoard;

