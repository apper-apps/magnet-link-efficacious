import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...props
}, ref) => {
return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors duration-300">
            <ApperIcon name={icon} size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field ${icon ? 'pl-11' : ''} ${error ? 'border-danger-300 focus:ring-danger-500/30 focus:border-danger-500' : 'focus:ring-primary-500/30 focus:border-primary-500'} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400 mt-2 flex items-center gap-2">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;