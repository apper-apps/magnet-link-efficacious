import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NavItem = ({ to, icon, label, badge, onClick, collapsed = false }) => {
  const content = (
    <motion.div
      whileHover={{ x: 2 }}
      className="nav-item group"
    >
      <div className="flex items-center gap-3 flex-1">
        <ApperIcon 
          name={icon} 
          size={20} 
          className="flex-shrink-0 group-hover:scale-110 transition-transform" 
        />
        <span className={`font-medium transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          {label}
        </span>
      </div>
      {badge && !collapsed && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
        >
          {badge}
        </motion.span>
      )}
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>
      {content}
    </NavLink>
  );
};

export default NavItem;