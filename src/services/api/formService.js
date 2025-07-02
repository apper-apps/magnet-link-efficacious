import formsData from '@/services/mockData/forms.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FormService {
  constructor() {
    this.forms = [...formsData];
  }

  async getAll() {
    await delay(300);
    return [...this.forms];
  }

  async getById(id) {
    await delay(200);
    const form = this.forms.find(f => f.Id === parseInt(id));
    if (!form) {
      throw new Error('Form not found');
    }
    return { ...form };
  }

  async create(formData) {
    await delay(400);
    const newId = Math.max(...this.forms.map(f => f.Id)) + 1;
    const newForm = {
      Id: newId,
      ...formData,
      createdAt: new Date().toISOString()
    };
    this.forms.unshift(newForm);
    return { ...newForm };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.forms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Form not found');
    }
    this.forms[index] = { ...this.forms[index], ...updates };
    return { ...this.forms[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.forms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Form not found');
    }
    this.forms.splice(index, 1);
    return true;
  }
}

export const formService = new FormService();