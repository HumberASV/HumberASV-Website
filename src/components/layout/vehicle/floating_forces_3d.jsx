// src\components\layout\vehicle\floating_forces_3d.jsx
import React, { useState, useEffect } from "react";

export default function IsometricFloatingForces() {
  const [currentSpeed, setCurrentSpeed] = useState(50);
  const [currentAngleXY, setCurrentAngleXY] = useState(45); // Angle in XY plane (water surface)
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Isometric projection constants
  const isoAngle = Math.PI / 6; // 30 degrees
  const cos30 = Math.cos(isoAngle);
  const sin30 = Math.sin(isoAngle);

  // Convert 3D coordinates to 2D isometric screen coordinates
  const toIso = (x, y, z) => {
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
  const toScreen = (x, y, z) => {
    const iso = toIso(x * scale, y * scale, z * scale);
    return { x: centerX + iso.x, y: centerY + iso.y };
  };

  // Force magnitudes
  const gravityMag = 70;
  const buoyancyMag = 70;
  const currentMag = currentSpeed * 0.7;
  const dragMag = currentSpeed * 0.35;

  // Current direction in XY plane (radians)
  const currentRad = (currentAngleXY * Math.PI) / 180;

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

  // 3D Arrow component
  const Arrow3D = ({
    start,
    direction,
    color,
    label,
    labelOffset = { x: 0, y: 0, z: 0 },
  }) => {
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

    // Arrowhead calculation in screen space
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

    // Grid lines along X
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

    // Grid lines along Y
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

  // Coordinate axes
  const CoordinateAxes = () => {
    const axisLength = 80;
    const origin = { x: -120, y: -120, z: 0 };

    return (
      <g>
        {/* X axis (red) */}
        <Arrow3D
          start={origin}
          direction={{ x: axisLength, y: 0, z: 0 }}
          color="#ef4444"
          label="X"
          labelOffset={{ x: 15, y: 0, z: 0 }}
        />
        {/* Y axis (green) */}
        <Arrow3D
          start={origin}
          direction={{ x: 0, y: axisLength, z: 0 }}
          color="#22c55e"
          label="Y"
          labelOffset={{ x: 0, y: 15, z: 0 }}
        />
        {/* Z axis (blue) */}
        <Arrow3D
          start={origin}
          direction={{ x: 0, y: 0, z: axisLength }}
          color="#3b82f6"
          label="Z"
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

      const animOffset = ((time * currentSpeed * 0.02 + i * 0.4) % 4) - 2;
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

    // Draw ellipsoid using ellipses at different Z levels
    const slices = [];

    // Underwater part (darker)
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

    // Above water part (lighter)
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

    // Main body ellipse (at water line z=0 relative to object)
    const waterlinePos = toScreen(
      objectCenter.x,
      objectCenter.y,
      objectCenter.z
    );

    return (
      <g>
        {/* Object shadow on water */}
        <ellipse
          cx={toScreen(objectCenter.x, objectCenter.y, 0).x}
          cy={toScreen(objectCenter.x, objectCenter.y, 0).y}
          rx={radiusXY * cos30 * scale * 0.8}
          ry={radiusXY * sin30 * scale * 0.8}
          fill="rgba(0,0,0,0.2)"
        />

        {slices}

        {/* Solid fill for main body */}
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

        {/* Center point */}
        <circle cx={waterlinePos.x} cy={waterlinePos.y} r="4" fill="#fff" />

        {/* Force arrows from object center */}
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
        {currentSpeed > 10 && (
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

  // Water surface plane
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

  // Z=0 plane indicator
  const ZeroPlaneLabel = () => {
    const pos = toScreen(150, -150, 0);
    return (
      <text x={pos.x} y={pos.y} fill="#94a3b8" fontSize="12" fontWeight="bold">
        z = 0 (water surface)
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2">
        Isometric 3D Force Diagram
      </h1>
      <p className="text-slate-400 text-sm mb-4">
        Z-axis normal to water surface (z=0)
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

        {/* Background */}
        <rect x="0" y="0" width="700" height="500" fill="url(#skyGlow)" />

        {/* Coordinate axes */}
        <CoordinateAxes />

        {/* Water surface */}
        <WaterSurface />

        {/* Grid on water */}
        <WaterGrid />

        {/* Flow particles */}
        <FlowParticles />

        {/* Z=0 label */}
        <ZeroPlaneLabel />

        {/* Floating object with forces */}
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
            Axes: X(red) Y(green) Z(blue)
          </text>
        </g>

        {/* Current vector indicator */}
        <g transform="translate(540, 20)">
          <rect
            x="0"
            y="0"
            width="140"
            height="90"
            fill="rgba(0,0,0,0.6)"
            rx="8"
          />
          <text
            x="70"
            y="20"
            fill="white"
            fontSize="11"
            textAnchor="middle"
            fontWeight="bold"
          >
            Current Direction (XY)
          </text>
          <g transform="translate(70, 55)">
            <circle
              cx="0"
              cy="0"
              r="25"
              fill="none"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="-25"
              y2="0"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="25"
              y2="0"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-25"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="25"
              stroke="#475569"
              strokeWidth="1"
            />
            <text x="30" y="4" fill="#64748b" fontSize="9">
              +X
            </text>
            <text x="-38" y="4" fill="#64748b" fontSize="9">
              −X
            </text>
            <text x="-3" y="-28" fill="#64748b" fontSize="9">
              +Y
            </text>
            <text x="-3" y="36" fill="#64748b" fontSize="9">
              −Y
            </text>
            <line
              x1="0"
              y1="0"
              x2={Math.cos(currentRad) * 20}
              y2={-Math.sin(currentRad) * 20}
              stroke="#3b82f6"
              strokeWidth="3"
            />
            <circle
              cx={Math.cos(currentRad) * 20}
              cy={-Math.sin(currentRad) * 20}
              r="4"
              fill="#3b82f6"
            />
          </g>
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
            <span className="text-blue-400 font-mono">{currentSpeed}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentSpeed}
            onChange={(e) => setCurrentSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Calm</span>
            <span>Strong</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm text-slate-300 mb-2">
            Current Direction (XY Plane):{" "}
            <span className="text-blue-400 font-mono">{currentAngleXY}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={currentAngleXY}
            onChange={(e) => setCurrentAngleXY(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0° (+X)</span>
            <span>90° (+Y)</span>
            <span>180° (−X)</span>
            <span>270° (−Y)</span>
            <span>360°</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "+X", angle: 0, color: "bg-red-600" },
            { label: "+Y", angle: 90, color: "bg-green-600" },
            { label: "−X", angle: 180, color: "bg-red-800" },
            { label: "−Y", angle: 270, color: "bg-green-800" },
          ].map(({ label, angle, color }) => (
            <button
              key={angle}
              onClick={() => setCurrentAngleXY(angle)}
              className={`px-4 py-2 rounded font-bold transition-all ${
                currentAngleXY === angle
                  ? `${color} text-white ring-2 ring-white`
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {label}
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
              <span className="text-blue-400">Current:</span>
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
      </div>
    </div>
  );
}
