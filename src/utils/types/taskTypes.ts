/**
 * Location of a task
 * 
 * @author Carson Fujita
 * @remarks
 * - This interface represents the location of a task, which includes latitude and longitude coordinates. 
 * 
 * @value id - Optional unique identifier for the task location
 * @value latitude - Latitude coordinate of the task location
 * @value longitude - Longitude coordinate of the task location
 */
type TaskLocation = {
    id?: string;
    latitude: number;
    longitude: number;

};

/**
 * Data associated with a task
 * 
 * @author Carson Fujita
 * @remarks
 * - This interface represents the data associated with a task, including its name, status, and location coordinates.
 * 
 * @value id - Unique identifier for the task
 * @value name - Name of the task
 * @value status - Current {@link TaskStatus} of the task (e.g., "autonomous", "remote", "standby", "lost connection", "out of control")
 * @value latitude - Latitude coordinate of the task's location
 * @value longitude - Longitude coordinate of the task's location
 */
type TaskData = {
    id: number;
    name: string;
    status: TaskStatus;
    latitude: number;
    longitude: number;
};


/**
 * Constant values representing possible task statuses
 * 
 * @author Carson Fujita
 * @remarksdue
 * - These values are used to represent the different statuses a task can have, such as "autonomous", "remote", "standby", "lost connection", and "out of control".
 * - not an enum due to restrictions
 * @see {@link TaskStatus}
 */
const TaskValues = {
    Autonomous: "autonomous",
    Remote: "remote",
    Standby: "standby",
    LostConnection: "lost connection",
    OutOfControl: "out of control"
};

/**
 * Type representing the possible task statuses
 * 
 * @author Carson Fujita
 * @see {@link TaskValues}
 * @remarks
 * - This type is derived from the values defined in {@link TaskValues} and is used to ensure type safety when working with task statuses throughout the application.
 */
type TaskStatus = typeof TaskValues[keyof typeof TaskValues];

export type { TaskLocation, TaskData, TaskStatus };
export { TaskValues };