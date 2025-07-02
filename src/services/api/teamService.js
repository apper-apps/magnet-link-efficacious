import teamData from '@/services/mockData/team.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TeamService {
  constructor() {
    this.members = [...teamData];
  }

  async getAll() {
    await delay(300);
    return [...this.members];
  }

  async invite(inviteData) {
    await delay(400);
    const newId = Math.max(...this.members.map(m => m.Id)) + 1;
    const newMember = {
      Id: newId,
      name: inviteData.email.split('@')[0], // Extract name from email
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      avatar: null,
      lastActive: null,
      invitedAt: new Date().toISOString()
    };
    this.members.push(newMember);
    return { ...newMember };
  }

  async updateRole(id, newRole) {
    await delay(300);
    const index = this.members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Team member not found');
    }
    this.members[index] = { ...this.members[index], role: newRole };
    return { ...this.members[index] };
  }

  async remove(id) {
    await delay(250);
    const index = this.members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Team member not found');
    }
    this.members.splice(index, 1);
    return true;
  }
}

export const teamService = new TeamService();