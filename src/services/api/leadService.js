import leadsData from '@/services/mockData/leads.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LeadService {
  constructor() {
    this.leads = [...leadsData];
  }

  async getAll() {
    await delay(300);
    return [...this.leads];
  }

  async getById(id) {
    await delay(200);
    const lead = this.leads.find(l => l.Id === parseInt(id));
    if (!lead) {
      throw new Error('Lead not found');
    }
    return { ...lead };
  }

  async create(leadData) {
    await delay(400);
    const newId = Math.max(...this.leads.map(l => l.Id)) + 1;
    const newLead = {
      Id: newId,
      ...leadData,
      createdAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    return { ...newLead };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Lead not found');
    }
    this.leads[index] = { ...this.leads[index], ...updates };
    return { ...this.leads[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Lead not found');
    }
    this.leads.splice(index, 1);
    return true;
  }

  async getByLinkId(linkId) {
    await delay(200);
    return this.leads.filter(l => l.linkId === parseInt(linkId));
  }
}

export const leadService = new LeadService();