import React, { useState } from "react";
import { MdSend } from "react-icons/md";

function MainChatScreen() {
  const [seeUserDetail, setSeeUserDetail] = useState(false);

  const handleView = () => {
    console.log("clicked.");
    setSeeUserDetail((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Main Chat Section */}
      <div className="flex flex-col flex-1  p-1 bg-gray-100">
        {/* Header Section */}
        <header className="bg-white p-4  shadow-sm">
          <div className="flex items-center gap-3">
            <div
              onClick={handleView}
              className="cursor-pointer flex items-center justify-center w-10 h-10 bg-slate-600 text-white rounded-full"
            >
              <span className="text-sm font-bold">JD</span>
              {/* Conditionally render image if present */}
            </div>
            <h2 className="text-lg font-semibold">Jessica Drew</h2>
          </div>
        </header>

        {/* Chat Messages Section */}
        <main className="flex flex-col-reverse flex-1 overflow-y-auto mt-4 space-y-4 gap-2">
          {/* Outgoing Message */}
          <div className="bg-blue-100 w-1/2 p-3 rounded-2xl shadow-sm ml-auto mr-1">
            <p className="text-gray-600 text-right font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
              similique laudantium m hi my name is lallna top
            </p>
            <div className="text-gray-500 text-sm text-right mt-1">8:33 PM</div>
          </div>
          {/* Incoming Message */}
          <div className="bg-white w-1/2 p-3 rounded-2xl shadow-sm ml-1">
            <p className="text-gray-600 text-left font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
              similique laudantium m saasa sad as
            </p>
            <div className="text-gray-500 text-sm text-right mt-1">8:30 PM</div>
          </div>
        </main>

        {/* Input Box Section for sending msg */}
        <footer className="m-2">
          <div className="flex items-center border-2 border-gray-300 rounded-lg p-2 bg-white">
            <input
              className="flex-1 outline-none p-2"
              type="text"
              placeholder="Type a message..."
            />
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MdSend size={24} />
            </button>
          </div>
        </footer>
      </div>

      {/* User Details Sidebar */}
      {seeUserDetail && (
        <aside className="w-64 bg-white p-4 border-l border-gray-200 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 bg-slate-600 text-white rounded-full">
              <span className="text-3xl font-bold">JD</span>
              {/* Conditionally render image if present */}
            </div>
            <h2 className="mt-2 text-lg font-semibold">Daina Moree</h2>
            <p className="text-gray-500">9283728203</p>
            <p className="text-gray-500">dianomore@gmail.com</p>
          </div>
          <hr className="my-4" />

          
          <button className="text-gray-400 hover:text-red-500">Log-Out</button>
         
        </aside>
      )}
    </div>
  );
}

export default MainChatScreen;
