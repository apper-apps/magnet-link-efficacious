import linksData from '@/services/mockData/links.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LinkService {
  constructor() {
    this.links = [...linksData];
  }

  async getAll() {
    await delay(300);
    return [...this.links];
  }

  async getById(id) {
    await delay(200);
    const link = this.links.find(l => l.Id === parseInt(id));
    if (!link) {
      throw new Error('Link not found');
    }
    return { ...link };
  }

  async create(linkData) {
    await delay(400);
    const newId = Math.max(...this.links.map(l => l.Id)) + 1;
    const newLink = {
      Id: newId,
      ...linkData,
      createdAt: new Date().toISOString(),
      submissions: 0,
      views: 0,
      conversionRate: 0,
      isActive: true
    };
    this.links.unshift(newLink);
    return { ...newLink };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.links.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Link not found');
    }
    this.links[index] = { ...this.links[index], ...updates };
    return { ...this.links[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.links.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Link not found');
    }
    this.links.splice(index, 1);
    return true;
  }
}

export const linkService = new LinkService();