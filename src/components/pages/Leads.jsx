import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { leadService } from '@/services/api/leadService';
import { linkService } from '@/services/api/linkService';
import { toast } from 'react-toastify';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filterBy, setFilterBy] = useState(null);

  const statusFilters = [
    { value: 'all', label: 'All Leads' },
    { value: 'recent', label: 'Recent' },
    { value: 'tagged', label: 'Tagged' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [leadsData, linksData] = await Promise.all([
        leadService.getAll(),
        linkService.getAll()
      ]);
      setLeads(leadsData);
      setLinks(linksData);
    } catch (err) {
      setError('Failed to load leads. Please try again.');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadService.delete(leadId);
      setLeads(leads.filter(lead => lead.Id !== leadId));
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error('Failed to delete lead');
      console.error('Error deleting lead:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) return;
    
    try {
      await Promise.all(selectedLeads.map(id => leadService.delete(id)));
      setLeads(leads.filter(lead => !selectedLeads.includes(lead.Id)));
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete leads');
      console.error('Error deleting leads:', err);
    }
  };

  const exportToCSV = () => {
    const csvData = leads.map(lead => ({
      'Lead ID': lead.Id,
      'Email': lead.data.email || '',
      'Name': lead.data.name || '',
      'Phone': lead.data.phone || '',
      'Source Link': getSourceLink(lead.linkId),
      'Created Date': format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      'Tags': lead.tags ? lead.tags.join(', ') : ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Leads exported successfully');
  };

  const getSourceLink = (linkId) => {
    const link = links.find(l => l.Id === linkId);
    return link ? link.slug : 'Unknown';
  };

  const addTag = async (leadId, tag) => {
    try {
      const lead = leads.find(l => l.Id === leadId);
      const newTags = [...(lead.tags || []), tag];
      const updatedLead = await leadService.update(leadId, { tags: newTags });
      setLeads(leads.map(l => l.Id === leadId ? updatedLead : l));
      toast.success('Tag added successfully');
    } catch (err) {
      toast.error('Failed to add tag');
      console.error('Error adding tag:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.data.email && lead.data.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.data.name && lead.data.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.data.phone && lead.data.phone.includes(searchQuery));
    
    if (filterBy === 'recent') {
      const isRecent = new Date(lead.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && isRecent;
    }
    
    if (filterBy === 'tagged') {
      return matchesSearch && lead.tags && lead.tags.length > 0;
    }
    
    return matchesSearch;
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (filteredLeads.length === 0 && searchQuery === '' && !filterBy) {
    return (
      <Empty
        icon="Users"
        title="No leads captured yet"
        description="Your leads will appear here once visitors start submitting your forms. Create your first magnet link to get started."
        actionLabel="Create Link"
        onAction={() => window.location.href = '/links/create'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Leads
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and organize your captured leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedLeads.length > 0 && (
            <Button
              variant="danger"
              size="small"
              icon="Trash2"
              onClick={handleBulkDelete}
            >
              Delete ({selectedLeads.length})
            </Button>
          )}
          <Button
            variant="secondary"
            icon="Download"
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        placeholder="Search leads by email, name, or phone..."
        onSearch={setSearchQuery}
        showFilters={true}
        filters={statusFilters}
        activeFilter={filterBy}
        onFilterChange={setFilterBy}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Leads', value: leads.length, icon: 'Users', color: 'primary' },
          { title: 'This Week', value: leads.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: 'Calendar', color: 'green' },
          { title: 'Tagged', value: leads.filter(l => l.tags && l.tags.length > 0).length, icon: 'Tag', color: 'blue' },
          { title: 'Sources', value: [...new Set(leads.map(l => l.linkId))].length, icon: 'Link', color: 'purple' }
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

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(filteredLeads.map(lead => lead.Id));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                    className="rounded border-neutral-300 dark:border-neutral-600"
                  />
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Source
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Tags
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Created
                </th>
                <th className="text-right p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.Id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead.Id]);
                          } else {
                            setSelectedLeads(selectedLeads.filter(id => id !== lead.Id));
                          }
                        }}
                        className="rounded border-neutral-300 dark:border-neutral-600"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {lead.data.name ? lead.data.name.charAt(0).toUpperCase() : lead.data.email ? lead.data.email.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {lead.data.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {lead.data.email || 'No email'}
                          </p>
                          {lead.data.phone && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {lead.data.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Link" size={16} className="text-neutral-400" />
                        <span className="text-neutral-900 dark:text-neutral-100">
                          /{getSourceLink(lead.linkId)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {lead.tags && lead.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300"
                          >
                            {tag}
                          </span>
                        ))}
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Plus"
                          onClick={() => {
                            const tag = prompt('Enter a tag:');
                            if (tag) addTag(lead.Id, tag.trim());
                          }}
                          className="h-6 w-6 p-0"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-neutral-400">
                      <div>
                        <p>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</p>
                        <p className="text-xs">{format(new Date(lead.createdAt), 'HH:mm')}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Mail"
                          onClick={() => window.location.href = `mailto:${lead.data.email}`}
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Trash2"
                          onClick={() => handleDelete(lead.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (searchQuery || filterBy) && (
        <Empty
          icon="Search"
          title="No leads found"
          description={`No leads match your current search${filterBy ? ' and filter' : ''} criteria. Try adjusting your search terms.`}
        />
      )}
    </div>
  );
};

export default Leads;