import React from "react";

function FriendAndSearch() {
  let msg =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum odio voluptatum temporibus iste, labore tempore maiores, vel amet dolores nesciunt, pariatur recusandae?";
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">✍️ Chatify</h2>
        <input
          className="bg-orange-50 rounded-2xl p-2 outline-none border focus:ring-1 focus:ring-blue-500 w-full mt-2"
          type="search"
          placeholder="🔍 Search"
        />
      </div>
      <hr className="mb-4" />

      {/* Friend List Item */}
      <div className="flex items-center justify-between p-2 border rounded-lg shadow-md bg-white hover:bg-slate-50 cursor-pointer">
        {/* Left Div: Logo    */}
        <div className="flex items-center relative justify-center w-10 h-10 bg-slate-600 text-white rounded-full">
          {/* if online we will display green logo */}
          <span className="text-xs absolute top-[-5px] right-[-5px]">🟢</span>
          <span className="text-sm font-bold">JD</span>
          {/*will  conditionally render image if present or not */}
        </div>

        {/* mmiddle Div: Name and Message */}
        <div className="flex flex-col flex-1 mx-4 ">
          <h2 className="text-lg font-semibold text-left">Jessica Drew</h2>
          <p className="text-gray-600 text-left">{msg.slice(0, 40)}</p>
        </div>

        {/* right div : Time and Notification */}
        <div className="text-right  flex flex-col items-end">
          <span className="text-gray-500 text-sm block">8:30 PM</span>
          <span className="bg-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-1">
            2
          </span>
        </div>
      </div>
    </div>
  );
}

export default FriendAndSearch;
