import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { formService } from '@/services/api/formService';
import { toast } from 'react-toastify';

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: 'Type' },
  { type: 'email', label: 'Email', icon: 'Mail' },
  { type: 'phone', label: 'Phone', icon: 'Phone' },
  { type: 'select', label: 'Dropdown', icon: 'ChevronDown' },
  { type: 'textarea', label: 'Text Area', icon: 'FileText' },
  { type: 'checkbox', label: 'Checkbox', icon: 'Square' },
  { type: 'radio', label: 'Radio Buttons', icon: 'Circle' },
  { type: 'number', label: 'Number', icon: 'Hash' },
  { type: 'date', label: 'Date', icon: 'Calendar' },
  { type: 'url', label: 'Website URL', icon: 'Globe' },
];

const FormBuilder = ({ formId, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    fields: [],
    styling: {
      primaryColor: '#6750A4',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await formService.getById(formId);
      setForm(data);
    } catch (err) {
      setError('Failed to load form. Please try again.');
      console.error('Error loading form:', err);
    } finally {
      setLoading(false);
    }
  };

  const addField = (fieldType) => {
    const newField = {
      id: Date.now().toString(),
      type: fieldType,
      label: `${FIELD_TYPES.find(f => f.type === fieldType)?.label} Field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : []
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const moveField = (fieldId, direction) => {
    const fieldIndex = form.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    if (newIndex < 0 || newIndex >= form.fields.length) return;

    const newFields = [...form.fields];
    [newFields[fieldIndex], newFields[newIndex]] = [newFields[newIndex], newFields[fieldIndex]];

    setForm(prev => ({ ...prev, fields: newFields }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    if (form.fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    try {
      setLoading(true);
      let savedForm;
      
      if (formId) {
        savedForm = await formService.update(formId, form);
        toast.success('Form updated successfully');
      } else {
        savedForm = await formService.create(form);
        toast.success('Form created successfully');
      }

      if (onSave) {
        onSave(savedForm);
      }
    } catch (err) {
      toast.error('Failed to save form');
      console.error('Error saving form:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && formId) return <Loading />;
  if (error) return <Error message={error} onRetry={loadForm} />;

  const selectedFieldData = form.fields.find(f => f.id === selectedField);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Field Palette */}
      <div className="lg:col-span-1 space-y-6">
        <div className="card p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Form Settings
          </h3>
          <Input
            label="Form Name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter form name"
          />
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Add Fields
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {FIELD_TYPES.map((fieldType) => (
              <motion.button
                key={fieldType.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addField(fieldType.type)}
                className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-left"
              >
                <ApperIcon name={fieldType.icon} size={18} className="text-primary-600 dark:text-primary-400 mb-2" />
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {fieldType.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Field Properties */}
        {selectedFieldData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Field Properties
            </h3>
            <div className="space-y-4">
              <Input
                label="Label"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedField, { label: e.target.value })}
              />
              <Input
                label="Placeholder"
                value={selectedFieldData.placeholder}
                onChange={(e) => updateField(selectedField, { placeholder: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedField, { required: e.target.checked })}
                  className="rounded border-neutral-300 dark:border-neutral-600"
                />
                <label htmlFor="required" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Required field
                </label>
              </div>
              
              {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio') && (
                <div>
                  <label className="form-label">Options</label>
                  {selectedFieldData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...selectedFieldData.options];
                          newOptions[index] = e.target.value;
                          updateField(selectedField, { options: newOptions });
                        }}
                        className="input-field flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="small"
                        icon="X"
                        onClick={() => {
                          const newOptions = selectedFieldData.options.filter((_, i) => i !== index);
                          updateField(selectedField, { options: newOptions });
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Plus"
                    onClick={() => {
                      const newOptions = [...selectedFieldData.options, `Option ${selectedFieldData.options.length + 1}`];
                      updateField(selectedField, { options: newOptions });
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Form Canvas */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Form Builder
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant={previewMode ? 'primary' : 'secondary'}
              size="small"
              icon={previewMode ? 'Edit3' : 'Eye'}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="primary"
              icon="Save"
              onClick={handleSave}
              loading={loading}
            >
              Save Form
            </Button>
          </div>
        </div>

        <div className="card p-8 min-h-[600px]">
          {form.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="MousePointer" size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Start Building Your Form
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Click on field types from the left panel to add them to your form
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {form.fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={() => !previewMode && setSelectedField(field.id)}
                    className={`relative group border-2 rounded-lg p-4 transition-all cursor-pointer ${
                      selectedField === field.id && !previewMode
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    {!previewMode && (
                      <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="small"
                          icon="ChevronUp"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'up');
                          }}
                          disabled={index === 0}
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="ChevronDown"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'down');
                          }}
                          disabled={index === form.fields.length - 1}
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Trash2"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    )}

                    <div className="form-field">
                      <label className="form-label">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'email' && (
                        <input
                          type="email"
                          placeholder={field.placeholder}
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'phone' && (
                        <input
                          type="tel"
                          placeholder={field.placeholder}
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'number' && (
                        <input
                          type="number"
                          placeholder={field.placeholder}
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'url' && (
                        <input
                          type="url"
                          placeholder={field.placeholder}
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="input-field"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={field.placeholder}
                          rows={4}
                          className="input-field resize-none"
                          disabled={!previewMode}
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select className="input-field" disabled={!previewMode}>
                          <option value="">Select an option...</option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`radio-${field.id}`}
                                value={option}
                                className="border-neutral-300 dark:border-neutral-600"
                                disabled={!previewMode}
                              />
                              <span className="text-neutral-700 dark:text-neutral-300">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {field.type === 'checkbox' && (
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-neutral-300 dark:border-neutral-600"
                            disabled={!previewMode}
                          />
                          <span className="text-neutral-700 dark:text-neutral-300">
                            {field.placeholder || 'Checkbox option'}
                          </span>
                        </label>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {previewMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-neutral-200 dark:border-neutral-700"
                >
                  <Button variant="primary" size="large" className="w-full">
                    Submit Form
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;