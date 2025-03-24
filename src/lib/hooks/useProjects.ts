import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectUpdate {
  name?: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchProjects() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      // Projetos novos começam com um nome padrão
      const newProject = {
        name: 'Novo Projeto',
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Atualiza a lista de projetos localmente
      setProjects([data, ...projects]);
      
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  async function updateProject(id: string, updates: ProjectUpdate) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      // Atualiza o projeto na lista local
      setProjects(projects.map(project => 
        project.id === id ? { ...project, ...updates, updated_at: new Date().toISOString() } : project
      ));
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      // Remove o projeto da lista local
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects
  };
}