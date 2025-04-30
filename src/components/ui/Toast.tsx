import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

export const Toaster = () => {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      className="!font-sans"
      toastOptions={{
        classNames: {
          toast: '!bg-white !dark:bg-gray-800 !shadow-lg !dark:shadow-gray-900/20 !rounded-xl !border !border-gray-100 !dark:border-gray-700/50 !backdrop-blur-sm !bg-opacity-80 !dark:bg-opacity-80',
          title: '!text-gray-900 !dark:text-white !font-medium',
          description: '!text-gray-600 !dark:text-gray-300',
          actionButton: '!bg-primary-500 !text-white !rounded-lg !px-3 !py-1.5 !text-sm !font-medium !transition-colors !hover:bg-primary-600',
          cancelButton: '!bg-gray-100 !text-gray-700 !dark:bg-gray-700 !dark:text-gray-300 !rounded-lg !px-3 !py-1.5 !text-sm !font-medium !transition-colors !hover:bg-gray-200 !dark:hover:bg-gray-600',
          closeButton: '!text-gray-400 !dark:text-gray-500 !hover:text-gray-500 !dark:hover:text-gray-400'
        },
        duration: 4000,
        position: 'top-right',
      }}
    />
  );
};

export { toast } from 'sonner';