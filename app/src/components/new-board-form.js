import React, { useState } from "react";
import TextBox from "../components/text-box";
import Button from "../components/button";
import { SectionBasedPlaceholderTexts } from "../constants/app-constants";

const NewBoardForm = () => {
  const placeholderTexts = SectionBasedPlaceholderTexts;

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST_URL}/boards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBoardRequest),
      }
    );

    if (response.ok) {
      const board = await response.json();
      // redirect to the new board
      window.location.href = `/board.html?slug=${board.slug}&id=${board.id}`;
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
          {sectionCount > 0 && (
            <div className="border border-gray-300 p-4 rounded-md flex flex-col gap-1">
              {Array.from({ length: sectionCount }).map((_, index) => (
                <TextBox
                  key={index}
                  required
                  type="text"
                  name="section_name"
                  id="section_name"
                  placeholder={placeholderTexts[sectionCount][index]}
                  label={`Section ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 items-center gap-x-6">
          <Button label="Create" type="submit" id="create-board-button" />
        </div>
      </form>
    </div>
  );
};

export default NewBoardForm;
