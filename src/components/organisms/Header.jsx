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
      className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200/50 dark:border-neutral-800/50"
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
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <ApperIcon name="Bell" size={20} className="text-neutral-600 dark:text-neutral-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse-glow"></span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: isDark ? 180 : 0,
                scale: isDark ? 0.8 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon 
                name={isDark ? "Moon" : "Sun"} 
                size={20} 
                className="text-neutral-600 dark:text-neutral-400" 
              />
            </motion.div>
          </motion.button>

          {/* User Menu */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
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