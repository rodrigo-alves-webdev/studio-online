import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useProjects } from '../lib/hooks/useProjects';
import { useAuth } from '../lib/auth';

export function Dashboard() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-200">
          Faça login para ver seus projetos
        </h2>
      </div>
    );
  }

  async function handleCreateProject() {
    try {
      const project = await createProject();
      navigate(`/studio/${project.id}`);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  }

  async function handleUpdateName(id: string) {
    try {
      await updateProject(id, { name: editingName });
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Erro ao renomear projeto:', error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Meus Projetos</h1>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <h3 className="text-xl text-gray-300 mb-4">Nenhum projeto criado ainda</h3>
          <button
            onClick={handleCreateProject}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Criar meu primeiro projeto
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                {editingId === project.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={() => handleUpdateName(project.id)}
                    onKeyPress={e => e.key === 'Enter' && handleUpdateName(project.id)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-white truncate">
                    {project.name}
                  </h3>
                )}
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 hidden group-hover:block">
                    <button
                      onClick={() => {
                        setEditingId(project.id);
                        setEditingName(project.name);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      <Pencil className="w-4 h-4" />
                      Renomear
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-4">
                Última atualização: {new Date(project.updated_at).toLocaleDateString()}
              </div>

              <button
                onClick={() => navigate(`/studio/${project.id}`)}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Abrir Projeto
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}