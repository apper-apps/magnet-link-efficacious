import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Link",
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction
}) => {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        variants={iconVariants}
        className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-2xl flex items-center justify-center mb-8"
      >
        <ApperIcon name={icon} size={40} className="text-primary-600 dark:text-primary-400" />
      </motion.div>
      
      <motion.h3
        variants={childVariants}
        className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        variants={childVariants}
        className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md leading-relaxed"
      >
        {description}
      </motion.p>
      
      {onAction && (
        <motion.button
          variants={childVariants}
          onClick={onAction}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;