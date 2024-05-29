import React from "react";

const colorClass = [
  "from-indigo-200 to-indigo-300 hover:from-indigo-300 hover:to-indigo-400",
  "from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400",
  "from-green-200 to-green-300 hover:from-green-300 hover:to-green-400",
  "from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400",
  "from-rose-200 to-rose-300 hover:from-rose-300 hover:to-rose-400",
  "from-teal-200 to-teal-300 hover:from-teal-300 hover:to-teal-400",
  "from-lime-200 to-lime-300 hover:from-lime-300 hover:to-lime-400",
  "from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400",
  "from-emerald-200 to-emerald-300 hover:from-emerald-300 hover:to-emerald-400",
  "from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400",
  "from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400",
  "from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400",
  "from-red-200 to-red-300 hover:from-red-300 hover:to-red-400",
];

const Note = ({ note, index = 0, onNoteClick = () => { }, onUpVoteClick = () => { } }) => {
  return (
    <div
      className={`${colorClass[index % colorClass.length]
        } relative min-h-28 bg-gradient-to-br p-2 font-permanentMarker text-lg text-gray-900 shadow-lg cursor-pointer`}
      onClick={() => onNoteClick(note)}
    >
      <div className="pb-5">
        <span className="text-sm relative">{note.text}</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full pr-2 flex justify-end items-center gap-1">
        <span
          className="text-sm transition-all duration-150 ease-out hover:text-xl w-fit"
          onClick={(e) => {
            e.stopPropagation();
            onUpVoteClick(note)
          }}
        >
          👍
        </span>
        <div>
          <span className="text-sm">{note.votes}</span>
        </div>
      </div>
    </div>
  );
};

export default Note;
