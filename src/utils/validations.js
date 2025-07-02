export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

export const validateSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

export const getValidationErrors = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (value && fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      return;
    }
    
    if (value && fieldRules.url && !validateUrl(value)) {
      errors[field] = 'Please enter a valid URL';
      return;
    }
    
    if (value && fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
      return;
    }
    
    if (value && fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }
    
    if (value && fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }
    
    if (value && fieldRules.slug && !validateSlug(value)) {
      errors[field] = 'Only lowercase letters, numbers, and hyphens allowed';
      return;
    }
  });
  
  return errors;
};