import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { createContext, useContext } from "react";

const BoardContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

// TODO add note
// TODO update note
// TODO delete note
// TODO vote on note
// TODO add button to copy board link
// TODO add button to send email summary
// TODO sort notes by votes
export default function BoardPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: board,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_HOST_URL}/boards/${id}`, {
    refreshInterval: 0,
    fetcher: fetcher,
  });

  return (
    <BoardContext.Provider value={{ id }}>
      <main className="bg-emerald-950 h-screen">
        {error ? (
          <Message message="An error has occurred. Please try again later." />
        ) : isLoading ? (
          <Message message="Loading..." />
        ) : (
          <Board
            name={board.name}
            section_details={board.section_details}
            notes={board.notes}
          />
        )}
      </main>
    </BoardContext.Provider>
  );
}

function Message({ message }) {
  return <div className="flex justify-center p-6">{message}</div>;
}

function Board({ name, section_details, notes }) {
  let numCols = 3; // Default number of columns
  if (section_details.length === 1) {
    numCols = 1;
  } else if (section_details.length === 2) {
    numCols = 2;
  }

  const sectionNotes = [];
  section_details.map((name, index) => {
    const currentNotes = notes.filter(
      (note) => note.section_number === index + 1
    );
    sectionNotes.push({
      name: name,
      notes: currentNotes,
      section_number: index + 1,
    });
  });

  return (
    <div>
      <header className="flex justify-between">
        <h2 className="font-mono text-xl px-3 py-2 text-yellow-500 font-semibold">
          board - {name}
        </h2>
        <div>
          <button className="bg-amber-700 px-2 py-1 m-1 text-s rounded-md font-bold text-white">
            copy 🔗
          </button>
          <button className="bg-amber-700 px-2 py-1 m-3 text-s rounded-md font-bold text-white">
            ✉️ summary
          </button>
        </div>
      </header>
      <div className={`flex grid-cols-${numCols} justify-center h-screen`}>
        {section_details.map((section, index) => (
          <div
            key={index}
            className={`flex px-2 mx-2 ${
              index !== 0 ? "border-l border-amber-900" : ""
            }`}
          >
            <Section
              section_number={index + 1}
              name={section}
              key={index + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ section_number, name }) {
  const { id: boardId } = useContext(BoardContext);
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST_URL}/boards/${boardId}/notes?section_number=${section_number}`,
    fetcher
  );

  return (
    <div>
      <div className="flex justify-center grid-cols-2">
        <h3 className="p-1">{name}</h3>
        <button className="bg-green-500 px-2 text-s rounded-md font-bold text-white">
          +
        </button>
      </div>
      <div className="grid grid-cols-2">
        {data &&
          !error &&
          data.map((note) => <Note key={note.id} note={note} />)}
      </div>
    </div>
  );
}

function Note({ note }) {
  return (
    <div className="bg-yellow-200 p-2 m-2 w-40 h-40 text-black">
      <p>{note.text}</p>
      <div className="flex justify-end mt-auto">
        <p className="text-sm text-gray-400">{note.votes} 👍</p>
      </div>
    </div>
  );
}
