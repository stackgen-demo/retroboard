import TextBox from "@/components/text-box";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home () {
  return (
    <main className="h-screen">
      <header>
        <h2 className="font-mono text-xl px-3 py-2 text-yellow-500 font-semibold">
          boards
        </h2>
      </header>
      <div className="grid grid-cols-2 h-[calc(100vh-2.9rem)]">
        <div className="bg-emerald-950">
          <div className="flex items-center justify-center w-full h-full" >
            <Image
              src={"/wireframe.png"}
              alt="Wireframe"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="bg-gray-50">
          <NewBoardForm />
        </div>
      </div>
    </main>
  );
}

function NewBoardForm () {
  const placeholderTexts = {
    1: ["tasks"],
    2: ["pros", "cons"],
    3: ["went well", "can be improved", "action items"],
    4: [
      "urgent and important",
      "urgent and not important",
      "not urgent and important",
      "not urgent and not important",
    ],
    5: ["what", "why", "how", "when", "who"],
    6: [
      "blue - process",
      "white - facts",
      "red - feelings",
      "yellow - benefits",
      "green - creativity",
      "black - risks",
    ],
  };

  const [boardName, setBoardName] = useState("");
  const [sectionCount, setSectionCount] = useState(0);

  async function submitForm (e) {
    e.preventDefault();
    // disable button
    const button = document.getElementById("create-board-button");
    button.disabled = true;

    const sectionNames = Array.from(
      document.querySelectorAll("input[name=section_name]")
    ).map((input) => input.value);

    const newBoardRequest = {
      name: boardName,
      section_details: sectionNames,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST_URL}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBoardRequest),
    });

    if (response.ok) {
      const board = await response.json();
      // redirect to the new board
      window.location.href = `/board?slug=${board.slug}&id=${board.id}`;
    } else {
      alert("Failed to create board");
      button.disabled = false;
    }
  }
  return (
    <div className="px-28 w-full h-full flex items-center">
      <form onSubmit={submitForm} className="w-full">
        <div className="flex flex-col gap-4 ">
          <h2 className="text-xl font-bold leading-7 text-gray-900 text-center mb-8">
            Create a new Board
          </h2>
          <div>
            <TextBox
              required
              type="text"
              name="name"
              id="name"
              placeholder="Retro - June 2024"
              label="Board Name"
              onChange={(e) => {
                setBoardName(e.target.value);
              }}
            />
          </div>
          <div>
            <TextBox
              required
              type="number"
              name="sections"
              id="sections"
              autoComplete="off"
              placeholder="1"
              min={1}
              max={6}
              label="Number of Sections"
              onChange={(e) => {
                if (e.target.value > 6) {
                  e.target.value = 6;
                }
                setSectionCount(e.target.value);
              }}
            />
          </div>
          {sectionCount > 0 && <div className="border border-gray-300 p-4 rounded-md flex flex-col gap-1" >
            {Array.from({ length: sectionCount }).map((_, index) => (
              <SectionInput
                key={index}
                number={index + 1}
                placeholderText={placeholderTexts[sectionCount][index]}
              />
            ))}
          </div>}
        </div>

        <div className="mt-6 items-center gap-x-6">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-5 py-2 text-m font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  disabled:opacity-50"
            id="create-board-button"
          >
            Create
          </button>
        </div>
      </form>

    </div>
  );
}

function SectionInput ({ number, placeholderText }) {
  return (
    <TextBox
      required
      type="text"
      name="section_name"
      id="section_name"
      placeholder={placeholderText}
      label={`Section ${number}`}
    />
  );
}
