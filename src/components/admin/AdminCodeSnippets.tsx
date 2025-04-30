import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Database } from '../../lib/database.types';
import ConfirmDialog from '../ui/ConfirmDialog';

type CodeSnippet = Database['public']['Tables']['code_snippets']['Row'];

const AdminCodeSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    snippetId: number | null;
    snippetContent: string;
  }>({
    isOpen: false,
    snippetId: null,
    snippetContent: ''
  });
  const [formData, setFormData] = useState({
    content: '',
    language: 'typescript',
    order_number: 0,
    active: true
  });

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Snippets çekilemedi:', error);
      toast.error('Snippets yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (snippet?: CodeSnippet) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setFormData({
        content: snippet.content,
        language: snippet.language,
        order_number: snippet.order_number,
        active: snippet.active
      });
    } else {
      setEditingSnippet(null);
      setFormData({
        content: '',
        language: 'typescript',
        order_number: snippets.length,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
    setFormData({
      content: '',
      language: 'typescript',
      order_number: 0,
      active: true
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const saveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSnippet) {
        // Update existing snippet
        const { error } = await supabase
          .from('code_snippets')
          .update(formData)
          .eq('id', editingSnippet.id);
        
        if (error) throw error;
        
        // Update local state
        setSnippets(prev => prev.map(snippet => 
          snippet.id === editingSnippet.id ? { ...snippet, ...formData } : snippet
        ));
        
        toast.success('Snippet başarıyla güncellendi');
      } else {
        // Create new snippet
        const { data, error } = await supabase
          .from('code_snippets')
          .insert([formData])
          .select();
        
        if (error) throw error;
        
        // Update local state
        if (data) {
          setSnippets(prev => [...prev, data[0]]);
        }
        
        toast.success('Yeni snippet başarıyla eklendi');
      }
      
      closeModal();
    } catch (error) {
      console.error('Snippet kaydedilemedi:', error);
      toast.error('Snippet kaydedilirken bir hata oluştu');
    }
  };

  const confirmDelete = (snippet: CodeSnippet) => {
    const previewContent = snippet.content.length > 50 
      ? snippet.content.substring(0, 50) + '...' 
      : snippet.content;
    
    setDeleteConfirm({
      isOpen: true,
      snippetId: snippet.id,
      snippetContent: previewContent
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.snippetId) return;
    
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', deleteConfirm.snippetId);
      
      if (error) throw error;
      
      // Update local state
      setSnippets(prev => prev.filter(snippet => snippet.id !== deleteConfirm.snippetId));
      toast.success('Snippet başarıyla silindi');
    } catch (error) {
      console.error('Snippet silinemedi:', error);
      toast.error('Snippet silinirken bir hata oluştu');
    } finally {
      setDeleteConfirm({ isOpen: false, snippetId: null, snippetContent: '' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kod Snippetleri
        </h1>
        <button 
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Snippet
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <div key={snippet.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      snippet.active
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {snippet.active ? 'Aktif' : 'Pasif'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Sıra: {snippet.order_number}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(snippet)}
                      className="btn-outline py-1 px-3 text-sm"
                    >
                      <Save size={16} className="mr-1 inline-block" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => confirmDelete(snippet)}
                      className="py-1 px-3 text-sm border border-error-300 text-error-700 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20 rounded-md transition-colors"
                    >
                      <Trash2 size={16} className="mr-1 inline-block" />
                      Sil
                    </button>
                  </div>
                </div>
                
                <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                  <code>{snippet.content}</code>
                </pre>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Henüz snippet eklenmemiş. Yeni bir snippet eklemek için "Yeni Snippet" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Snippet Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingSnippet ? 'Snippet\'i Düzenle' : 'Yeni Snippet Ekle'}
              </h2>
              
              <form onSubmit={saveSnippet}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="content" className="form-label">
                      Kod İçeriği
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      rows={8}
                      value={formData.content}
                      onChange={handleInputChange}
                      className="form-input font-mono"
                      placeholder="const greeting = 'Merhaba Dünya!';"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="language" className="form-label">
                        Programlama Dili
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="order_number" className="form-label">
                        Sıra Numarası
                      </label>
                      <input
                        id="order_number"
                        name="order_number"
                        type="number"
                        min="0"
                        value={formData.order_number}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="active"
                        name="active"
                        type="checkbox"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="active" className="ml-2 text-gray-700 dark:text-gray-300">
                        Aktif
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline"
                  >
                    <X size={18} className="mr-2" />
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Save size={18} className="mr-2" />
                    {editingSnippet ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Snippet'i Sil"
        message={`Bu kod snippet'ini silmek istediğinizden emin misiniz?\n\n${deleteConfirm.snippetContent}`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, snippetId: null, snippetContent: '' })}
      />
    </div>
  );
};

export default AdminCodeSnippets;