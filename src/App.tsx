import React, { useState } from "react";
import Breadboard from "./Breadboard";
import MicrobitGPIOBoard from "./MicrobitGPIOBoard";

function App() {
  const [currentView, setCurrentView] = useState<"breadboard" | "microbit">(
    "breadboard"
  );

  return (
    <div>
      {/* Navigation */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2">
        <button
          onClick={() => setCurrentView("breadboard")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentView === "breadboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Breadboard
        </button>
        <button
          onClick={() => setCurrentView("microbit")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentView === "microbit"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Micro:bit GPIO
        </button>
      </div>

      {/* Content */}
      {currentView === "breadboard" ? <Breadboard /> : <MicrobitGPIOBoard />}
    </div>
  );
}

export default App;
