import React, { useState } from "react";

const MicrobitGPIOBoard = () => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Configuration
  const PITCH = 25; // Distance between pins
  const PIN_SIZE = 8;
  const BOARD_WIDTH = 450;
  const BOARD_HEIGHT = 920;
  const CORNER_RADIUS = 8;

  // Pin component (header pins/through-holes)
  const Pin = ({
    x,
    y,
    id,
    isPower,
  }: {
    x: number;
    y: number;
    id: string;
    isPower?: boolean;
  }) => (
    <circle
      cx={x}
      cy={y}
      r={PIN_SIZE / 2}
      fill={hoveredPin === id ? (isPower ? "#ef4444" : "#10b981") : "#6b7280"}
      stroke="#000"
      strokeWidth="0.5"
      onMouseEnter={() => setHoveredPin(id)}
      onMouseLeave={() => setHoveredPin(null)}
      className="cursor-pointer transition-colors duration-75"
    />
  );

  // Label component
  const Label = ({
    x,
    y,
    text,
    size = 11,
    color = "#fff",
    anchor = "start",
    weight = "normal",
  }: any) => (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontFamily="Arial, sans-serif"
      fontWeight={weight}
      textAnchor={anchor}
      alignmentBaseline="middle"
      className="select-none pointer-events-none"
    >
      {text}
    </text>
  );

  // Power Section (header pins at top)
  const renderPowerSection = () => {
    const sectionX = 40;
    const sectionY = 60;
    const sectionWidth = 180;
    const sectionHeight = 180;
    const startX = sectionX + 30;
    const startY = sectionY + 50;
    const elements = [];

    // Section background
    elements.push(
      <rect
        key="power-bg"
        x={sectionX}
        y={sectionY}
        width={sectionWidth}
        height={sectionHeight}
        fill="#1a1a1a"
        rx="4"
      />
    );

    // Section label
    elements.push(
      <Label
        key="power-label"
        x={sectionX + sectionWidth / 2}
        y={sectionY + 20}
        text="POWER"
        size={12}
        weight="bold"
        anchor="middle"
      />
    );

    const pins = [
      { label: "GND", isPower: false, rowIdx: 0 },
      { label: "GND", isPower: false, rowIdx: 1 },
      { label: "3.3V", isPower: true, rowIdx: 2 },
      { label: "5V", isPower: true, rowIdx: 3 },
      { label: "VIN", isPower: true, rowIdx: 4 },
    ];

    pins.forEach((pin) => {
      const y = startY + pin.rowIdx * PITCH;
      const pinSpacing = 12; // Wider spacing between pins

      // 4 pins arranged horizontally with equal intervals (numbered 1-4)
      for (let i = 1; i <= 4; i++) {
        elements.push(
          <Pin
            key={`power-${pin.rowIdx}-${i}`}
            x={startX + (i - 1) * pinSpacing}
            y={y}
            id={`power-${pin.label}-${pin.rowIdx}-${i}`}
            isPower={pin.isPower}
          />
        );
      }

      // Label
      elements.push(
        <Label
          key={`power-lbl-${pin.rowIdx}`}
          x={startX + 3 * pinSpacing + 10}
          y={y}
          text={pin.label}
          size={10}
        />
      );
    });

    return elements;
  };

  // Analog Section (left side, top)
  const renderAnalogSection = () => {
    const sectionX = 40;
    const sectionY = 260;
    const sectionWidth = 180;
    const sectionHeight = 200;
    const startX = sectionX + 40;
    const startY = sectionY + 50;
    const elements = [];

    // Section background
    elements.push(
      <rect
        key="analog-bg"
        x={sectionX}
        y={sectionY}
        width={sectionWidth}
        height={sectionHeight}
        fill="#1a1a1a"
        rx="4"
      />
    );

    // Section label
    elements.push(
      <Label
        key="analog-label"
        x={sectionX + sectionWidth / 2}
        y={sectionY + 20}
        text="ANALOG"
        size={12}
        weight="bold"
        anchor="middle"
      />
    );

    const pins = [
      { label: "P0", desc: "" },
      { label: "P1", desc: "" },
      { label: "P2", desc: "" },
      { label: "P3", desc: "led col 1" },
      { label: "P4", desc: "led col 2" },
      { label: "P10", desc: "led col 3" },
    ];

    pins.forEach((pin, idx) => {
      const y = startY + idx * PITCH;
      // Pin holes (2 columns) - header pins
      elements.push(
        <Pin
          key={`analog-L-${idx}`}
          x={startX}
          y={y}
          id={`analog-${pin.label}-L`}
        />
      );
      elements.push(
        <Pin
          key={`analog-R-${idx}`}
          x={startX + PITCH}
          y={y}
          id={`analog-${pin.label}-R`}
        />
      );
      // Label
      const labelText = pin.desc ? `${pin.label} ${pin.desc}` : pin.label;
      elements.push(
        <Label
          key={`analog-lbl-${idx}`}
          x={startX + 50}
          y={y}
          text={labelText}
          size={9}
        />
      );
    });

    return elements;
  };

  // Digital Section (left side, bottom)
  const renderDigitalSection = () => {
    const sectionX = 40;
    const sectionY = 480;
    const sectionWidth = 180;
    const sectionHeight = 260;
    const startX = sectionX + 40;
    const startY = sectionY + 50;
    const elements = [];

    // Section background
    elements.push(
      <rect
        key="digital-bg"
        x={sectionX}
        y={sectionY}
        width={sectionWidth}
        height={sectionHeight}
        fill="#1a1a1a"
        rx="4"
      />
    );

    // Section label
    elements.push(
      <Label
        key="digital-label"
        x={sectionX + sectionWidth / 2}
        y={sectionY + 20}
        text="DIGITAL"
        size={12}
        weight="bold"
        anchor="middle"
      />
    );

    const pins = [
      { label: "P5", desc: "button A" },
      { label: "P6", desc: "led col 9" },
      { label: "P7", desc: "led col 8" },
      { label: "P9", desc: "led col 7" },
      { label: "P11", desc: "button B" },
      { label: "P8", desc: "" },
      { label: "P12", desc: "" },
      { label: "P13", desc: "SCK" },
      { label: "P14", desc: "MISO" },
      { label: "P15", desc: "MOSI" },
      { label: "P16", desc: "" },
    ];

    pins.forEach((pin, idx) => {
      const y = startY + idx * PITCH * 0.8;
      // Pin holes (2 columns) - header pins
      elements.push(
        <Pin
          key={`digital-L-${idx}`}
          x={startX}
          y={y}
          id={`digital-${pin.label}-L`}
        />
      );
      elements.push(
        <Pin
          key={`digital-R-${idx}`}
          x={startX + PITCH}
          y={y}
          id={`digital-${pin.label}-R`}
        />
      );
      // Label
      const labelText = pin.desc ? `${pin.label} ${pin.desc}` : pin.label;
      elements.push(
        <Label
          key={`digital-lbl-${idx}`}
          x={startX + 50}
          y={y}
          text={labelText}
          size={9}
        />
      );
    });

    return elements;
  };

  // I2C Section (bottom left)
  const renderI2CSection = () => {
    const sectionX = 40;
    const sectionY = 760;
    const sectionWidth = 180;
    const sectionHeight = 120;
    const startX = sectionX + 40;
    const startY = sectionY + 50;
    const elements = [];

    // Section background
    elements.push(
      <rect
        key="i2c-bg"
        x={sectionX}
        y={sectionY}
        width={sectionWidth}
        height={sectionHeight}
        fill="#1a1a1a"
        rx="4"
      />
    );

    // Section label
    elements.push(
      <Label
        key="i2c-label"
        x={sectionX + sectionWidth / 2}
        y={sectionY + 20}
        text="I2C"
        size={12}
        weight="bold"
        anchor="middle"
      />
    );

    const pins = [
      { label: "SDA" },
      { label: "SCL" },
      { label: "5V" },
      { label: "GND" },
    ];

    pins.forEach((pin, idx) => {
      const y = startY + idx * PITCH * 0.8;
      // Pin holes (2 columns) - header pins
      elements.push(
        <Pin key={`i2c-L-${idx}`} x={startX} y={y} id={`i2c-${pin.label}-L`} />
      );
      elements.push(
        <Pin
          key={`i2c-R-${idx}`}
          x={startX + PITCH}
          y={y}
          id={`i2c-${pin.label}-R`}
        />
      );
      // Label
      elements.push(
        <Label
          key={`i2c-lbl-${idx}`}
          x={startX + 50}
          y={y}
          text={pin.label}
          size={10}
        />
      );
    });

    return elements;
  };

  // Board components (USB, Edge Connector, etc.)
  const renderBoardComponents = () => {
    const elements = [];
    const edgeHeight = BOARD_HEIGHT * 0.8; // 80% of board height
    const edgeStartY = (BOARD_HEIGHT - edgeHeight) / 2; // Center vertically

    // USB Port (top right corner)
    elements.push(
      <g key="usb-component">
        <rect
          x={BOARD_WIDTH - 90}
          y={30}
          width={70}
          height={50}
          fill="#1a1a1a"
          rx="4"
        />
        <text
          x={BOARD_WIDTH - 55}
          y={55}
          fill="#fff"
          fontSize="10"
          fontFamily="Arial"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="select-none pointer-events-none"
        >
          USB
        </text>
      </g>
    );

    // DC Barrel Jack (top, with 30px minimum distance from POWER section)
    const powerSectionRight = 40 + 180; // POWER section x + width = 220
    const dcJackX = powerSectionRight + 30; // 30px gap from POWER section

    elements.push(
      <g key="dc-jack">
        <rect x={dcJackX} y={30} width={80} height={50} fill="#1a1a1a" rx="4" />
        <text
          x={dcJackX + 40}
          y={55}
          fill="#fff"
          fontSize="10"
          fontFamily="Arial"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="select-none pointer-events-none"
        >
          DC Jack
        </text>
      </g>
    );

    // Micro:bit Edge Connector (right edge, 80% of board height, centered)
    elements.push(
      <g key="edge-connector">
        <rect
          x={BOARD_WIDTH - 90}
          y={edgeStartY}
          width={70}
          height={edgeHeight}
          fill="#1a1a1a"
          rx="4"
        />
        <text
          x={BOARD_WIDTH - 55}
          y={BOARD_HEIGHT / 2}
          fill="#fff"
          fontSize="10"
          fontFamily="Arial"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(90, ${BOARD_WIDTH - 55}, ${BOARD_HEIGHT / 2})`}
          className="select-none pointer-events-none"
        >
          Edge Connector
        </text>
      </g>
    );

    // Type-A Socket (bottom right corner)
    elements.push(
      <g key="type-a">
        <rect
          x={BOARD_WIDTH - 90}
          y={BOARD_HEIGHT - 90}
          width={70}
          height={50}
          fill="#1a1a1a"
          rx="4"
        />
        <text
          x={BOARD_WIDTH - 55}
          y={BOARD_HEIGHT - 65}
          fill="#fff"
          fontSize="10"
          fontFamily="Arial"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="select-none pointer-events-none"
        >
          Type-A
        </text>
      </g>
    );

    return elements;
  };

  // Export SVG function
  const exportSVG = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;

    svgElement.querySelectorAll("circle, rect").forEach((elem) => {
      elem.removeAttribute("onmouseenter");
      elem.removeAttribute("onmouseleave");
      elem.setAttribute("class", "");
    });

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "microbit-gpio-board.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Micro:bit GPIO Extension Board
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Interactive Header Pin Layout
            {hoveredPin && (
              <span className="ml-4 font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
                Pin: {hoveredPin}
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

        <div className="overflow-auto border border-gray-300 rounded bg-gray-50">
          <svg
            ref={svgRef}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            className="mx-auto"
          >
            {/* PCB Board Background */}
            <rect
              x="0"
              y="0"
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="#0a3d2e"
              rx={CORNER_RADIUS}
            />

            {/* Board outline */}
            <rect
              x="10"
              y="10"
              width={BOARD_WIDTH - 20}
              height={BOARD_HEIGHT - 20}
              fill="none"
              stroke="#164e3f"
              strokeWidth="2"
              rx={CORNER_RADIUS}
            />

            {/* Render all sections */}
            <g id="power">{renderPowerSection()}</g>
            <g id="analog">{renderAnalogSection()}</g>
            <g id="digital">{renderDigitalSection()}</g>
            <g id="i2c">{renderI2CSection()}</g>

            {/* Board components */}
            <g id="components">{renderBoardComponents()}</g>

            {/* Board label - vertical text, 20px left of Edge Connector */}
            <text
              x={BOARD_WIDTH - 90 - 20}
              y={BOARD_HEIGHT / 2}
              fill="#fff"
              fontSize="14"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(90, ${BOARD_WIDTH - 90 - 20}, ${
                BOARD_HEIGHT / 2
              })`}
              className="select-none pointer-events-none"
            >
              micro:bit GPIO Extension Board
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MicrobitGPIOBoard;
