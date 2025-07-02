import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="p-8 space-y-8 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32 rounded-xl"></div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="skeleton h-4 w-20 mb-3"></div>
              <div className="skeleton h-8 w-24 mb-2"></div>
              <div className="skeleton h-3 w-16"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="card p-6">
          <div className="skeleton h-6 w-32 mb-6"></div>
          <div className="skeleton h-64 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-fade-in">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="skeleton h-8 w-8 rounded-full"></div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-48"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="skeleton h-6 w-16 rounded-full"></div>
                <div className="skeleton h-8 w-8 rounded-lg"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;