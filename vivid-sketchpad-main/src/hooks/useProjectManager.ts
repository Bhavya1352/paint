import { useCallback, useState, useEffect } from 'react';
import { Project, ProjectMetadata } from '@/types/projectTypes';
import { Layer } from '@/types/layerTypes';

const STORAGE_KEY = 'mini-paint-projects';
const RECENT_KEY = 'mini-paint-recent';

export const useProjectManager = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [recentProjects, setRecentProjects] = useState<ProjectMetadata[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Load recent projects on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      setRecentProjects(JSON.parse(saved));
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled || !currentProject) return;

    const interval = setInterval(() => {
      saveProject(currentProject);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentProject, autoSaveEnabled]);

  const createNewProject = useCallback((name: string, layers: Layer[], activeLayerId: string) => {
    const project: Project = {
      id: `project-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      layers,
      activeLayerId,
      canvasWidth: 800,
      canvasHeight: 600,
      version: '1.0.0',
    };

    setCurrentProject(project);
    return project;
  }, []);

  const saveProject = useCallback((project: Project) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allProjects[project.id] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));

    // Update recent projects
    const metadata: ProjectMetadata = {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: updatedProject.updatedAt,
    };

    setRecentProjects(prev => {
      const filtered = prev.filter(p => p.id !== project.id);
      const updated = [metadata, ...filtered].slice(0, 10); // Keep only 10 recent
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });

    setCurrentProject(updatedProject);
    return updatedProject;
  }, []);

  const loadProject = useCallback((projectId: string): Project | null => {
    const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const project = allProjects[projectId];
    
    if (project) {
      setCurrentProject(project);
      return project;
    }
    
    return null;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    // Remove from storage
    const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete allProjects[projectId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));

    // Remove from recent
    setRecentProjects(prev => {
      const updated = prev.filter(p => p.id !== projectId);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });

    // Clear current if it's the deleted project
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const exportProject = useCallback((project: Project) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.minipaint`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, []);

  const importProject = useCallback((file: File): Promise<Project> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target?.result as string);
          
          // Validate project structure
          if (!project.id || !project.layers || !Array.isArray(project.layers)) {
            throw new Error('Invalid project file format');
          }

          // Generate new ID to avoid conflicts
          project.id = `project-${Date.now()}`;
          project.updatedAt = new Date().toISOString();

          setCurrentProject(project);
          resolve(project);
        } catch (error) {
          reject(new Error('Failed to parse project file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    currentProject,
    recentProjects,
    autoSaveEnabled,
    setAutoSaveEnabled,
    createNewProject,
    saveProject,
    loadProject,
    deleteProject,
    exportProject,
    importProject,
  };
};