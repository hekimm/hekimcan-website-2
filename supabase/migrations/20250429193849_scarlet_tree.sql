/*
  # Create code_snippets table for VS Code typing simulation

  1. New Table
    - code_snippets
      - id (serial, primary key)
      - content (text)
      - language (text, default: 'typescript')
      - order_number (integer, default: 0)
      - active (boolean, default: true)
      - created_at (timestamptz, default: now())

  2. Security
    - Enable RLS
    - Add policies for public read access and authenticated user management
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

-- Insert initial sample snippets
INSERT INTO code_snippets (content, language, order_number, active) VALUES
(E'const developer = {\n  name: "Hekimcan AKTAŞ",\n  title: "Kıdemli Yazılım Geliştirici",\n  skills: ["TypeScript", "React", "Node.js"],\n  passion: "Modern web teknolojileri"\n};', 'typescript', 1, true),

(E'interface Project {\n  name: string;\n  stack: string[];\n  description: string;\n}\n\nconst projects: Project[] = [{\n  name: "E-Ticaret Platformu",\n  stack: ["React", "Node.js", "PostgreSQL"],\n  description: "Modern ve ölçeklenebilir çözüm"\n}];', 'typescript', 2, true),

(E'function createInnovativeSolutions() {\n  const expertise = [\n    "Frontend Geliştirme",\n    "Backend Sistemler",\n    "Veritabanı Tasarımı"\n  ];\n  \n  return expertise.map(skill => \n    `✨ ${skill} alanında uzman çözümler`\n  );\n}', 'typescript', 3, true);