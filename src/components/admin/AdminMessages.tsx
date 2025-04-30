import { useState, useEffect } from 'react';
import { Check, Eye, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Database } from '../../lib/database.types';

type Mesaj = Database['public']['Tables']['iletisim']['Row'];

const AdminMessages = () => {
  const [messages, setMessages] = useState<Mesaj[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<Mesaj | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('iletisim')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Mesajlar çekilemedi:', error);
      toast.error('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (message: Mesaj) => {
    setActiveMessage(message);
    setIsModalOpen(true);
    
    // Eğer mesaj okunmamışsa, okundu olarak işaretle
    if (!message.okundu) {
      markAsRead(message.id, true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveMessage(null);
  };

  const markAsRead = async (id: number, read: boolean) => {
    try {
      const { error } = await supabase
        .from('iletisim')
        .update({ okundu: read })
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, okundu: read } : message
        )
      );
      
      toast.success(read ? 'Mesaj okundu olarak işaretlendi' : 'Mesaj okunmadı olarak işaretlendi');
    } catch (error) {
      console.error('Mesaj durumu güncellenemedi:', error);
      toast.error('Mesaj durumu güncellenirken bir hata oluştu');
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('iletisim')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (activeMessage?.id === id) {
        closeModal();
      }
      
      setMessages(prev => prev.filter(message => message.id !== id));
      toast.success('Mesaj başarıyla silindi');
    } catch (error) {
      console.error('Mesaj silinemedi:', error);
      toast.error('Mesaj silinirken bir hata oluştu');
    }
  };

  // Tarihi formatlama
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mesajlar
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Toplam: {messages.length} | Okunmamış: {messages.filter(m => !m.okundu).length}
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`card p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !message.okundu ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500' : ''
                }`}
                onClick={() => openModal(message)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      message.okundu ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'
                    }`}></div>
                    <h3 className={`font-medium ${
                      message.okundu ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {message.isim}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 pl-5">
                  {message.mesaj}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Henüz mesaj bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Mesaj Detay Modal */}
      {isModalOpen && activeMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {activeMessage.isim}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeMessage.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(activeMessage.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(activeMessage.id, !activeMessage.okundu);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title={activeMessage.okundu ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                  >
                    {activeMessage.okundu ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(activeMessage.id);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Mesajı sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {activeMessage.mesaj}
                </p>
              </div>
              
              <div className="flex justify-between">
                <a 
                  href={`mailto:${activeMessage.email}`}
                  className="btn-primary inline-flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Check size={18} className="mr-2" />
                  Yanıtla
                </a>
                <button
                  onClick={closeModal}
                  className="btn-outline"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;