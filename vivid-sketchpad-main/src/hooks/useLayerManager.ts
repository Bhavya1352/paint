import { useReducer, useCallback } from 'react';
import { Layer, LayerState, LayerAction } from '@/types/layerTypes';

const layerReducer = (state: LayerState, action: LayerAction): LayerState => {
  switch (action.type) {
    case 'ADD_LAYER':
      return {
        ...state,
        layers: [...state.layers, action.layer],
        activeLayerId: action.layer.id,
      };
    
    case 'DELETE_LAYER':
      const filteredLayers = state.layers.filter(layer => layer.id !== action.layerId);
      return {
        ...state,
        layers: filteredLayers,
        activeLayerId: filteredLayers.length > 0 ? filteredLayers[0].id : '',
      };
    
    case 'SET_ACTIVE_LAYER':
      return {
        ...state,
        activeLayerId: action.layerId,
      };
    
    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.layerId ? { ...layer, ...action.updates } : layer
        ),
      };
    
    case 'REORDER_LAYERS':
      return {
        ...state,
        layers: action.layers,
      };
    
    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.layerId ? { ...layer, visible: !layer.visible } : layer
        ),
      };
    
    case 'SET_LAYER_OPACITY':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.layerId ? { ...layer, opacity: action.opacity } : layer
        ),
      };
    
    default:
      return state;
  }
};

export const useLayerManager = () => {
  const initialState: LayerState = {
    layers: [{
      id: 'layer-1',
      name: 'Background',
      visible: true,
      opacity: 100,
      canvasData: '',
      zIndex: 0,
    }],
    activeLayerId: 'layer-1',
  };

  const [state, dispatch] = useReducer(layerReducer, initialState);

  const addLayer = useCallback(() => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${state.layers.length + 1}`,
      visible: true,
      opacity: 100,
      canvasData: '',
      zIndex: state.layers.length,
    };
    dispatch({ type: 'ADD_LAYER', layer: newLayer });
  }, [state.layers.length]);

  const deleteLayer = useCallback((layerId: string) => {
    if (state.layers.length > 1) {
      dispatch({ type: 'DELETE_LAYER', layerId });
    }
  }, [state.layers.length]);

  const setActiveLayer = useCallback((layerId: string) => {
    dispatch({ type: 'SET_ACTIVE_LAYER', layerId });
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', layerId, updates });
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', layerId });
  }, []);

  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    dispatch({ type: 'SET_LAYER_OPACITY', layerId, opacity });
  }, []);

  const reorderLayers = useCallback((layers: Layer[]) => {
    dispatch({ type: 'REORDER_LAYERS', layers });
  }, []);

  return {
    layers: state.layers,
    activeLayerId: state.activeLayerId,
    activeLayer: state.layers.find(layer => layer.id === state.activeLayerId),
    addLayer,
    deleteLayer,
    setActiveLayer,
    updateLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    reorderLayers,
  };
};