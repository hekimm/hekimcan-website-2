/*
  # Code Snippets Table for VS Code Editor Simulation

  1. New Table
    - code_snippets
      - content: The code snippet content
      - language: Programming language (default: typescript)
      - order_number: Display order
      - active: Whether to show the snippet
      - created_at: Timestamp

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated users can manage snippets
*/

-- Create the code_snippets table
CREATE TABLE IF NOT EXISTS code_snippets (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'typescript',
  order_number INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'code_snippets' AND policyname = 'code_snippets_select_policy'
  ) THEN
    CREATE POLICY "code_snippets_select_policy" ON code_snippets
      FOR SELECT USING (true);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'code_snippets' AND policyname = 'code_snippets_insert_policy'
  ) THEN
    CREATE POLICY "code_snippets_insert_policy" ON code_snippets
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'code_snippets' AND policyname = 'code_snippets_update_policy'
  ) THEN
    CREATE POLICY "code_snippets_update_policy" ON code_snippets
      FOR UPDATE USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'code_snippets' AND policyname = 'code_snippets_delete_policy'
  ) THEN
    CREATE POLICY "code_snippets_delete_policy" ON code_snippets
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Insert initial sample snippets
INSERT INTO code_snippets (content, language, order_number, active) VALUES
(E'const developer = {\n  name: "Hekimcan AKTAŞ",\n  title: "Kıdemli Yazılım Geliştirici",\n  skills: ["TypeScript", "React", "Node.js"],\n  passion: "Modern web teknolojileri"\n};', 'typescript', 1, true),

(E'interface Project {\n  name: string;\n  stack: string[];\n  description: string;\n}\n\nconst projects: Project[] = [{\n  name: "E-Ticaret Platformu",\n  stack: ["React", "Node.js", "PostgreSQL"],\n  description: "Modern ve ölçeklenebilir çözüm"\n}];', 'typescript', 2, true),

(E'function createInnovativeSolutions() {\n  const expertise = [\n    "Frontend Geliştirme",\n    "Backend Sistemler",\n    "Veritabanı Tasarımı"\n  ];\n  \n  return expertise.map(skill => \n    `✨ ${skill} alanında uzman çözümler`\n  );\n}', 'typescript', 3, true);