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
      whileHover={{ y: -2, scale: 1.02 }}
      className="card p-6 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
        {icon && (
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/60 transition-colors">
            <ApperIcon name={icon} size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
        )}
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