import { Layer } from './layerTypes';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  layers: Layer[];
  activeLayerId: string;
  canvasWidth: number;
  canvasHeight: number;
  version: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}