import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '@/components/molecules/MetricCard';
import AnalyticsChart from '@/components/organisms/AnalyticsChart';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { linkService } from '@/services/api/linkService';
import { leadService } from '@/services/api/leadService';
import { analyticsService } from '@/services/api/analyticsService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [links, leads, analytics] = await Promise.all([
        linkService.getAll(),
        leadService.getAll(),
        analyticsService.getOverview()
      ]);

      // Calculate stats
      const totalViews = analytics.totalViews || 0;
      const totalSubmissions = leads.length;
      const conversionRate = totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : 0;
      const activeLinks = links.filter(link => link.isActive).length;

      setStats({
        totalLinks: links.length,
        activeLinks,
        totalViews,
        totalSubmissions,
        conversionRate
      });

      setRecentLinks(links.slice(-5).reverse());
      setRecentLeads(leads.slice(-5).reverse());
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const metrics = [
    {
      title: 'Total Links',
      value: stats.totalLinks,
      change: '+12% from last month',
      changeType: 'positive',
      icon: 'Link',
      trend: [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 1.0]
    },
    {
      title: 'Active Links',
      value: stats.activeLinks,
      change: '+8% from last month',
      changeType: 'positive',
      icon: 'Zap',
      trend: [0.2, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7]
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: '+23% from last month',
      changeType: 'positive',
      icon: 'Eye',
      trend: [0.1, 0.4, 0.6, 0.3, 0.8, 0.7, 1.0]
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '+2.1% from last month',
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: [0.4, 0.3, 0.7, 0.5, 0.6, 0.8, 0.9]
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
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Monitor your link performance and lead generation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="Download"
            size="small"
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => window.location.href = '/links/create'}
          >
            Create Link
          </Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Performance Overview
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="small">7D</Button>
                <Button variant="primary" size="small">30D</Button>
                <Button variant="ghost" size="small">90D</Button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="text-primary-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Interactive chart component
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Top Performing Links */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Top Links
            </h3>
            <div className="space-y-3">
              {recentLinks.slice(0, 3).map((link, index) => (
                <div key={link.Id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        /{link.slug}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {link.submissions || 0} submissions
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="small" icon="ExternalLink" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentLeads.slice(0, 3).map((lead, index) => (
                <div key={lead.Id} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">
                      New lead captured
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {new Date(lead.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Ready to create your next magnet link?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Transform any URL into a lead generation machine with our powerful link gating platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="large"
              icon="Plus"
              onClick={() => window.location.href = '/links/create'}
            >
              Create New Link
            </Button>
            <Button
              variant="secondary"
              size="large"
              icon="FileText"
              onClick={() => window.location.href = '/forms'}
            >
              Build Form
            </Button>
            <Button
              variant="ghost"
              size="large"
              icon="BarChart3"
              onClick={() => window.location.href = '/analytics'}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;