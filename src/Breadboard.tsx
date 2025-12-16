import React, { useState } from "react";

const Breadboard = () => {
  const [hoveredHole, setHoveredHole] = useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Configuration
  const PITCH = 20; // Pixel distance between hole centers
  const HOLE_SIZE = 6;
  const GAP_POWER_TO_MAIN = 40;
  const GAP_CENTER_DIVIDER = 30; // The ravine between a-e and f-j

  // Dimensions
  const MAIN_ROWS = 65;
  const MAIN_COLS_PER_BANK = 5; // a-e is 5, f-j is 5

  // Power rail config
  const POWER_SEGMENTS = 10;
  const HOLES_PER_SEGMENT = 5;
  // const POWER_SEGMENT_SPACING = (MAIN_ROWS * PITCH) / POWER_SEGMENTS; // Distribute evenly along height

  // Calculate total width/height for SVG viewbox
  // Layout: [Power L] --gap-- [A-E] --ravine-- [F-J] --gap-- [Power R]
  const POWER_RAIL_WIDTH = PITCH * 2; // 2 lines
  const BANK_WIDTH = PITCH * MAIN_COLS_PER_BANK;

  const START_X_POWER_L = 40;
  const START_X_BANK_L = START_X_POWER_L + POWER_RAIL_WIDTH + GAP_POWER_TO_MAIN;
  const START_X_BANK_R = START_X_BANK_L + BANK_WIDTH + GAP_CENTER_DIVIDER;
  const START_X_POWER_R = START_X_BANK_R + BANK_WIDTH + GAP_POWER_TO_MAIN;

  const TOTAL_WIDTH = START_X_POWER_R + POWER_RAIL_WIDTH + 40;
  const TOTAL_HEIGHT = MAIN_ROWS * PITCH + 60; // Padding top/bottom

  const START_Y = 40;

  // Helper to generate a square hole
  const Hole = ({
    x,
    y,
    id,
    color = "#333",
  }: {
    x: number;
    y: number;
    id: string;
    color?: string;
  }) => (
    <rect
      x={x - HOLE_SIZE / 2}
      y={y - HOLE_SIZE / 2}
      width={HOLE_SIZE}
      height={HOLE_SIZE}
      fill={hoveredHole === id ? "#3b82f6" : color} // Blue highlight on hover
      rx={1} // Slight rounded corners
      onMouseEnter={() => setHoveredHole(id)}
      onMouseLeave={() => setHoveredHole(null)}
      className="cursor-pointer transition-colors duration-75"
    />
  );

  // Helper to draw text labels
  const Label = ({
    x,
    y,
    text,
    vertical = false,
    color = "#888",
    size = 10,
  }: any) => (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontFamily="monospace"
      textAnchor="middle"
      alignmentBaseline="middle"
      transform={vertical ? `rotate(-90, ${x}, ${y})` : undefined}
      className="select-none pointer-events-none"
    >
      {text}
    </text>
  );

  // Generate Power Rails (Left and Right)
  const renderPowerRail = (startX: number, side: "left" | "right") => {
    const rails = [];
    // const isLeft = side === "left";

    // Draw background lines for power (Red +, Blue -)
    // Blue line to the left of negative column, Red line to the right of positive column
    const lineX1 = startX - PITCH / 2; // Blue line left of negative holes
    const lineX2 = startX + PITCH + PITCH / 2; // Red line right of positive holes
    const railHeight = (MAIN_ROWS - 1) * PITCH;

    // Colored stripes running down the rail
    rails.push(
      <line
        key={`line-blue-${side}`}
        x1={lineX1}
        y1={START_Y}
        x2={lineX1}
        y2={START_Y + railHeight}
        stroke="#3b82f6"
        strokeWidth="2"
        opacity="0.6"
      />,
      <line
        key={`line-red-${side}`}
        x1={lineX2}
        y1={START_Y}
        x2={lineX2}
        y2={START_Y + railHeight}
        stroke="#ef4444"
        strokeWidth="2"
        opacity="0.6"
      />
    );

    // Generate holes in segments
    for (let seg = 1; seg <= POWER_SEGMENTS; seg++) {
      const segmentStartY =
        START_Y +
        (seg - 1) * ((MAIN_ROWS * PITCH) / POWER_SEGMENTS) +
        PITCH / 2;

      for (let row = 1; row <= HOLES_PER_SEGMENT; row++) {
        const y = segmentStartY + (row - 1) * PITCH;

        // Line 1 (Negative/Blue)
        rails.push(
          <Hole
            key={`pwr-${side}-1-${seg}-${row}`}
            x={startX}
            y={y}
            id={`pwr-${side}-neg-${seg}-${row}`}
          />
        );

        // Line 2 (Positive/Red)
        rails.push(
          <Hole
            key={`pwr-${side}-2-${seg}-${row}`}
            x={startX + PITCH}
            y={y}
            id={`pwr-${side}-pos-${seg}-${row}`}
          />
        );
      }
    }

    // +/- Labels at top
    rails.push(
      <Label
        key={`lbl-${side}-neg`}
        x={startX}
        y={START_Y - 15}
        text="-"
        color="#3b82f6"
      />
    );
    rails.push(
      <Label
        key={`lbl-${side}-pos`}
        x={startX + PITCH}
        y={START_Y - 15}
        text="+"
        color="#ef4444"
      />
    );

    return rails;
  };

  // Generate Main Banks (A-E and F-J)
  const renderMainGrid = () => {
    const holes: React.JSX.Element[] = [];
    const labels: React.JSX.Element[] = [];
    const rowLabels: React.JSX.Element[] = [];

    const colLabelsLeft = ["a", "b", "c", "d", "e"];
    const colLabelsRight = ["f", "g", "h", "i", "j"];

    // Column Labels (Top and Bottom)
    [...colLabelsLeft, ...colLabelsRight].forEach((label, idx) => {
      // Determine X position
      let x = 0;
      if (idx < 5) {
        x = START_X_BANK_L + idx * PITCH;
      } else {
        x = START_X_BANK_R + (idx - 5) * PITCH;
      }

      // Top Label
      labels.push(
        <Label key={`col-top-${label}`} x={x} y={START_Y - 15} text={label} />
      );
      // Bottom Label
      labels.push(
        <Label
          key={`col-bot-${label}`}
          x={x}
          y={START_Y + MAIN_ROWS * PITCH + 5}
          text={label}
        />
      );
    });

    // Rows
    for (let r = 0; r < MAIN_ROWS; r++) {
      const y = START_Y + r * PITCH;
      const rowNum = r + 1;

      // Add Row Number Labels (1, 5, 10...60, 65)
      // Check if it's a multiple of 5 or 1 or 65
      if (rowNum === 1 || rowNum % 5 === 0 || rowNum === 65) {
        // Left side of Bank A - 15 pixels to the left
        rowLabels.push(
          <Label
            key={`row-lbl-L-${rowNum}`}
            x={START_X_BANK_L - 15}
            y={y}
            text={rowNum.toString()}
            size={9}
            color="#666"
          />
        );

        // Right side of Bank J - 15 pixels to the right (same distance as left)
        const rightOfJ = START_X_BANK_R + 4 * PITCH; // Position of column j
        rowLabels.push(
          <Label
            key={`row-lbl-R-${rowNum}`}
            x={rightOfJ + 15}
            y={y}
            text={rowNum.toString()}
            size={9}
            color="#666"
          />
        );
      }

      // Bank Left (a-e)
      for (let c = 0; c < 5; c++) {
        const x = START_X_BANK_L + c * PITCH;
        holes.push(
          <Hole
            key={`main-L-${r}-${c}`}
            x={x}
            y={y}
            id={`main-${rowNum}-${colLabelsLeft[c]}`}
          />
        );
      }

      // Bank Right (f-j)
      for (let c = 0; c < 5; c++) {
        const x = START_X_BANK_R + c * PITCH;
        holes.push(
          <Hole
            key={`main-R-${r}-${c}`}
            x={x}
            y={y}
            id={`main-${rowNum}-${colLabelsRight[c]}`}
          />
        );
      }
    }

    return { holes, labels, rowLabels };
  };

  const { holes: mainHoles, labels: mainLabels, rowLabels } = renderMainGrid();

  // Export SVG as high-resolution image
  const exportSVG = () => {
    if (!svgRef.current) return;

    // Clone the SVG element
    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;

    // Remove hover effects and interactive classes from the clone
    svgElement.querySelectorAll("rect").forEach((rect) => {
      rect.removeAttribute("onmouseenter");
      rect.removeAttribute("onmouseleave");
      rect.setAttribute("class", "");
    });

    // Get SVG string
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "breadboard-layout.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Precision Breadboard Layout
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            65 Rows • 10 Power Segments • Standard Pitch
            {hoveredHole && (
              <span className="ml-4 font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Position:{" "}
                {hoveredHole.replace("main-", "").replace("pwr-", "Power ")}
              </span>
            )}
          </p>
          <button
            onClick={exportSVG}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Export as SVG
          </button>
        </div>

        <div className="overflow-auto max-h-[80vh] border border-gray-300 rounded bg-[#fdfdfd]">
          <svg
            ref={svgRef}
            width={TOTAL_WIDTH}
            height={TOTAL_HEIGHT}
            className="mx-auto"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="gray"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            {/* Board Background */}
            <rect
              x="0"
              y="0"
              width={TOTAL_WIDTH}
              height={TOTAL_HEIGHT}
              fill="#f8f9fa"
            />

            {/* Left Power Rail Background */}
            <rect
              x={START_X_POWER_L - 10}
              y={START_Y - 20}
              width={POWER_RAIL_WIDTH + 20}
              height={MAIN_ROWS * PITCH + 40}
              fill="#f1f1f1"
              rx="4"
              opacity="0.5"
            />

            {/* Right Power Rail Background */}
            <rect
              x={START_X_POWER_R - 10}
              y={START_Y - 20}
              width={POWER_RAIL_WIDTH + 20}
              height={MAIN_ROWS * PITCH + 40}
              fill="#f1f1f1"
              rx="4"
              opacity="0.5"
            />

            {/* Render Components */}
            <g id="power-left">{renderPowerRail(START_X_POWER_L, "left")}</g>
            <g id="main-grid">
              {mainHoles}
              {mainLabels}
              {rowLabels}
            </g>
            <g id="power-right">{renderPowerRail(START_X_POWER_R, "right")}</g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Breadboard;
