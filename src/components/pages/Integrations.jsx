import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { integrationService } from '@/services/api/integrationService';
import { toast } from 'react-toastify';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await integrationService.getAll();
      setIntegrations(data.available);
      setConnectedIntegrations(data.connected || []);
    } catch (err) {
      setError('Failed to load integrations. Please try again.');
      console.error('Error loading integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (integrationId) => {
    try {
      await integrationService.connect(integrationId);
      toast.success('Integration connected successfully');
      loadIntegrations();
    } catch (err) {
      toast.error('Failed to connect integration');
      console.error('Error connecting integration:', err);
    }
  };

  const handleDisconnect = async (integrationId) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) return;
    
    try {
      await integrationService.disconnect(integrationId);
      toast.success('Integration disconnected successfully');
      loadIntegrations();
    } catch (err) {
      toast.error('Failed to disconnect integration');
      console.error('Error disconnecting integration:', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadIntegrations} />;

  const categories = [
    {
      name: 'Email Marketing',
      icon: 'Mail',
      integrations: integrations.filter(i => i.category === 'email')
    },
    {
      name: 'CRM Systems',
      icon: 'Users',
      integrations: integrations.filter(i => i.category === 'crm')
    },
    {
      name: 'Communication',
      icon: 'MessageSquare',
      integrations: integrations.filter(i => i.category === 'communication')
    },
    {
      name: 'Analytics',
      icon: 'BarChart3',
      integrations: integrations.filter(i => i.category === 'analytics')
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
            Integrations
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Connect your favorite tools to streamline your workflow
          </p>
        </div>
        <Button
          variant="secondary"
          icon="Plus"
        >
          Request Integration
        </Button>
      </motion.div>

      {/* Connected Integrations */}
      {connectedIntegrations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Connected Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedIntegrations.map((integration, index) => (
              <motion.div
                key={integration.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm">
                    <img
                      src={integration.logo}
                      alt={integration.name}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <ApperIcon 
                      name={integration.icon} 
                      size={20} 
                      className="text-neutral-600 dark:text-neutral-400 hidden"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {integration.name}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Connected
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  icon="Settings"
                  onClick={() => handleDisconnect(integration.Id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Integrations by Category */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
              <ApperIcon name={category.icon} size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {category.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.integrations.map((integration, index) => {
              const isConnected = connectedIntegrations.some(c => c.Id === integration.Id);
              
              return (
                <motion.div
                  key={integration.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="card p-6 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <img
                        src={integration.logo}
                        alt={integration.name}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <ApperIcon 
                        name={integration.icon} 
                        size={24} 
                        className="text-neutral-600 dark:text-neutral-400 hidden"
                      />
                    </div>
                    {integration.isPopular && (
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {integration.name}
                  </h3>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {integration.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      {integration.features?.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant={isConnected ? "secondary" : "primary"}
                      size="small"
                      icon={isConnected ? "Check" : "Plus"}
                      onClick={() => isConnected ? handleDisconnect(integration.Id) : handleConnect(integration.Id)}
                      disabled={isConnected}
                    >
                      {isConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Custom Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-8"
      >
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Code" size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Need a custom integration?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Use our powerful API and webhooks to connect with any platform. Get started with our comprehensive documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              icon="Book"
              onClick={() => window.open('/docs/api', '_blank')}
            >
              API Documentation
            </Button>
            <Button
              variant="secondary"
              icon="Webhook"
              onClick={() => window.location.href = '/settings/webhooks'}
            >
              Setup Webhooks
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Integrations;