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
    error: 5
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
 * - The row and column indices are zero-based and correspond to the position of the point within the grid.
 * - This type is essential for managing and visualizing the ASV's environment and planned movements.
 * 
 * @value row - The row index of the grid point
 * @value col - The column index of the grid point
 * 
 * Couldn't this be a tuple? Yes, 
 * but this is more readable and easier to work with in the context of the grids.
 */
type Cell = {
    type?: CellType;
    row: number;
    col: number;
};

/**
 * Initial cell state for the grid
 * 
 * @author Carson Fujita
 * @remarks
 * - This constant represents the initial state of a cell in the grid, with a default type of empty and row and column indices set to 0.
 * - It is used as a default value when initializing the grid or when resetting cell states.
 * 
 * @value type - The initial type of the cell, set to empty (0)
 * @value row - The initial row index of the cell, set to 0
 * @value col - The initial column index of the cell, set to 0
 */
const InitialCell: Cell = {
    type: CellTypes.empty,
    row: 0,
    col: 0
};

/**
 * Type representing the grid structure for occupancy and navigation grids
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents the grid structure used for both occupancy and navigation grids, defined as a two-dimensional array of cells.
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



export type { Cell, CellType, Grid, Path};
export { CellTypes, InitialCell };