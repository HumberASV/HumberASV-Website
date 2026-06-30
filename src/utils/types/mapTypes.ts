/**
 * @file utils/types/mapTypes.ts
 * @description Grid types, cell constants, and world-space configuration for the ASV mapping visualizer.
 * Isometric projection math lives in utils/math/isometric.ts.
 *
 * @author Carson Fujita
 * @license MIT
 */


// Configuration Constants

/** Number of cells in the global grid. Must match the telemetry factory grid dimensions. */
const GLOBAL_GRID_SIZE = 20;
/** Size of each global grid cell in pixels. */
const GLOBAL_CELL_SIZE = 40;
/** Total world-pixel span of the local grid (3 global cells). */
const LOCAL_GRID_WORLD_SIZE = 3 * GLOBAL_CELL_SIZE;
/** Size of each local cell in pixels — 1/5 of one global cell. */
const LOCAL_CELL_SIZE = GLOBAL_CELL_SIZE / 5;
/** Number of local cells per axis (derived). */
const LOCAL_GRID_SIZE = LOCAL_GRID_WORLD_SIZE / LOCAL_CELL_SIZE;
/** Height of the Z walls in world pixels — one global cell tall. */
const LOCAL_WALL_HEIGHT = GLOBAL_CELL_SIZE;
/** Extrusion height for obstacle cells in world pixels — a subtle lift above the floor. */
const LOCAL_OBSTACLE_HEIGHT = LOCAL_CELL_SIZE / 2;

/** Horizontal offset to center the SVG origin. */
const CENTER_X = 500;
/** Vertical offset to center the SVG origin. */
const CENTER_Y = 500;

/** Default movement velocity for the local frame in units per second. */
const DEFAULT_VELOCITY = 0.5;


/**
 * Grid item type for occupancy and navigation grids
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents the possible values for grid items in the occupancy and 
 *      navigation grids, such as empty, occupied, path, current position, and objective.
 * - The actual values are defined in {@link CellTypes}.
 */
const CellTypes = {
    empty: 0,
    occupied: 1,
    path:2,
    current: 3,
    objective: 4,
    error: 5,
    history: 6,
}

/**
 * Type representing the possible grid item values
 * 
 * @author Carson Fujita
 * @see {@link CellTypes}
 * @remarks
 * - This type is derived from the values defined in {@link CellTypes} 
 * and is used to ensure type safety when working with grid items throughout the application.
 */
type CellType = typeof CellTypes[keyof typeof CellTypes];

/**
 * Point on the grid for navigation and occupancy grids
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents a point on the grid, defined by its row and column indices. 
 * - It is used to represent positions in the occupancy and navigation grids, as well as points along the planned path.
 * - The x and y indices are zero-based and correspond to the position of the point within the grid.
 * - This type is essential for managing and visualizing the ASV's environment and planned movements.
 * 
 * @value x - The x index of the grid point
 * @value y - The y index of the grid point
 * 
 * Couldn't this be a tuple? Yes, 
 * but this is more readable and easier to work with in the context of the grids.
 */
type Cell = {
    type?: CellType;
    x: number;
    y: number;
    z?: number; // optional z index for 3D grids
};

/**
 * Initial cell state for the grid
 * 
 * @author Carson Fujita
 * @remarks
 * - This constant represents the initial state of a cell in the grid, with a default type of empty and x and y indices set to 0.
 * - It is used as a default value when initializing the grid or when resetting cell states.
 * 
 * @value type - The initial type of the cell, set to empty (0)
 * @value x - The initial x index of the cell, set to 0
 * @value y - The initial y index of the cell, set to 0
 * @value z - The initial z index of the cell, optional and set to 0 if used in a 3D grid
 */
const InitialCell: Cell = {
    type: CellTypes.empty,
    x: 0,
    y: 0,
    z: 0
};


/**
 * Type representing the grid structure for occupancy and navigation grids
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents the grid structure used for both occupancy and navigation grids, defined as a two or three-dimensional array of cells.
 * - Each cell in the grid can have a specific type (e.g., empty, occupied, path) that indicates its status in the ASV's environment.
 * - The grid is essential for visualizing the ASV's surroundings and planned movements, allowing for effective navigation and obstacle avoidance.
 */
type Grid = Cell[][];

/**
 * Type representing a path for the ASV, defined as an array of cells
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents a path for the ASV, defined as an array of cells that the ASV is planned to follow.
 * - Each cell in the path corresponds to a specific point on the grid, indicating the ASV's intended route through its environment.
 * - The path is crucial for navigation and mission planning, allowing the ASV to move efficiently and avoid obstacles based on the occupancy grid.
 * - The path can be visualized on the map to provide a clear representation of the ASV's planned movements.
 */
type Path = Cell[];


export type { Cell, CellType, Grid, Path };
export { CellTypes, InitialCell, GLOBAL_GRID_SIZE, GLOBAL_CELL_SIZE, LOCAL_GRID_WORLD_SIZE, LOCAL_GRID_SIZE, LOCAL_CELL_SIZE, LOCAL_WALL_HEIGHT, LOCAL_OBSTACLE_HEIGHT, CENTER_X, CENTER_Y, DEFAULT_VELOCITY };