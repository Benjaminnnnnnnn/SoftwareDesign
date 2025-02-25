"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <div className="flex h-screen p-4">
      <div className="w-1/2 flex flex-col justify-center items-center space-y-4">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
          Button 1
        </button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
          Button 2
        </button>
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
          Button 3
        </button>
      </div>
      <div className="w-1/2 flex justify-center items-center"></div>
    </div>
  );
}
