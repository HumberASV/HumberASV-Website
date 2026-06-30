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

export type SceneEventType =
    | 'OBJECTIVE_REACHED'
    | 'SCENE_CHANGED'
    | 'ENTITY_SPAWNED'
    | 'ENTITY_REMOVED'
    | 'MAP_REGENERATED'
    | 'CONNECTION_CHANGED'
    | 'FOG_RESET';

export interface SceneEvent {
    id: string;
    type: SceneEventType;
    sceneId: SceneId;
    timestamp: number;
    payload?: Record<string, unknown>;
}

export interface SceneDescriptor {
    id: SceneId;
    displayName: string;
    /** Legacy numeric index for MUI Tabs value prop. */
    tabIndex: number;
}

export interface SceneState {
    registeredScenes: SceneDescriptor[];
    activeSceneId: SceneId;
    recentEvents: SceneEvent[];
}

const INITIAL_SCENES: SceneDescriptor[] = [
    { id: 'mapping', displayName: 'Coordinate Mapping', tabIndex: 0 },
    { id: 'forces',  displayName: 'Force Simulation',   tabIndex: 1 },
];

const initialState: SceneState = {
    registeredScenes: INITIAL_SCENES,
    activeSceneId: 'mapping',
    recentEvents: [],
};

const MAX_EVENTS = 50;

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
