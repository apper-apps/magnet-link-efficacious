import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white focus:ring-primary-500/30 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400 border border-neutral-200/60 dark:border-neutral-700/60 hover:bg-primary-50/80 dark:hover:bg-primary-900/20 hover:border-primary-200/80 dark:hover:border-primary-700/80 focus:ring-primary-500/30 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border border-neutral-300/60 dark:border-neutral-600/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/80 hover:border-neutral-400/80 dark:hover:border-neutral-500/80 focus:ring-neutral-500/30 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/80 dark:hover:bg-primary-900/20 focus:ring-primary-500/30 hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white focus:ring-danger-500/30 shadow-lg hover:shadow-xl hover:shadow-danger-500/25 hover:scale-[1.02] active:scale-[0.98]'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm gap-1.5',
    medium: 'px-4 py-2.5 text-sm gap-2',
    large: 'px-6 py-3 text-base gap-2.5'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const iconSize = size === 'small' ? 16 : size === 'large' ? 20 : 18;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Loader2" size={iconSize} />
          </motion.div>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <ApperIcon name={icon} size={iconSize} />}
          {children}
          {icon && iconPosition === 'right' && <ApperIcon name={icon} size={iconSize} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;