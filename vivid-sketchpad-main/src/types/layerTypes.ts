export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  canvasData: string;
  zIndex: number;
}

export interface LayerState {
  layers: Layer[];
  activeLayerId: string;
}

export type LayerAction = 
  | { type: 'ADD_LAYER'; layer: Layer }
  | { type: 'DELETE_LAYER'; layerId: string }
  | { type: 'SET_ACTIVE_LAYER'; layerId: string }
  | { type: 'UPDATE_LAYER'; layerId: string; updates: Partial<Layer> }
  | { type: 'REORDER_LAYERS'; layers: Layer[] }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; layerId: string }
  | { type: 'SET_LAYER_OPACITY'; layerId: string; opacity: number };