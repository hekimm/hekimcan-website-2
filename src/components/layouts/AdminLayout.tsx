import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  User, 
  Code2, 
  MessageSquare,
  Sun,
  Moon,
  UserCircle,
  Terminal,
  LayoutTemplate,
  GraduationCap,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useSupabase } from '../../context/SupabaseContext';
import { toast } from 'sonner';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useSupabase();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/giris');
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/admin/profil', label: 'Profil', icon: <UserCircle size={20} /> },
    { to: '/admin/projeler', label: 'Projeler', icon: <Code2 size={20} /> },
    { to: '/admin/yetenekler', label: 'Yetenekler', icon: <User size={20} /> },
    { to: '/admin/egitim', label: 'Eğitim', icon: <GraduationCap size={20} /> },
    { to: '/admin/code-editor', label: 'Kod Editörü', icon: <Terminal size={20} /> },
    { to: '/admin/footer', label: 'Footer', icon: <LayoutTemplate size={20} /> },
    { to: '/admin/iletisim', label: 'İletişim', icon: <Phone size={20} /> },
    { to: '/admin/mesajlar', label: 'Mesajlar', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Mobil Menü Butonu */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
        <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Admin Panel
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobil Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-64 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-6">
                  Admin Panel
                </div>
                <nav className="space-y-2 mb-6">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/admin'}
                      className={({ isActive }) => 
                        `flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut size={20} className="mr-3" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 flex-shrink-0">
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-6">
            Admin Panel
          </div>
          <nav className="space-y-2 mb-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-6 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Tema</span>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;