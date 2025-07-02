import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  trend = [],
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-4 w-20 mb-3"></div>
        <div className="skeleton h-8 w-24 mb-2"></div>
        <div className="skeleton h-3 w-16"></div>
      </div>
    );
  }

  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                      changeType === 'negative' ? 'text-red-600' : 'text-neutral-600';
  
  const changeIcon = changeType === 'positive' ? 'TrendingUp' : 
                     changeType === 'negative' ? 'TrendingDown' : 'Minus';

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="card p-6 group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/50 dark:from-primary-900/20 dark:via-transparent dark:to-secondary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">{title}</h3>
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 dark:group-hover:from-primary-800/60 dark:group-hover:to-primary-700/60 transition-all duration-300 shadow-lg shadow-primary-500/10 group-hover:shadow-primary-500/20">
              <ApperIcon name={icon} size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <motion.p 
            className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              <ApperIcon name={changeIcon} size={14} />
              {change}
            </div>
          )}
        </div>
        
        {trend.length > 0 && (
          <div className="w-16 h-8">
            <svg className="w-full h-full">
              <polyline
                points={trend.map((point, index) => 
                  `${index * (64 / (trend.length - 1))},${32 - (point * 24)}`
                ).join(' ')}
                fill="none"
                stroke="currentColor"
                className={changeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;