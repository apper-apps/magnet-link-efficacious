// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnalyticsService {
  async getOverview() {
    await delay(400);
    return {
      totalViews: 24567,
      totalSubmissions: 3842,
      conversionRate: 15.6,
      bounceRate: 23.4
    };
  }

  async getByLinkId(linkId, options = {}) {
    await delay(300);
    
    // Generate mock data based on date range
    const range = options.range || '30d';
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    
    const dates = [];
    const viewsData = [];
    const submissionsData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate realistic data with some variation
      const baseViews = Math.floor(Math.random() * 100) + 50;
      const baseSubmissions = Math.floor(baseViews * (0.10 + Math.random() * 0.10));
      
      viewsData.push(baseViews);
      submissionsData.push(baseSubmissions);
    }

    return {
      dates,
      viewsData,
      submissionsData,
      totalViews: viewsData.reduce((a, b) => a + b, 0),
      totalSubmissions: submissionsData.reduce((a, b) => a + b, 0),
      conversionRate: ((submissionsData.reduce((a, b) => a + b, 0) / viewsData.reduce((a, b) => a + b, 0)) * 100).toFixed(1),
      bounceRate: (Math.random() * 30 + 20).toFixed(1),
      sources: [
        { name: 'Direct', visitors: 1234, percentage: 35, icon: 'Globe' },
        { name: 'Social Media', visitors: 892, percentage: 25, icon: 'Share2' },
        { name: 'Email', visitors: 674, percentage: 19, icon: 'Mail' },
        { name: 'Search', visitors: 445, percentage: 13, icon: 'Search' },
        { name: 'Referral', visitors: 287, percentage: 8, icon: 'ExternalLink' }
      ]
    };
  }
}

export const analyticsService = new AnalyticsService();