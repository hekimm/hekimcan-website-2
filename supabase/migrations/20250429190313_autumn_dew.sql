/*
  # Create code_snippets table

  1. New Tables
    - `code_snippets`
      - `id` (integer, primary key)
      - `content` (text)
      - `language` (text, default 'typescript')
      - `order_number` (integer, default 0)
      - `active` (boolean, default true)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `code_snippets` table
    - Add policies for:
      - Public read access to all code snippets
      - Authenticated users can create, update, and delete snippets
*/

-- Create the code_snippets table
CREATE TABLE IF NOT EXISTS public.code_snippets (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content text NOT NULL,
    language text NOT NULL DEFAULT 'typescript',
    order_number integer NOT NULL DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
    ON public.code_snippets
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create snippets"
    ON public.code_snippets
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update snippets"
    ON public.code_snippets
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete snippets"
    ON public.code_snippets
    FOR DELETE
    TO authenticated
    USING (true);

-- Insert some initial sample data
INSERT INTO public.code_snippets (content, language, order_number) VALUES
(E'function greet(name: string) {\n  return `Hello, ${name}!`;\n}', 'typescript', 1),
(E'const sum = (a: number, b: number): number => {\n  return a + b;\n}', 'typescript', 2),
(E'interface User {\n  id: number;\n  name: string;\n  email: string;\n}', 'typescript', 3);