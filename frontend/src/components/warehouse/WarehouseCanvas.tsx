import React, { useState, useMemo } from 'react';
import { Warehouse, Obstacle as ObstacleType } from '../../types/warehouse';
import { Robot } from '../../types/robot';
import { Task } from '../../types/task';

interface WarehouseCanvasProps {
  warehouse: Warehouse;
  robots: Robot[];
  tasks: Task[];
  obstacles: ObstacleType[];
  selectedRobotId: number | null;
  onSelectRobot: (id: number) => void;
  onBlockCell: (x: number, y: number) => void;
  blockModeActive: boolean;
}

export const WarehouseCanvas: React.FC<WarehouseCanvasProps> = ({
  warehouse,
  robots,
  tasks,
  obstacles,
  selectedRobotId,
  onSelectRobot,
  onBlockCell,
  blockModeActive
}) => {
  const cellSize = 36;
  const width = warehouse.width || 30;
  const height = warehouse.height || 20;

  const svgWidth = width * cellSize;
  const svgHeight = height * cellSize;

  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Active blocked aisles set
  const blockedAisleCells = useMemo(() => {
    const set = new Set<string>();
    obstacles
      .filter((o) => o.active && o.obstacle_type === 'BLOCKED_AISLE')
      .forEach((obs) => {
        for (let dx = 0; dx < obs.width; dx++) {
          for (let dy = 0; dy < obs.height; dy++) {
            set.add(`${obs.x + dx},${obs.y + dy}`);
          }
        }
      });
    return set;
  }, [obstacles]);

  // Selected robot's path
  const selectedRobot = robots.find((r) => r.id === selectedRobotId);

  const handleCellClick = (x: number, y: number) => {
    if (blockModeActive) {
      onBlockCell(x, y);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 bg-white select-none overflow-hidden font-sans">
      {/* Block mode hint banner */}
      {blockModeActive && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20 bg-[#FF471D] text-white px-4 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>Click any aisle tile to place a blockage</span>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="relative rounded-xl bg-slate-50 p-2 overflow-auto max-w-full max-h-[75vh]">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="rounded-none shadow-none"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gridPattern" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <circle cx={cellSize / 2} cy={cellSize / 2} r="1" fill="#E2E8F0" />
            </pattern>

            {/* Hazard Stripe Pattern for Blocked Aisles */}
            <pattern id="hazardStripe" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="6" height="12" fill="#FCA5A5" />
              <rect x="6" y="0" width="6" height="12" fill="#EF4444" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={svgWidth} height={svgHeight} fill="#FFFFFF" />
          <rect width={svgWidth} height={svgHeight} fill="url(#gridPattern)" />

          {/* Warehouse Boundary Wall */}
          <rect
            x="1"
            y="1"
            width={svgWidth - 2}
            height={svgHeight - 2}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2"
            rx="0"
          />

          {/* Warehouse Static Cells: Shelves, Charging, Pickups, Deliveries */}
          {Array.from({ length: height }).map((_, y) =>
            Array.from({ length: width }).map((_, x) => {
              const cellType = warehouse.grid_data?.[y]?.[x] ?? 0;
              const isBlocked = blockedAisleCells.has(`${x},${y}`);

              // Charging pad
              if (cellType === 4) {
                return (
                  <g key={`cell-${x}-${y}`} transform={`translate(${x * cellSize}, ${y * cellSize})`}>
                    <rect
                      width={cellSize - 2}
                      height={cellSize - 2}
                      x="1"
                      y="1"
                      rx="0"
                      fill="#F0FDF4"
                      stroke="#86EFAC"
                      strokeWidth="1"
                    />
                    <text
                      x={cellSize / 2}
                      y={cellSize / 2 + 3}
                      textAnchor="middle"
                      fill="#166534"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      CHG
                    </text>
                  </g>
                );
              }

              // Pickup station
              if (cellType === 2) {
                return (
                  <g key={`cell-${x}-${y}`} transform={`translate(${x * cellSize}, ${y * cellSize})`}>
                    <rect
                      width={cellSize - 2}
                      height={cellSize - 2}
                      x="1"
                      y="1"
                      rx="0"
                      fill="#EFF6FF"
                      stroke="#93C5FD"
                      strokeWidth="1"
                    />
                    <text
                      x={cellSize / 2}
                      y={cellSize / 2 + 3}
                      textAnchor="middle"
                      fill="#1E40AF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      PICK
                    </text>
                  </g>
                );
              }

              // Delivery dropoff
              if (cellType === 3) {
                return (
                  <g key={`cell-${x}-${y}`} transform={`translate(${x * cellSize}, ${y * cellSize})`}>
                    <rect
                      width={cellSize - 2}
                      height={cellSize - 2}
                      x="1"
                      y="1"
                      rx="0"
                      fill="#FAF5FF"
                      stroke="#D8B4FE"
                      strokeWidth="1"
                    />
                    <text
                      x={cellSize / 2}
                      y={cellSize / 2 + 3}
                      textAnchor="middle"
                      fill="#6B21A8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      DROP
                    </text>
                  </g>
                );
              }

              // Shelf Storage Rack
              if (cellType === 1) {
                return (
                  <g key={`cell-${x}-${y}`} transform={`translate(${x * cellSize}, ${y * cellSize})`}>
                    <rect
                      width={cellSize - 1}
                      height={cellSize - 1}
                      x="0.5"
                      y="0.5"
                      rx="0"
                      fill="#F1F5F9"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                    {/* Shelf detail slats */}
                    <line x1="4" y1="8" x2={cellSize - 4} y2="8" stroke="#94A3B8" strokeWidth="1" />
                    <line x1="4" y1={cellSize / 2} x2={cellSize - 4} y2={cellSize / 2} stroke="#94A3B8" strokeWidth="1" />
                    <line x1="4" y1={cellSize - 8} x2={cellSize - 4} y2={cellSize - 8} stroke="#94A3B8" strokeWidth="1" />
                    {/* Small crate icon */}
                    <rect
                      x={cellSize / 2 - 4}
                      y={cellSize / 2 - 4}
                      width="8"
                      height="8"
                      fill="#FFFFFF"
                      stroke="#64748B"
                      strokeWidth="0.75"
                    />
                  </g>
                );
              }

              // Blocked Aisle Tile
              if (isBlocked) {
                return (
                  <g key={`cell-${x}-${y}`} transform={`translate(${x * cellSize}, ${y * cellSize})`}>
                    <rect
                      width={cellSize - 1}
                      height={cellSize - 1}
                      fill="url(#hazardStripe)"
                      stroke="#EF4444"
                      strokeWidth="1"
                      rx="0"
                    />
                    <text
                      x={cellSize / 2}
                      y={cellSize / 2 + 3}
                      textAnchor="middle"
                      fill="#FEE2E2"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      BLOCKED
                    </text>
                  </g>
                );
              }

              // Free aisle cell (interactive click target for blocking)
              return (
                <rect
                  key={`cell-${x}-${y}`}
                  x={x * cellSize}
                  y={y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={hoveredCell?.x === x && hoveredCell?.y === y && blockModeActive ? '#EF444433' : 'transparent'}
                  className={blockModeActive ? 'cursor-pointer transition-colors duration-150' : 'cursor-default'}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => handleCellClick(x, y)}
                />
              );
            })
          )}

          {/* Active Tasks Pickup & Dropoff Markers */}
          {tasks
            .filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS')
            .map((t) => {
              const assignedRobot = robots.find((r) => r.id === t.assigned_robot_id);
              const color = assignedRobot?.color || '#3B82F6';

              return (
                <g key={`task-marker-${t.id}`}>
                  {/* Pickup Pulse */}
                  {t.status === 'ASSIGNED' && (
                    <g transform={`translate(${t.pickup_x * cellSize + cellSize / 2}, ${t.pickup_y * cellSize + cellSize / 2})`}>
                      <circle r="12" fill={color} opacity="0.2" className="animate-ping" />
                      <circle r="6" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                  {/* Destination Marker */}
                  <g transform={`translate(${t.destination_x * cellSize + cellSize / 2}, ${t.destination_y * cellSize + cellSize / 2})`}>
                    <circle r="10" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
                    <circle r="4" fill={color} />
                  </g>
                </g>
              );
            })}

          {/* Robot Planned Paths */}
          {robots.map((robot) => {
            if (!robot.path || robot.path.length === 0) return null;
            const isSelected = robot.id === selectedRobotId;
            const strokeColor = robot.color || '#3B82F6';
            const opacity = isSelected ? 0.95 : 0.45;
            const strokeWidth = isSelected ? 3 : 1.5;

            // Generate polyline points from current position through planned waypoints
            const fullPoints = [
              [robot.position_x, robot.position_y],
              ...robot.path
            ];
            const polylinePoints = fullPoints
              .map(([px, py]) => `${px * cellSize + cellSize / 2},${py * cellSize + cellSize / 2}`)
              .join(' ');

            return (
              <g key={`path-${robot.id}`}>
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isSelected ? 'none' : '4 3'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={opacity}
                />
                {/* Waypoint dots */}
                {robot.path.map(([wx, wy], wIdx) => (
                  <circle
                    key={`wp-${robot.id}-${wIdx}`}
                    cx={wx * cellSize + cellSize / 2}
                    cy={wy * cellSize + cellSize / 2}
                    r={isSelected ? 2.5 : 1.5}
                    fill={strokeColor}
                    opacity={opacity}
                  />
                ))}
              </g>
            );
          })}

          {/* Autonomous Mobile Robots (AMRs) */}
          {robots.map((robot) => {
            const isSelected = robot.id === selectedRobotId;
            const cx = robot.position_x * cellSize + cellSize / 2;
            const cy = robot.position_y * cellSize + cellSize / 2;

            // Determine rotation from heading
            let rotation = 0;
            if (robot.heading === 'DOWN') rotation = 90;
            else if (robot.heading === 'LEFT') rotation = 180;
            else if (robot.heading === 'UP') rotation = 270;

            const isWaiting = robot.status === 'WAITING';
            const isBlocked = robot.status === 'BLOCKED';
            const isRerouting = robot.status === 'REROUTING';

            return (
              <g
                key={`robot-${robot.id}`}
                className="cursor-pointer transition-all duration-300 ease-out"
                onClick={() => onSelectRobot(robot.id)}
              >
                {/* Selection Highlight Ring */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={cellSize / 2 + 4}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Status Alert Aura */}
                {isWaiting && (
                  <circle cx={cx} cy={cy} r={cellSize / 2 + 2} fill="#F59E0B" opacity="0.3" className="animate-pulse" />
                )}
                {isRerouting && (
                  <circle cx={cx} cy={cy} r={cellSize / 2 + 2} fill="#8B5CF6" opacity="0.4" className="animate-pulse" />
                )}
                {isBlocked && (
                  <circle cx={cx} cy={cy} r={cellSize / 2 + 2} fill="#EF4444" opacity="0.5" className="animate-ping" />
                )}

                {/* Robot Chassis (Square straight edges, no drop shadow or glow) */}
                <rect
                  x={cx - cellSize / 2 + 4}
                  y={cy - cellSize / 2 + 4}
                  width={cellSize - 8}
                  height={cellSize - 8}
                  rx="0"
                  fill="#FFFFFF"
                  stroke={robot.color}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Heading Direction Arrow */}
                <g transform={`translate(${cx}, ${cy}) rotate(${rotation})`}>
                  <polygon points="6,0 0,-4 0,4" fill={robot.color} />
                  <circle cx="0" cy="0" r="2.5" fill="#212121" />
                </g>

                {/* Robot Name Label */}
                <text
                  x={cx}
                  y={cy - cellSize / 2 - 3}
                  textAnchor="middle"
                  fill="#212121"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {robot.name.split(' ')[0]}
                </text>

                {/* Battery Micro Bar */}
                <rect
                  x={cx - 10}
                  y={cy + cellSize / 2 + 2}
                  width="20"
                  height="3"
                  rx="0"
                  fill="#E2E8F0"
                />
                <rect
                  x={cx - 10}
                  y={cy + cellSize / 2 + 2}
                  width={Math.max(1, (20 * robot.battery) / 100)}
                  height="3"
                  rx="0"
                  fill={robot.battery > 40 ? '#10B981' : robot.battery > 20 ? '#F59E0B' : '#EF4444'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Telemetry Bar */}
      <div className="mt-3 flex items-center justify-between w-full max-w-4xl px-4 py-2 bg-slate-50 rounded-xl text-xs font-mono text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-slate-200 inline-block rounded-full"></span>
            <span>Shelf Rack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-400 inline-block rounded-full"></span>
            <span>Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-purple-400 inline-block rounded-full"></span>
            <span>Dropoff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 inline-block rounded-full"></span>
            <span>Charging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF471D] inline-block rounded-full"></span>
            <span>Blocked</span>
          </div>
        </div>

        <div className="text-slate-600">
          Grid: <span className="text-[#212121] font-bold">{width}x{height}</span> | AMRs: <span className="text-[#FF471D] font-bold">{robots.length}</span>
        </div>
      </div>
    </div>
  );
};
