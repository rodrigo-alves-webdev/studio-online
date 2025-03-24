/*
  # Initial Schema Setup for Web Music Studio

  1. New Tables
    - `profiles`
      - Extended user profile data linked to auth.users
      - Stores name, avatar URL, and preferences
    - `projects`
      - Music projects with metadata and settings
      - Tracks BPM, creation date, and ownership
    - `project_collaborators`
      - Manages project access and permissions
    - `tracks`
      - Individual tracks within projects
      - Stores track type, settings, and content
    
  2. Security
    - Enable RLS on all tables
    - Set up policies for owner and collaborator access
    - Ensure users can only access their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read any profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bpm integer DEFAULT 120,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM project_collaborators
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Create project collaborators table
CREATE TABLE project_collaborators (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can manage collaborators"
  ON project_collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view project access"
  ON project_collaborators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_collaborators pc
          WHERE pc.project_id = project_collaborators.project_id
          AND pc.user_id = auth.uid()
        )
      )
    )
  );

-- Create tracks table
CREATE TABLE tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('midi', 'audio')),
  content jsonb NOT NULL DEFAULT '{}',
  settings jsonb NOT NULL DEFAULT '{
    "volume": 1,
    "pan": 0,
    "muted": false,
    "solo": false
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tracks in their projects"
  ON tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = tracks.project_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_collaborators
          WHERE project_id = tracks.project_id
          AND user_id = auth.uid()
        )
      )
    )
  );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();