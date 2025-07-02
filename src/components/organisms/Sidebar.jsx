import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = ({ collapsed, onToggle, className = '' }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { to: '/', icon: 'BarChart3', label: 'Dashboard' },
    { to: '/links', icon: 'Link', label: 'Links' },
    { to: '/forms', icon: 'FileText', label: 'Forms' },
    { to: '/leads', icon: 'Users', label: 'Leads' },
    { to: '/analytics', icon: 'TrendingUp', label: 'Analytics' },
    { to: '/integrations', icon: 'Zap', label: 'Integrations' },
    { to: '/team', icon: 'UserPlus', label: 'Team' },
    { to: '/settings', icon: 'Settings', label: 'Settings' },
  ];

  const sidebarVariants = {
    expanded: {
      width: isMobile ? '100%' : '280px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: isMobile ? '0px' : '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      transition: { delay: 0.1, duration: 0.2 }
    },
    collapsed: {
      opacity: collapsed ? 0 : 1,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
<motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        className={`fixed md:static top-0 left-0 h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-r border-neutral-200/40 dark:border-neutral-800/40 z-50 overflow-hidden shadow-xl ${className}`}
        style={{ 
          transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <motion.div 
            variants={contentVariants}
            className="flex items-center gap-3 p-6 border-b border-neutral-200/30 dark:border-neutral-800/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
              <ApperIcon name="Link" size={20} className="text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="font-display font-bold text-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent">
                    Magnet.Link
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
              />
            ))}
          </nav>

          {/* Toggle Button */}
          <div className="p-4 border-t border-neutral-200/30 dark:border-neutral-800/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-neutral-100/80 to-neutral-200/60 dark:from-neutral-800/80 dark:to-neutral-700/60 hover:from-primary-100/80 hover:to-primary-200/60 dark:hover:from-primary-900/40 dark:hover:to-primary-800/30 transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              <ApperIcon 
                name={collapsed ? "ChevronRight" : "ChevronLeft"} 
                size={20} 
                className="text-neutral-600 dark:text-neutral-400" 
              />
            </motion.button>
</div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;