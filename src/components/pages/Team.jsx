import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { teamService } from '@/services/api/teamService';
import { toast } from 'react-toastify';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer',
    message: ''
  });

  const roles = [
    { value: 'owner', label: 'Owner', description: 'Full access to everything' },
    { value: 'admin', label: 'Admin', description: 'Manage team and settings' },
    { value: 'editor', label: 'Editor', description: 'Create and edit content' },
    { value: 'viewer', label: 'Viewer', description: 'View-only access' }
  ];

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await teamService.getAll();
      setMembers(data);
    } catch (err) {
      setError('Failed to load team members. Please try again.');
      console.error('Error loading team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!inviteForm.email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const newMember = await teamService.invite(inviteForm);
      setMembers([...members, newMember]);
      setInviteForm({ email: '', role: 'viewer', message: '' });
      setShowInviteModal(false);
      toast.success('Invitation sent successfully');
    } catch (err) {
      toast.error('Failed to send invitation');
      console.error('Error inviting member:', err);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const updatedMember = await teamService.updateRole(memberId, newRole);
      setMembers(members.map(member => 
        member.Id === memberId ? updatedMember : member
      ));
      toast.success('Role updated successfully');
    } catch (err) {
      toast.error('Failed to update role');
      console.error('Error updating role:', err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      await teamService.remove(memberId);
      setMembers(members.filter(member => member.Id !== memberId));
      toast.success('Team member removed successfully');
    } catch (err) {
      toast.error('Failed to remove team member');
      console.error('Error removing member:', err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'editor': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'viewer': return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'inactive': return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadTeamMembers} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Team Members
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your team and permissions
          </p>
        </div>
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={() => setShowInviteModal(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Members', value: members.length, icon: 'Users', color: 'primary' },
          { title: 'Active', value: members.filter(m => m.status === 'active').length, icon: 'UserCheck', color: 'green' },
          { title: 'Pending', value: members.filter(m => m.status === 'pending').length, icon: 'Clock', color: 'yellow' },
          { title: 'Admins', value: members.filter(m => m.role === 'admin' || m.role === 'owner').length, icon: 'Shield', color: 'blue' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/40 rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Members Table */}
      {members.length === 0 ? (
        <Empty
          icon="Users"
          title="No team members yet"
          description="Invite your first team member to start collaborating on your magnet links."
          actionLabel="Invite Member"
          onAction={() => setShowInviteModal(true)}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Member
                  </th>
                  <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Role
                  </th>
                  <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Last Active
                  </th>
                  <th className="text-right p-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {members.map((member, index) => (
                    <motion.tr
                      key={member.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-white font-semibold text-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {member.name}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {member.role === 'owner' ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.Id, e.target.value)}
                            className="text-xs border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 bg-white dark:bg-neutral-800"
                          >
                            {roles.filter(r => r.value !== 'owner').map(role => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'active' ? 'bg-green-500' :
                            member.status === 'pending' ? 'bg-yellow-500' :
                            'bg-neutral-400'
                          }`} />
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">
                        {member.lastActive ? format(new Date(member.lastActive), 'MMM d, yyyy') : 'Never'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {member.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="small"
                              icon="RotateCcw"
                              onClick={() => {
                                // Resend invitation logic
                                toast.success('Invitation resent');
                              }}
                            />
                          )}
                          {member.role !== 'owner' && (
                            <Button
                              variant="ghost"
                              size="small"
                              icon="Trash2"
                              onClick={() => handleRemoveMember(member.Id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Invite Team Member
                </h3>
                <Button
                  variant="ghost"
                  size="small"
                  icon="X"
                  onClick={() => setShowInviteModal(false)}
                />
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="teammate@company.com"
                  required
                />

                <div className="form-field">
                  <label className="form-label">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="input-field"
                  >
                    {roles.filter(r => r.value !== 'owner').map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Personal Message (Optional)</label>
                  <textarea
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                    placeholder="Add a personal message to the invitation..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    icon="Send"
                    className="flex-1"
                  >
                    Send Invitation
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;