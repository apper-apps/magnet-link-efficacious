import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { formService } from '@/services/api/formService';
import { toast } from 'react-toastify';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await formService.getAll();
      setForms(data);
    } catch (err) {
      setError('Failed to load forms. Please try again.');
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    
    try {
      await formService.delete(formId);
      setForms(forms.filter(form => form.Id !== formId));
      toast.success('Form deleted successfully');
    } catch (err) {
      toast.error('Failed to delete form');
      console.error('Error deleting form:', err);
    }
  };

  const handleDuplicate = async (form) => {
    try {
      const duplicatedForm = await formService.create({
        ...form,
        name: `${form.name} (Copy)`,
        Id: undefined
      });
      setForms([duplicatedForm, ...forms]);
      toast.success('Form duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate form');
      console.error('Error duplicating form:', err);
    }
  };

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadForms} />;
  if (filteredForms.length === 0 && searchQuery === '') {
    return (
      <Empty
        icon="FileText"
        title="No forms created yet"
        description="Create your first form to start capturing leads with beautiful, customizable forms."
        actionLabel="Create Form"
        onAction={() => window.location.href = '/forms/builder'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Forms
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Design and manage your lead capture forms
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => window.location.href = '/forms/builder'}
        >
          Create Form
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search forms..."
        onSearch={setSearchQuery}
      />

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredForms.map((form, index) => (
            <motion.div
              key={form.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="card p-6 group cursor-pointer"
            >
              {/* Form Preview */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="FileText" size={32} className="text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {form.fields?.length || 0} fields
                  </p>
                </div>
              </div>

              {/* Form Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {form.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Created {format(new Date(form.createdAt), 'MMM d, yyyy')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Edit3"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/forms/builder/${form.Id}`;
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Copy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(form);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Trash2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(form.Id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  />
                </div>
                
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <ApperIcon name="Users" size={12} />
                  <span>0 submissions</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredForms.length === 0 && searchQuery && (
        <Empty
          icon="Search"
          title="No forms found"
          description={`No forms match your search for "${searchQuery}". Try adjusting your search terms.`}
        />
      )}

      {/* Templates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-8"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Start with a template
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Speed up your form creation with our professionally designed templates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Lead Magnet', icon: 'Download', fields: ['Email', 'Name', 'Company'] },
              { name: 'Newsletter', icon: 'Mail', fields: ['Email', 'First Name'] },
              { name: 'Contact Form', icon: 'MessageSquare', fields: ['Name', 'Email', 'Message'] }
            ].map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                onClick={() => window.location.href = `/forms/builder?template=${template.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={template.icon} size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {template.name}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {template.fields.join(', ')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Forms;