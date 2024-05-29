import React from "react";
import Navbar from "../components/navbar";
import NewBoardForm from "../components/new-board-form";
import Image from "next/image";


export default function Home () {
  return (
    <main className="h-screen">
      <Navbar />
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
