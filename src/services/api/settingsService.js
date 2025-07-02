import settingsData from '@/services/mockData/settings.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.settings = { ...settingsData };
  }

  async get() {
    await delay(300);
    return { ...this.settings };
  }

  async update(updates) {
    await delay(400);
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();