import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type CodeSnippet = Database['public']['Tables']['code_snippets']['Row'];

const CodeEditor = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .eq('active', true)
        .order('order_number', { ascending: true });

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Error fetching code snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (snippets.length === 0 || loading) return;

    const currentSnippet = snippets[currentSnippetIndex].content;
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (typedText.length < currentSnippet.length) {
        // Variable typing speed
        const speed = Math.random() * 30 + 30;
        // Longer pause after punctuation
        const lastChar = currentSnippet[typedText.length - 1];
        const delay = [';', '.', '\n'].includes(lastChar) ? 400 : speed;

        timeout = setTimeout(() => {
          setTypedText(currentSnippet.slice(0, typedText.length + 1));
          // Update cursor position
          const lines = typedText.split('\n');
          const currentLine = lines.length - 1;
          const currentColumn = lines[currentLine]?.length || 0;
          setCursorPosition({ x: currentColumn * 9.6, y: currentLine * 24 });
        }, delay);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentSnippet.slice(0, typedText.length - 1));
          // Update cursor position while deleting
          const lines = typedText.split('\n');
          const currentLine = lines.length - 1;
          const currentColumn = lines[currentLine]?.length || 0;
          setCursorPosition({ x: currentColumn * 9.6, y: currentLine * 24 });
        }, Math.random() * 20 + 20);
      } else {
        setIsDeleting(false);
        setCurrentSnippetIndex((prev) => (prev + 1) % snippets.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentSnippetIndex, snippets, loading]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#1E1E1E] rounded-lg shadow-2xl overflow-hidden animate-pulse">
          <div className="h-8 bg-[#252526] flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#333333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333333]"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-4 bg-[#2D2D2D] rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-[#2D2D2D] rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-[#2D2D2D] rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto group">
      <motion.div 
        className="relative bg-[#1E1E1E] rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow: '0 0 60px -15px rgba(0, 0, 0, 0.3)',
          transform: 'perspective(1000px)',
        }}
        whileHover={{
          scale: 1.02,
          rotateX: 2,
          rotateY: 2,
          transition: { duration: 0.3 }
        }}
      >
        {/* VS Code Window Controls */}
        <div className="h-8 bg-[#252526] flex items-center justify-between px-4 border-b border-[#1E1E1E]">
          <div className="flex space-x-2">
            <motion.div 
              className="w-3 h-3 rounded-full bg-[#FF5F56] group-hover:bg-[#FF5F56]/80 transition-colors"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-[#FFBD2E] group-hover:bg-[#FFBD2E]/80 transition-colors"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-[#27C93F] group-hover:bg-[#27C93F]/80 transition-colors"
              whileHover={{ scale: 1.2 }}
            />
          </div>
          <div className="text-[#858585] text-xs">
            main.ts - VS Code
          </div>
        </div>

        {/* Code Content */}
        <div className="relative p-6 font-['JetBrains_Mono'] text-sm leading-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSnippetIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[#D4D4D4]"
            >
              {typedText.split('\n').map((line, i) => (
                <div key={i} className="min-h-[24px] flex">
                  <span className="w-8 text-[#858585] select-none mr-4 opacity-50">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    {line.split('').map((char, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                        className={
                          char === '"' || char === "'" ? 'text-[#CE9178]' :
                          /[{}[\]()]/.test(char) ? 'text-[#D4D4D4]' :
                          /[=+\-*/<>]/.test(char) ? 'text-[#D4D4D4]' :
                          /\b(const|let|var|function|return|interface)\b/.test(line.slice(Math.max(0, j - 10), j + 10)) ? 'text-[#569CD6]' :
                          'text-[#9CDCFE]'
                        }
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </div>
              ))}
              <motion.div 
                className="absolute w-[2px] h-[18px] bg-white/70"
                style={{
                  left: `${cursorPosition.x + 48}px`,
                  top: `${cursorPosition.y + 24}px`
                }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Code Lens Hint */}
          <motion.div
            className="absolute top-2 right-4 text-xs text-[#4EC9B0]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            TypeScript
          </motion.div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-6 bg-[#007ACC] flex items-center px-4 text-xs text-white/80">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Connected to Database</span>
          </span>
        </div>

        {/* Reflection Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent"></div>
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 rounded-lg"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeEditor;