import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { createContext } from "react";

import ActionableBoard from "../components/actionable-board";
import Spinner from "../components/spinner";
import IconAttributionText from "../components/icon-attribution-text";

export const BoardContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

// TODO add note - Done
// TODO update note - Done
// TODO delete note - Done
// TODO vote on note - Done
// TODO add button to copy board link - Done
// TODO add button to send email summary
// TODO sort notes by votes
export default function BoardPage () {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: board,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_HOST_URL}/boards/${id}`, {
    refreshInterval: 5000, // TODO: update polling time if needed 
    fetcher: fetcher,
  });

  return (
    <BoardContext.Provider value={{ id }}>
      <main className="bg-emerald-950 h-screen overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-screen w-full">
            <span className="text-center text-xl">
              An error has occurred. Please try again later.
            </span>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="flex items-center gap-2">
              <span className="text-center text-2xl">Loading...</span>
              <Spinner />
            </div>
          </div>
        ) : (
          <ActionableBoard
            name={board.name}
            section_details={board.section_details}
            notes={board.notes}
          />
        )}
        <IconAttributionText />
      </main>
    </BoardContext.Provider>
  );
}
