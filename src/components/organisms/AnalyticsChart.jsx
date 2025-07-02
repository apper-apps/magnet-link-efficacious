import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { analyticsService } from '@/services/api/analyticsService';

const AnalyticsChart = ({ linkId, dateRange = '7d' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('area');
  const [selectedMetric, setSelectedMetric] = useState('views');

  useEffect(() => {
    loadAnalytics();
  }, [linkId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const analytics = await analyticsService.getByLinkId(linkId, { range: dateRange });
      setData(analytics);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;
  if (!data) return null;

  const chartOptions = {
    chart: {
      type: chartType,
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#6750A4', '#7F67BE', '#9575FF'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: data.dates || [],
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '14px'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const chartSeries = [
    {
      name: 'Views',
      data: data.viewsData || []
    },
    {
      name: 'Submissions',
      data: data.submissionsData || []
    }
  ];

  const metrics = [
    {
      key: 'views',
      label: 'Total Views',
      value: data.totalViews || 0,
      change: '+12%',
      changeType: 'positive',
      icon: 'Eye'
    },
    {
      key: 'submissions',
      label: 'Submissions',
      value: data.totalSubmissions || 0,
      change: '+8%',
      changeType: 'positive',
      icon: 'Users'
    },
    {
      key: 'conversion',
      label: 'Conversion Rate',
      value: `${data.conversionRate || 0}%`,
      change: '-2%',
      changeType: 'negative',
      icon: 'TrendingUp'
    },
    {
      key: 'bounce',
      label: 'Bounce Rate',
      value: `${data.bounceRate || 0}%`,
      change: '+5%',
      changeType: 'negative',
      icon: 'ArrowLeft'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`card p-6 cursor-pointer transition-all ${
              selectedMetric === metric.key 
                ? 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
                : ''
            }`}
            onClick={() => setSelectedMetric(metric.key)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <ApperIcon name={metric.icon} size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <ApperIcon 
                  name={metric.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                />
                {metric.change}
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Performance Overview
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'area' ? 'primary' : 'ghost'}
              size="small"
              icon="AreaChart"
              onClick={() => setChartType('area')}
            />
            <Button
              variant={chartType === 'line' ? 'primary' : 'ghost'}
              size="small"
              icon="TrendingUp"
              onClick={() => setChartType('line')}
            />
            <Button
              variant={chartType === 'bar' ? 'primary' : 'ghost'}
              size="small"
              icon="BarChart3"
              onClick={() => setChartType('bar')}
            />
          </div>
        </div>
        
        <div className="h-80">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type={chartType}
            height="100%"
          />
        </div>
      </motion.div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Traffic Sources
        </h3>
        <div className="space-y-4">
          {(data.sources || []).map((source, index) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                  <ApperIcon name={source.icon || 'Globe'} size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {source.name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {source.percentage}% of traffic
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {source.visitors}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  visitors
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsChart;