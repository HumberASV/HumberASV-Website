// src\components\layout\vehicle\floating_forces_compass.jsx
import { useState, useEffect } from "react";

export default function IsometricFloatingForces() {
  const [currentSpeed, setCurrentSpeed] = useState(2.5); // 0-5 m/s
  const [currentHeading, setCurrentHeading] = useState(0); // Compass heading: N=0, E=90, S=180, W=270
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Convert compass heading to math angle (radians)
  // Compass: N=0°, E=90°, S=180°, W=270° (clockwise from north)
  // Math: E=0°, N=90°, W=180°, S=270° (counter-clockwise from east)
  // Conversion: mathAngle = 90° - heading
  const headingToMathRad = (heading: number): number => {
    const mathDeg = 90 - heading;
    return (mathDeg * Math.PI) / 180;
  };

  const currentRad = headingToMathRad(currentHeading);

  // Isometric projection constants
  const isoAngle = Math.PI / 6; // 30 degrees
  const cos30 = Math.cos(isoAngle);
  const sin30 = Math.sin(isoAngle);

  // Convert 3D coordinates to 2D isometric screen coordinates
  const toIso = (x: number, y: number, z: number): { x: number; y: number } => {
    const screenX = (x - y) * cos30;
    const screenY = (x + y) * sin30 - z;
    return { x: screenX, y: screenY };
  };

  // Center of the view
  const centerX = 350;
  const centerY = 280;

  // Scale factor
  const scale = 1.2;

  // Transform to screen coordinates
  const toScreen = (
    x: number,
    y: number,
    z: number
  ): { x: number; y: number } => {
    const iso = toIso(x * scale, y * scale, z * scale);
    return { x: centerX + iso.x, y: centerY + iso.y };
  };

  // Force magnitudes (scaled for visualization)
  const gravityMag = 70;
  const buoyancyMag = 70;
  const currentMag = currentSpeed * 14;
  const dragMag = currentSpeed * 7;

  // 3D force vectors
  const forces = {
    gravity: { x: 0, y: 0, z: -gravityMag },
    buoyancy: { x: 0, y: 0, z: buoyancyMag },
    current: {
      x: Math.cos(currentRad) * currentMag,
      y: Math.sin(currentRad) * currentMag,
      z: 0,
    },
    drag: {
      x: -Math.cos(currentRad) * dragMag,
      y: -Math.sin(currentRad) * dragMag,
      z: 0,
    },
  };

  // Get cardinal direction label
  const getCardinalLabel = (heading: number): string => {
    const directions = [
      { min: 337.5, max: 360, label: "N" },
      { min: 0, max: 22.5, label: "N" },
      { min: 22.5, max: 67.5, label: "NE" },
      { min: 67.5, max: 112.5, label: "E" },
      { min: 112.5, max: 157.5, label: "SE" },
      { min: 157.5, max: 202.5, label: "S" },
      { min: 202.5, max: 247.5, label: "SW" },
      { min: 247.5, max: 292.5, label: "W" },
      { min: 292.5, max: 337.5, label: "NW" },
    ];
    for (const dir of directions) {
      if (heading >= dir.min && heading < dir.max) return dir.label;
    }
    return "N";
  };

  type Vec3 = { x: number; y: number; z: number };

  type Arrow3DProps = {
    start: Vec3;
    direction: Vec3;
    color: string;
    label: string;
    labelOffset?: Vec3;
  };

  // 3D Arrow component
  const Arrow3D = ({
    start,
    direction,
    color,
    label,
    labelOffset = { x: 0, y: 0, z: 0 },
  }: Arrow3DProps) => {
    const length = Math.sqrt(
      direction.x ** 2 + direction.y ** 2 + direction.z ** 2
    );
    if (length < 5) return null;

    const end = {
      x: start.x + direction.x,
      y: start.y + direction.y,
      z: start.z + direction.z,
    };

    const startScreen = toScreen(start.x, start.y, start.z);
    const endScreen = toScreen(end.x, end.y, end.z);

    const dx = endScreen.x - startScreen.x;
    const dy = endScreen.y - startScreen.y;
    const angle = Math.atan2(dy, dx);
    const headLength = 12;
    const headAngle = Math.PI / 6;

    const head1X = endScreen.x - headLength * Math.cos(angle - headAngle);
    const head1Y = endScreen.y - headLength * Math.sin(angle - headAngle);
    const head2X = endScreen.x - headLength * Math.cos(angle + headAngle);
    const head2Y = endScreen.y - headLength * Math.sin(angle + headAngle);

    const labelPos = toScreen(
      end.x + labelOffset.x,
      end.y + labelOffset.y,
      end.z + labelOffset.z
    );

    return (
      <g>
        <line
          x1={startScreen.x}
          y1={startScreen.y}
          x2={endScreen.x}
          y2={endScreen.y}
          stroke={color}
          strokeWidth="3"
        />
        <polygon
          points={`${endScreen.x},${endScreen.y} ${head1X},${head1Y} ${head2X},${head2Y}`}
          fill={color}
        />
        <text
          x={labelPos.x}
          y={labelPos.y}
          fill={color}
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    );
  };

  // Draw water surface grid
  const WaterGrid = () => {
    const lines = [];
    const gridSize = 200;
    const step = 40;

    for (let y = -gridSize; y <= gridSize; y += step) {
      const start = toScreen(-gridSize, y, 0);
      const end = toScreen(gridSize, y, 0);
      lines.push(
        <line
          key={`x-${y}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      );
    }

    for (let x = -gridSize; x <= gridSize; x += step) {
      const start = toScreen(x, -gridSize, 0);
      const end = toScreen(x, gridSize, 0);
      lines.push(
        <line
          key={`y-${x}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      );
    }

    return <g>{lines}</g>;
  };

  // Coordinate axes with N/E labels
  const CoordinateAxes = () => {
    const axisLength = 80;
    const origin = { x: -120, y: -120, z: 0 };

    return (
      <g>
        {/* X axis (East) */}
        <Arrow3D
          start={origin}
          direction={{ x: axisLength, y: 0, z: 0 }}
          color="#ef4444"
          label="E (+X)"
          labelOffset={{ x: 20, y: 0, z: 0 }}
        />
        {/* Y axis (North) */}
        <Arrow3D
          start={origin}
          direction={{ x: 0, y: axisLength, z: 0 }}
          color="#22c55e"
          label="N (+Y)"
          labelOffset={{ x: 0, y: 20, z: 0 }}
        />
        {/* Z axis (Up) */}
        <Arrow3D
          start={origin}
          direction={{ x: 0, y: 0, z: axisLength }}
          color="#3b82f6"
          label="Z (Up)"
          labelOffset={{ x: 0, y: 0, z: 15 }}
        />
      </g>
    );
  };

  // Flow particles on water surface
  const FlowParticles = () => {
    const particles = [];
    const numParticles = 20;

    for (let i = 0; i < numParticles; i++) {
      const baseX = ((i % 5) - 2) * 60;
      const baseY = (Math.floor(i / 5) - 2) * 60;

      const animOffset = ((time * currentSpeed * 0.4 + i * 0.4) % 4) - 2;
      const x = baseX + animOffset * 30 * Math.cos(currentRad);
      const y = baseY + animOffset * 30 * Math.sin(currentRad);

      if (Math.abs(x) < 180 && Math.abs(y) < 180) {
        const pos = toScreen(x, y, -5);
        particles.push(
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={3}
            fill="rgba(147, 197, 253, 0.5)"
          />
        );
      }
    }
    return <g>{particles}</g>;
  };

  // Floating object (ellipsoid)
  const FloatingObject = () => {
    const bobZ = Math.sin(time * 2) * 3;
    const driftX = forces.current.x * 0.03;
    const driftY = forces.current.y * 0.03;

    const objectCenter = { x: driftX, y: driftY, z: 20 + bobZ };
    const radiusXY = 35;
    const radiusZ = 25;

    const slices = [];

    for (let z = -radiusZ; z <= 0; z += 8) {
      const sliceRadius = radiusXY * Math.sqrt(1 - (z / radiusZ) ** 2);
      const pos = toScreen(objectCenter.x, objectCenter.y, objectCenter.z + z);
      slices.push(
        <ellipse
          key={`under-${z}`}
          cx={pos.x}
          cy={pos.y}
          rx={sliceRadius * cos30 * scale}
          ry={sliceRadius * sin30 * scale}
          fill="none"
          stroke="#c2410c"
          strokeWidth="2"
          opacity={0.6}
        />
      );
    }

    for (let z = 0; z <= radiusZ; z += 8) {
      const sliceRadius = radiusXY * Math.sqrt(1 - (z / radiusZ) ** 2);
      const pos = toScreen(objectCenter.x, objectCenter.y, objectCenter.z + z);
      slices.push(
        <ellipse
          key={`above-${z}`}
          cx={pos.x}
          cy={pos.y}
          rx={sliceRadius * cos30 * scale}
          ry={sliceRadius * sin30 * scale}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
        />
      );
    }

    const waterlinePos = toScreen(
      objectCenter.x,
      objectCenter.y,
      objectCenter.z
    );

    return (
      <g>
        <ellipse
          cx={toScreen(objectCenter.x, objectCenter.y, 0).x}
          cy={toScreen(objectCenter.x, objectCenter.y, 0).y}
          rx={radiusXY * cos30 * scale * 0.8}
          ry={radiusXY * sin30 * scale * 0.8}
          fill="rgba(0,0,0,0.2)"
        />

        {slices}

        <ellipse
          cx={waterlinePos.x}
          cy={waterlinePos.y}
          rx={radiusXY * cos30 * scale}
          ry={radiusXY * sin30 * scale}
          fill="#f97316"
          fillOpacity="0.8"
          stroke="#ea580c"
          strokeWidth="2"
        />

        <circle cx={waterlinePos.x} cy={waterlinePos.y} r="4" fill="#fff" />

        <Arrow3D
          start={objectCenter}
          direction={forces.gravity}
          color="#ef4444"
          label="Weight"
          labelOffset={{ x: 15, y: 0, z: -10 }}
        />
        <Arrow3D
          start={objectCenter}
          direction={forces.buoyancy}
          color="#22c55e"
          label="Buoyancy"
          labelOffset={{ x: 15, y: 0, z: 10 }}
        />
        <Arrow3D
          start={objectCenter}
          direction={forces.current}
          color="#3b82f6"
          label="Current"
          labelOffset={{
            x: Math.cos(currentRad) * 20,
            y: Math.sin(currentRad) * 20,
            z: 5,
          }}
        />
        {currentSpeed > 0.2 && (
          <Arrow3D
            start={objectCenter}
            direction={forces.drag}
            color="#a855f7"
            label="Drag"
            labelOffset={{
              x: -Math.cos(currentRad) * 20,
              y: -Math.sin(currentRad) * 20,
              z: 5,
            }}
          />
        )}
      </g>
    );
  };

  const WaterSurface = () => {
    const size = 180;
    const corners = [
      toScreen(-size, -size, 0),
      toScreen(size, -size, 0),
      toScreen(size, size, 0),
      toScreen(-size, size, 0),
    ];

    return (
      <polygon
        points={corners.map((c) => `${c.x},${c.y}`).join(" ")}
        fill="url(#waterGradient3d)"
        opacity="0.85"
      />
    );
  };

  const ZeroPlaneLabel = () => {
    const pos = toScreen(150, -150, 0);
    return (
      <text x={pos.x} y={pos.y} fill="#94a3b8" fontSize="12" fontWeight="bold">
        z = 0 (water surface)
      </text>
    );
  };

  type CompassRoseProps = {
    cx: number;
    cy: number;
    radius: number;
    heading: number;
  };

  // Compass Rose Component
  const CompassRose = ({ cx, cy, radius, heading }: CompassRoseProps) => {
    const headingRad = ((-heading + 90) * Math.PI) / 180;

    return (
      <g transform={`translate(${cx}, ${cy})`}>
        {/* Outer circle */}
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="rgba(0,0,0,0.4)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Cardinal direction marks */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = ((-deg + 90) * Math.PI) / 180;
          const x1 = Math.cos(rad) * (radius - 8);
          const y1 = -Math.sin(rad) * (radius - 8);
          const x2 = Math.cos(rad) * radius;
          const y2 = -Math.sin(rad) * radius;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          );
        })}

        {/* Intercardinal marks */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = ((-deg + 90) * Math.PI) / 180;
          const x1 = Math.cos(rad) * (radius - 5);
          const y1 = -Math.sin(rad) * (radius - 5);
          const x2 = Math.cos(rad) * radius;
          const y2 = -Math.sin(rad) * radius;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#64748b"
              strokeWidth="1"
            />
          );
        })}

        {/* Cardinal labels */}
        <text
          x="0"
          y={-radius - 8}
          fill="#22c55e"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          N
        </text>
        <text
          x={radius + 10}
          y="4"
          fill="#ef4444"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          E
        </text>
        <text
          x="0"
          y={radius + 14}
          fill="#94a3b8"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          S
        </text>
        <text
          x={-radius - 10}
          y="4"
          fill="#94a3b8"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          W
        </text>

        {/* Current direction arrow */}
        <line
          x1="0"
          y1="0"
          x2={Math.cos(headingRad) * (radius - 15)}
          y2={-Math.sin(headingRad) * (radius - 15)}
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx={Math.cos(headingRad) * (radius - 15)}
          cy={-Math.sin(headingRad) * (radius - 15)}
          r="5"
          fill="#3b82f6"
        />
        <circle cx="0" cy="0" r="4" fill="#1e40af" />
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2">
        Isometric 3D Force Diagram
      </h1>
      <p className="text-slate-400 text-sm mb-4">
        Z-axis normal to water surface (z=0) • Compass heading (N=0°)
      </p>

      <svg
        width="700"
        height="500"
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-xl"
      >
        <defs>
          <linearGradient
            id="waterGradient3d"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <radialGradient id="skyGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="700" height="500" fill="url(#skyGlow)" />

        <CoordinateAxes />
        <WaterSurface />
        <WaterGrid />
        <FlowParticles />
        <ZeroPlaneLabel />
        <FloatingObject />

        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect
            x="0"
            y="0"
            width="160"
            height="130"
            fill="rgba(0,0,0,0.6)"
            rx="8"
          />
          <text x="10" y="22" fill="white" fontSize="12" fontWeight="bold">
            Forces:
          </text>
          <line
            x1="10"
            y1="40"
            x2="30"
            y2="40"
            stroke="#ef4444"
            strokeWidth="3"
          />
          <text x="35" y="44" fill="#ef4444" fontSize="11">
            Weight (−Z)
          </text>
          <line
            x1="10"
            y1="58"
            x2="30"
            y2="58"
            stroke="#22c55e"
            strokeWidth="3"
          />
          <text x="35" y="62" fill="#22c55e" fontSize="11">
            Buoyancy (+Z)
          </text>
          <line
            x1="10"
            y1="76"
            x2="30"
            y2="76"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          <text x="35" y="80" fill="#3b82f6" fontSize="11">
            Current (XY plane)
          </text>
          <line
            x1="10"
            y1="94"
            x2="30"
            y2="94"
            stroke="#a855f7"
            strokeWidth="3"
          />
          <text x="35" y="98" fill="#a855f7" fontSize="11">
            Drag (opposes current)
          </text>
          <text x="10" y="118" fill="#94a3b8" fontSize="10">
            N(+Y) E(+X) Z(up)
          </text>
        </g>

        {/* Compass Rose */}
        <g transform="translate(620, 80)">
          <text
            x="0"
            y="-50"
            fill="white"
            fontSize="11"
            textAnchor="middle"
            fontWeight="bold"
          >
            Current Heading
          </text>
          <CompassRose cx={0} cy={0} radius={40} heading={currentHeading} />
          <text
            x="0"
            y="58"
            fill="#3b82f6"
            fontSize="12"
            textAnchor="middle"
            fontWeight="bold"
          >
            {currentHeading}° {getCardinalLabel(currentHeading)}
          </text>
        </g>
      </svg>

      {/* Controls */}
      <div className="mt-6 p-6 bg-slate-800 rounded-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold text-white mb-4">
          Current Controls
        </h2>

        <div className="mb-5">
          <label className="block text-sm text-slate-300 mb-2">
            Current Speed:{" "}
            <span className="text-blue-400 font-mono">
              {currentSpeed.toFixed(1)} m/s
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={currentSpeed}
            onChange={(e) => setCurrentSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0 m/s</span>
            <span>2.5 m/s</span>
            <span>5 m/s</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm text-slate-300 mb-2">
            Current Heading:{" "}
            <span className="text-blue-400 font-mono">
              {currentHeading}° ({getCardinalLabel(currentHeading)})
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="359"
            value={currentHeading}
            onChange={(e) => setCurrentHeading(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>N (0°)</span>
            <span>E (90°)</span>
            <span>S (180°)</span>
            <span>W (270°)</span>
            <span>N</span>
          </div>
        </div>

        {/* Cardinal Direction Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "N", heading: 0, color: "bg-green-600" },
            { label: "NE", heading: 45, color: "bg-teal-600" },
            { label: "E", heading: 90, color: "bg-red-600" },
            { label: "SE", heading: 135, color: "bg-orange-600" },
          ].map(({ label, heading, color }) => (
            <button
              key={heading}
              onClick={() => setCurrentHeading(heading)}
              className={`px-3 py-2 rounded font-bold transition-all text-sm ${
                currentHeading === heading
                  ? `${color} text-white ring-2 ring-white`
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {label} ({heading}°)
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[
            { label: "S", heading: 180, color: "bg-slate-600" },
            { label: "SW", heading: 225, color: "bg-indigo-600" },
            { label: "W", heading: 270, color: "bg-purple-600" },
            { label: "NW", heading: 315, color: "bg-cyan-600" },
          ].map(({ label, heading, color }) => (
            <button
              key={heading}
              onClick={() => setCurrentHeading(heading)}
              className={`px-3 py-2 rounded font-bold transition-all text-sm ${
                currentHeading === heading
                  ? `${color} text-white ring-2 ring-white`
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {label} ({heading}°)
            </button>
          ))}
        </div>

        {/* 3D Force components */}
        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Force Vectors (3D Components):
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2 bg-slate-800 rounded">
              <span className="text-red-400">Weight:</span>
              <div className="text-slate-400 mt-1">F = (0, 0, −mg)</div>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <span className="text-green-400">Buoyancy:</span>
              <div className="text-slate-400 mt-1">F = (0, 0, +ρVg)</div>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <span className="text-blue-400">
                Current ({getCardinalLabel(currentHeading)}):
              </span>
              <div className="text-slate-400 mt-1">
                F = ({(forces.current.x / 10).toFixed(1)},{" "}
                {(forces.current.y / 10).toFixed(1)}, 0)
              </div>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <span className="text-purple-400">Drag:</span>
              <div className="text-slate-400 mt-1">
                F = ({(forces.drag.x / 10).toFixed(1)},{" "}
                {(forces.drag.y / 10).toFixed(1)}, 0)
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-slate-800 rounded text-center">
            <span className="text-yellow-400 text-xs">Net Horizontal:</span>
            <span className="text-slate-300 text-xs ml-2 font-mono">
              ({((forces.current.x + forces.drag.x) / 10).toFixed(1)},{" "}
              {((forces.current.y + forces.drag.y) / 10).toFixed(1)}, 0)
            </span>
          </div>
        </div>

        {/* Coordinate Reference */}
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            Coordinate Reference:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-400">
              <span className="text-green-400 font-bold">N (0°)</span> → +Y
              direction
            </div>
            <div className="text-slate-400">
              <span className="text-red-400 font-bold">E (90°)</span> → +X
              direction
            </div>
            <div className="text-slate-400">
              <span className="text-slate-300 font-bold">S (180°)</span> → −Y
              direction
            </div>
            <div className="text-slate-400">
              <span className="text-purple-400 font-bold">W (270°)</span> → −X
              direction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
