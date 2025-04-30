/*
  # Add Code Snippets Table for VS Code Editor Simulation

  1. New Table
    - code_snippets
      - id (serial)
      - content (text)
      - language (text)
      - order (integer)
      - active (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated write access
*/

CREATE TABLE IF NOT EXISTS code_snippets (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'typescript',
  order_number INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "code_snippets_select_policy" ON code_snippets
  FOR SELECT USING (true);

CREATE POLICY "code_snippets_insert_policy" ON code_snippets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "code_snippets_update_policy" ON code_snippets
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "code_snippets_delete_policy" ON code_snippets
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default snippets
INSERT INTO code_snippets (content, language, order_number) VALUES
('const portfolio = {
  developer: "Hekimcan AKTAŞ",
  title: "Kıdemli Yazılım Geliştirici",
  skills: ["TypeScript", "React", "Node.js"],
  experience: "5+ yıl",
  passion: "Modern web teknolojileri"
};', 'typescript', 1),
('interface Project {
  name: string;
  technologies: string[];
  description: string;
  liveDemo?: string;
  github?: string;
}

const projects: Project[] = [
  {
    name: "E-Ticaret Platformu",
    technologies: ["React", "Node.js", "PostgreSQL"],
    description: "Modern ve ölçeklenebilir e-ticaret çözümü"
  }
];', 'typescript', 2),
('function createInnovativeSolutions() {
  const skills = [
    "Frontend Geliştirme",
    "Backend Sistemler",
    "Veritabanı Tasarımı",
    "API Entegrasyonu"
  ];
  
  return skills.map(skill => 
    `✨ ${skill} alanında uzman çözümler`
  );
}', 'typescript', 3);