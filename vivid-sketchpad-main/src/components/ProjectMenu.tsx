import { useState, useRef } from 'react';
import { Save, FolderOpen, Download, Upload, FileText, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Project, ProjectMetadata } from '@/types/projectTypes';
import { toast } from 'sonner';

interface ProjectMenuProps {
  currentProject: Project | null;
  recentProjects: ProjectMetadata[];
  onSave: (project: Project) => void;
  onLoad: (projectId: string) => void;
  onNew: (name: string) => void;
  onExport: (project: Project) => void;
  onImport: (file: File) => Promise<void>;
  onDelete: (projectId: string) => void;
}

export const ProjectMenu = ({
  currentProject,
  recentProjects,
  onSave,
  onLoad,
  onNew,
  onExport,
  onImport,
  onDelete,
}: ProjectMenuProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (currentProject) {
      onSave(currentProject);
      toast.success('Project saved!');
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleNewProject = () => {
    if (projectName.trim()) {
      onNew(projectName.trim());
      setProjectName('');
      setShowSaveDialog(false);
      toast.success(`New project "${projectName}" created!`);
    }
  };

  const handleExport = () => {
    if (currentProject) {
      onExport(currentProject);
      toast.success('Project exported!');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
        toast.success('Project imported successfully!');
      } catch (error) {
        toast.error('Failed to import project');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed top-20 left-4 z-40">
      <div className="flex gap-1 bg-white rounded-lg shadow-lg border p-1">
        {/* Save Button */}
        <Button
          size="sm"
          onClick={handleSave}
          className="h-8 px-2"
          title="Save Project (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </Button>

        {/* Load Button */}
        <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 px-2">
              <FolderOpen className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Load Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent projects</p>
              ) : (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onLoad(project.id);
                      setShowLoadDialog(false);
                      toast.success(`Loaded "${project.name}"`);
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updatedAt)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                        toast.success('Project deleted');
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          disabled={!currentProject}
          className="h-8 px-2"
          title="Export Project"
        >
          <Download className="w-4 h-4" />
        </Button>

        {/* Import Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleImportClick}
          className="h-8 px-2"
          title="Import Project"
        >
          <Upload className="w-4 h-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".minipaint,.json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Current Project Info */}
      {currentProject && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{currentProject.name}</span>
            <span className="text-blue-500">• Auto-saving</span>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewProject()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleNewProject} disabled={!projectName.trim()}>
                Save Project
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};