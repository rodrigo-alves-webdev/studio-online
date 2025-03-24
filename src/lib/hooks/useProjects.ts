import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';
import type { Database } from '../supabase-types';

export type Project = Database['public']['Tables']['projects']['Row'];

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(name: string = 'Novo Projeto') {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { name, owner_id: user!.id }
        ])
        .select()
        .single();

      if (error) throw error;
      setProjects([data, ...projects]);
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
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
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
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
    refresh: fetchProjects
  };
}