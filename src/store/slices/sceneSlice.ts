/**
 * @file sceneSlice.ts
 * @description Redux slice for the scene registry and event log. Tracks the active
 * visualizer scene (mapping vs forces), registered scene descriptors, and a capped
 * log of recent scene events (objective reached, map regenerated, etc.).
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

export type SceneId = 'mapping' | 'forces';

/**
 * @type SceneEventType
 * @description Enumerates the types of scene events that can be logged in the Redux store.
 * @remarks
 * The scene event types include:
 * - 'OBJECTIVE_REACHED': An objective has been reached in the scene.
 * - 'SCENE_CHANGED': The active scene has changed.
 * - 'ENTITY_SPAWNED': A new entity has been spawned in the scene.
 * - 'ENTITY_REMOVED': An entity has been removed from the scene.
 * - 'MAP_REGENERATED': The map has been regenerated.
 * - 'CONNECTION_CHANGED': The connection status has changed.
 * - 'FOG_RESET': The fog of war has been reset.
 */
export type SceneEventType =
    | 'OBJECTIVE_REACHED'
    | 'SCENE_CHANGED'
    | 'ENTITY_SPAWNED'
    | 'ENTITY_REMOVED'
    | 'MAP_REGENERATED'
    | 'CONNECTION_CHANGED'
    | 'FOG_RESET';

/**
 * @interface SceneEvent
 * @description Represents an event that occurs within a scene, to be logged in the Redux store.
 * @property {string} id - A unique identifier for the event, generated using `crypto.randomUUID()`.
 * @property {SceneEventType} type - The type of the event, as defined in {@link SceneEventType}.
 * @property {SceneId} sceneId - The identifier of the scene where the event occurred.
 * @property {number} timestamp - The timestamp of when the event occurred, in milliseconds since the Unix epoch.
 * @property {Record<string, unknown>} [payload] - An optional payload containing additional data relevant to the event.
 * @remarks
 * Scene events are used to track significant occurrences within a scene, such as changes in objectives, entity states, or map regeneration. The events are stored in a capped log to provide a history of recent activity without consuming excessive memory.
 */
export interface SceneEvent {
    id: string;
    type: SceneEventType;
    sceneId: SceneId;
    timestamp: number;
    payload?: Record<string, unknown>;
}

/**
 * @interface SceneDescriptor
 * @description Describes a visualizer scene, including its identifier, display name, and tab index.
 * @property {SceneId} id - The unique identifier for the scene (e.g., 'mapping', 'forces').
 * @property {string} displayName - The human-readable name of the scene, used in the UI.
 * @property {number} tabIndex - The legacy numeric index for the MUI Tabs value prop, used for tab navigation.
 * @remarks
 * Scene descriptors are registered in the Redux store to allow dynamic management of available scenes. 
 * Each descriptor provides essential information for rendering and navigating between scenes in the visualizer.
 */
export interface SceneDescriptor {
    id: SceneId;
    displayName: string;
    /** Legacy numeric index for MUI Tabs value prop. */
    tabIndex: number;
}

/**
 * @interface SceneState
 * @description Represents the state of the scene slice in the Redux store.
 * @property {SceneDescriptor[]} registeredScenes - An array of registered scene descriptors.
 * @property {SceneId} activeSceneId - The identifier of the currently active scene.
 * @property {SceneEvent[]} recentEvents - A capped log of recent scene events, ordered by timestamp.
 * @remarks
 * The scene state is used to manage the available scenes in the visualizer, track which scene is currently active, 
 * and maintain a history of significant events that have occurred within the scenes. The recent events log is capped to 
 * prevent unbounded growth in memory usage.
 */
export interface SceneState {
    registeredScenes: SceneDescriptor[];
    activeSceneId: SceneId;
    recentEvents: SceneEvent[];
}

/**
 * @constant INITIAL_SCENES
 * @description The initial set of registered scenes in the Redux store.
 * @type {SceneDescriptor[]}
 * @remarks
 * This constant defines the default scenes available in the visualizer upon application startup. 
 * It includes the 'mapping' scene for coordinate mapping and the 'forces' scene for force simulation.
 */
const INITIAL_SCENES: SceneDescriptor[] = [
    { id: 'mapping', displayName: 'Coordinate Mapping', tabIndex: 0 },
    { id: 'forces',  displayName: 'Force Simulation',   tabIndex: 1 },
];

/**
 * @constant initialState
 * @description The initial state of the scene slice in the Redux store.
 * @type {SceneState}
 * @remarks
 * The initial state sets the registered scenes to {@link INITIAL_SCENES}, the active scene to 'mapping', 
 * and initializes an empty array for recent events. This state is used when the application first loads or when the scene state is reset.
 */
const initialState: SceneState = {
    registeredScenes: INITIAL_SCENES,
    activeSceneId: 'mapping',
    recentEvents: [],
};

/**
 * @constant MAX_EVENTS
 * @description The maximum number of recent scene events to retain in the Redux store.
 * @remarks
 * This constant defines the cap for the recent events log, ensuring that only the most recent 50 events are kept. 
 * When a new event is added and the log exceeds this limit, the oldest event is removed to maintain the cap.
 */
const MAX_EVENTS = 50;

/**
 * @constant sceneSlice
 * @description Redux slice for managing the scene registry and event log.
 * @see {@link SceneState} for the structure of the state.
 * @remarks
 * This slice provides actions and reducers to manage the registered scenes, active scene, and recent events in the visualizer.
 * It includes actions to register new scenes, set the active scene, dispatch scene events, and clear the event log. 
 * The slice also includes selectors to access the active scene, registered scenes, recent events, and the active tab index for UI navigation.
 */
export const sceneSlice = createSlice({
    name: 'scene',
    initialState,
    reducers: {
        registerScene(state, action: PayloadAction<SceneDescriptor>) {
            const exists = state.registeredScenes.some(s => s.id === action.payload.id);
            if (!exists) state.registeredScenes.push(action.payload);
        },
        setActiveScene(state, action: PayloadAction<SceneId>) {
            if (state.activeSceneId !== action.payload) {
                state.activeSceneId = action.payload;
                state.recentEvents.push({
                    id: crypto.randomUUID(),
                    type: 'SCENE_CHANGED',
                    sceneId: action.payload,
                    timestamp: Date.now(),
                });
                if (state.recentEvents.length > MAX_EVENTS) state.recentEvents.shift();
            }
        },
        dispatchSceneEvent(state, action: PayloadAction<Omit<SceneEvent, 'id' | 'timestamp'>>) {
            state.recentEvents.push({
                ...action.payload,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
            });
            if (state.recentEvents.length > MAX_EVENTS) state.recentEvents.shift();
        },
        clearSceneEvents(state) {
            state.recentEvents = [];
        },
    },
});

export const { registerScene, setActiveScene, dispatchSceneEvent, clearSceneEvents } = sceneSlice.actions;

// Selectors — use a structural type to avoid circular import with store.ts
type WithScene = { scene: SceneState };
export const selectActiveScene      = (state: WithScene) => state.scene.activeSceneId;
export const selectRegisteredScenes = (state: WithScene) => state.scene.registeredScenes;
export const selectRecentEvents     = (state: WithScene) => state.scene.recentEvents;
export const selectActiveTabIndex   = createSelector(
    [selectRegisteredScenes, selectActiveScene],
    (scenes, activeId) => scenes.find(s => s.id === activeId)?.tabIndex ?? 0,
);

export default sceneSlice.reducer;
