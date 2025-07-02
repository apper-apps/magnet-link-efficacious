import integrationsData from '@/services/mockData/integrations.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class IntegrationService {
  constructor() {
    this.availableIntegrations = [...integrationsData.available];
    this.connectedIntegrations = [...integrationsData.connected];
  }

  async getAll() {
    await delay(300);
    return {
      available: [...this.availableIntegrations],
      connected: [...this.connectedIntegrations]
    };
  }

  async connect(integrationId) {
    await delay(500);
    const integration = this.availableIntegrations.find(i => i.Id === parseInt(integrationId));
    if (!integration) {
      throw new Error('Integration not found');
    }
    
    // Check if already connected
    if (this.connectedIntegrations.some(c => c.Id === parseInt(integrationId))) {
      throw new Error('Integration already connected');
    }

    const connectedIntegration = {
      Id: integration.Id,
      name: integration.name,
      logo: integration.logo,
      icon: integration.icon
    };
    
    this.connectedIntegrations.push(connectedIntegration);
    return connectedIntegration;
  }

  async disconnect(integrationId) {
    await delay(300);
    const index = this.connectedIntegrations.findIndex(c => c.Id === parseInt(integrationId));
    if (index === -1) {
      throw new Error('Integration not connected');
    }
    
    this.connectedIntegrations.splice(index, 1);
    return true;
  }
}

export const integrationService = new IntegrationService();