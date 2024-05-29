import React from "react";

const colorClass = [
  "from-yellow-200 to-yellow-300",
  "from-green-200 to-green-300",
  "from-blue-200 to-blue-300",
  "from-rose-200 to-rose-300",
  "from-teal-200 to-teal-300",
  "from-lime-200 to-lime-300",
  "from-orange-200 to-orange-300",
  "from-emerald-200 to-emerald-300",
  "from-pink-200 to-pink-300",
  "from-purple-200 to-purple-300",
  "from-indigo-200 to-indigo-300",
  "from-amber-200 to-amber-300",
  "from-red-200 to-red-300",
];

const Note = ({ note, index = 0 }) => {
  return (
    <div
      className={`${
        colorClass[index % colorClass.length]
      } relative min-h-28 bg-gradient-to-br p-2 font-permanentMarker text-lg text-blue-900 shadow-lg`}
    >
      <h1 className="text-sm relative">{note.text}</h1>
    </div>
  );
};

export default Note;
