import { useState } from 'react';
import { motion } from 'framer-motion';
import AnalyticsChart from '@/components/organisms/AnalyticsChart';
import MetricCard from '@/components/molecules/MetricCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedLink, setSelectedLink] = useState('all');

  const dateRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const overallMetrics = [
    {
      title: 'Total Views',
      value: '24,567',
      change: '+12% from last period',
      changeType: 'positive',
      icon: 'Eye',
      trend: [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 1.0]
    },
    {
      title: 'Form Submissions',
      value: '3,842',
      change: '+18% from last period',
      changeType: 'positive',
      icon: 'Users',
      trend: [0.2, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7]
    },
    {
      title: 'Conversion Rate',
      value: '15.6%',
      change: '+2.3% from last period',
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: [0.4, 0.3, 0.7, 0.5, 0.6, 0.8, 0.9]
    },
    {
      title: 'Avg. Time on Form',
      value: '2m 34s',
      change: '-5s from last period',
      changeType: 'positive',
      icon: 'Clock',
      trend: [0.6, 0.4, 0.8, 0.3, 0.7, 0.5, 0.8]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Analytics
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Track your link performance and optimize conversions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLink}
            onChange={(e) => setSelectedLink(e.target.value)}
            className="input-field min-w-[200px]"
          >
            <option value="all">All Links</option>
            <option value="1">magnet.link/ebook-guide</option>
            <option value="2">magnet.link/webinar-signup</option>
            <option value="3">magnet.link/free-course</option>
          </select>
          <Button
            variant="secondary"
            icon="Download"
          >
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {dateRanges.map((range) => (
          <Button
            key={range.value}
            variant={dateRange === range.value ? 'primary' : 'ghost'}
            size="small"
            onClick={() => setDateRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallMetrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
          />
        ))}
      </div>

      {/* Main Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnalyticsChart linkId={selectedLink} dateRange={dateRange} />
      </motion.div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Top Performing Links
          </h3>
          <div className="space-y-4">
            {[
              { slug: 'ebook-guide', views: 8432, submissions: 1286, rate: '15.2%' },
              { slug: 'webinar-signup', views: 6891, submissions: 1098, rate: '15.9%' },
              { slug: 'free-course', views: 5234, submissions: 798, rate: '15.3%' },
              { slug: 'checklist-pdf', views: 4102, submissions: 660, rate: '16.1%' }
            ].map((link, index) => (
              <div key={link.slug} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      /{link.slug}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {link.views.toLocaleString()} views • {link.submissions.toLocaleString()} submissions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {link.rate}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    conversion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { type: 'submission', link: 'ebook-guide', time: '2 minutes ago', email: 'john@example.com' },
              { type: 'view', link: 'webinar-signup', time: '5 minutes ago' },
              { type: 'submission', link: 'free-course', time: '12 minutes ago', email: 'sarah@example.com' },
              { type: 'view', link: 'checklist-pdf', time: '18 minutes ago' },
              { type: 'submission', link: 'ebook-guide', time: '25 minutes ago', email: 'mike@example.com' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'submission' 
                    ? 'bg-green-100 dark:bg-green-900/40' 
                    : 'bg-blue-100 dark:bg-blue-900/40'
                }`}>
                  <ApperIcon 
                    name={activity.type === 'submission' ? 'UserPlus' : 'Eye'} 
                    size={16} 
                    className={activity.type === 'submission' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {activity.type === 'submission' ? 'New submission' : 'Page view'} on /{activity.link}
                    {activity.email && (
                      <span className="text-primary-600 dark:text-primary-400 ml-1">
                        from {activity.email}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-8"
      >
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8 text-center">
          Conversion Funnel
        </h3>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {[
              { stage: 'Link Clicks', count: 24567, percentage: 100, icon: 'MousePointer' },
              { stage: 'Form Views', count: 19234, percentage: 78, icon: 'Eye' },
              { stage: 'Form Starts', count: 12456, percentage: 51, icon: 'Edit3' },
              { stage: 'Submissions', count: 3842, percentage: 16, icon: 'CheckCircle' }
            ].map((stage, index) => (
              <div key={stage.stage} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    index === 0 ? 'bg-primary-500 text-white' :
                    index === 1 ? 'bg-primary-400 text-white' :
                    index === 2 ? 'bg-primary-300 text-white' :
                    'bg-primary-200 text-primary-800 dark:text-primary-900'
                  }`}>
                    <ApperIcon name={stage.icon} size={24} />
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-neutral-300 dark:bg-neutral-600 -translate-y-1/2"></div>
                  )}
                </div>
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {stage.stage}
                </h4>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {stage.count.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {stage.percentage}% of total
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;