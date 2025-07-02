import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuToggle, showMenuButton = true }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border-b border-neutral-200/30 dark:border-neutral-800/30 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="small"
              icon="Menu"
              onClick={onMenuToggle}
              className="md:hidden"
            />
          )}
          
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Welcome back
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Here's what's happening with your links today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-primary-50/80 dark:hover:bg-primary-900/20 hover:border-primary-200/60 dark:hover:border-primary-700/60 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ApperIcon name="Bell" size={18} className="text-neutral-600 dark:text-neutral-400" />
            <div className="notification-dot absolute -top-1 -right-1"></div>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-primary-50/80 dark:hover:bg-primary-900/20 hover:border-primary-200/60 dark:hover:border-primary-700/60 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: isDark ? 180 : 0,
                scale: isDark ? 0.9 : 1
              }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <ApperIcon 
                name={isDark ? "Moon" : "Sun"} 
                size={18} 
                className="text-neutral-600 dark:text-neutral-400" 
              />
            </motion.div>
          </motion.button>

          {/* User Menu */}
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-primary-50/80 dark:hover:bg-primary-900/20 hover:border-primary-200/60 dark:hover:border-primary-700/60 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                John Doe
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Pro Plan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;