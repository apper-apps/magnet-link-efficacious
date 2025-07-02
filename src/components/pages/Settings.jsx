import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { settingsService } from '@/services/api/settingsService';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      company: '',
      website: '',
      timezone: 'UTC'
    },
    branding: {
      primaryColor: '#6750A4',
      logo: '',
      customDomain: '',
      favicon: ''
    },
    notifications: {
      emailAlerts: true,
      weeklyReports: true,
      newLeads: true,
      linkExpiry: false
    },
    privacy: {
      dataRetention: '12months',
      analyticsTracking: true,
      cookieConsent: true
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await settingsService.get();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings. Please try again.');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    try {
      setSaving(true);
      await settingsService.update({ [section]: settings[section] });
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: 'User',
      description: 'Manage your personal information and preferences'
    },
    {
      id: 'branding',
      title: 'Branding & Design',
      icon: 'Palette',
      description: 'Customize your brand appearance and domains'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'Bell',
      description: 'Control how and when you receive notifications'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'Shield',
      description: 'Data retention and privacy preferences'
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
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage your account preferences and configuration
          </p>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
                <ApperIcon name={section.icon} size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {section.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Profile Settings */}
            {section.id === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={settings.profile.name}
                  onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                  placeholder="your@email.com"
                />
                <Input
                  label="Company"
                  value={settings.profile.company}
                  onChange={(e) => updateSetting('profile', 'company', e.target.value)}
                  placeholder="Your company name"
                />
                <Input
                  label="Website"
                  type="url"
                  value={settings.profile.website}
                  onChange={(e) => updateSetting('profile', 'website', e.target.value)}
                  placeholder="https://your-website.com"
                />
                <div className="form-field md:col-span-2">
                  <label className="form-label">Timezone</label>
                  <select
                    value={settings.profile.timezone}
                    onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                    className="input-field"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Branding Settings */}
            {section.id === 'branding' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-field">
                  <label className="form-label">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.branding.primaryColor}
                      onChange={(e) => updateSetting('branding', 'primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600"
                    />
                    <Input
                      value={settings.branding.primaryColor}
                      onChange={(e) => updateSetting('branding', 'primaryColor', e.target.value)}
                      placeholder="#6750A4"
                      className="flex-1"
                    />
                  </div>
                </div>
                <Input
                  label="Logo URL"
                  type="url"
                  value={settings.branding.logo}
                  onChange={(e) => updateSetting('branding', 'logo', e.target.value)}
                  placeholder="https://your-domain.com/logo.png"
                />
                <Input
                  label="Custom Domain"
                  value={settings.branding.customDomain}
                  onChange={(e) => updateSetting('branding', 'customDomain', e.target.value)}
                  placeholder="links.yourdomain.com"
                />
                <Input
                  label="Favicon URL"
                  type="url"
                  value={settings.branding.favicon}
                  onChange={(e) => updateSetting('branding', 'favicon', e.target.value)}
                  placeholder="https://your-domain.com/favicon.ico"
                />
              </div>
            )}

            {/* Notification Settings */}
            {section.id === 'notifications' && (
              <div className="space-y-6">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive email notifications for important events' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports via email' },
                  { key: 'newLeads', label: 'New Lead Notifications', description: 'Instant notifications when new leads are captured' },
                  { key: 'linkExpiry', label: 'Link Expiry Warnings', description: 'Alerts when your links are about to expire' }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {notification.label}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {notification.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[notification.key]}
                        onChange={(e) => updateSetting('notifications', notification.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Privacy Settings */}
            {section.id === 'privacy' && (
              <div className="space-y-6">
                <div className="form-field">
                  <label className="form-label">Data Retention Period</label>
                  <select
                    value={settings.privacy.dataRetention}
                    onChange={(e) => updateSetting('privacy', 'dataRetention', e.target.value)}
                    className="input-field"
                  >
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="12months">12 Months</option>
                    <option value="24months">24 Months</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      Analytics Tracking
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Allow anonymous usage analytics to improve the platform
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.analyticsTracking}
                      onChange={(e) => updateSetting('privacy', 'analyticsTracking', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      Cookie Consent Banner
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Show cookie consent banner on your forms
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.cookieConsent}
                      onChange={(e) => updateSetting('privacy', 'cookieConsent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <Button
                variant="primary"
                icon="Save"
                onClick={() => handleSave(section.id)}
                loading={saving}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8 border-red-200 dark:border-red-800"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Danger Zone
            </h2>
            <p className="text-red-600 dark:text-red-400">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100">
                Export Account Data
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                Download all your data including links, forms, and leads
              </p>
            </div>
            <Button
              variant="outline"
              icon="Download"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100">
                Delete Account
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="danger"
              icon="Trash2"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  toast.error('Account deletion is not implemented in this demo');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;