import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { linkService } from '@/services/api/linkService';
import { toast } from 'react-toastify';

const LinkTable = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await linkService.getAll();
      setLinks(data);
    } catch (err) {
      setError('Failed to load links. Please try again.');
      console.error('Error loading links:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (linkId, currentStatus) => {
    try {
      const updatedLink = await linkService.update(linkId, { 
        isActive: !currentStatus 
      });
      setLinks(links.map(link => 
        link.Id === linkId ? updatedLink : link
      ));
      toast.success(`Link ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update link status');
      console.error('Error updating link:', err);
    }
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await linkService.delete(linkId);
      setLinks(links.filter(link => link.Id !== linkId));
      setSelectedLinks(selectedLinks.filter(id => id !== linkId));
      toast.success('Link deleted successfully');
    } catch (err) {
      toast.error('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLinks.length} links?`)) return;
    
    try {
      await Promise.all(selectedLinks.map(id => linkService.delete(id)));
      setLinks(links.filter(link => !selectedLinks.includes(link.Id)));
      setSelectedLinks([]);
      toast.success(`${selectedLinks.length} links deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete links');
      console.error('Error deleting links:', err);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const filteredLinks = links.filter(link =>
    link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadLinks} />;
  if (filteredLinks.length === 0 && searchQuery === '') {
    return (
      <Empty
        icon="Link"
        title="No links created yet"
        description="Create your first magnet link to start capturing leads from your shared content."
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
            Your Links
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and monitor your magnet links
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedLinks.length > 0 && (
            <Button
              variant="danger"
              size="small"
              icon="Trash2"
              onClick={handleBulkDelete}
            >
              Delete ({selectedLinks.length})
            </Button>
          )}
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => window.location.href = '/links/create'}
          >
            Create Link
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search links..."
        onSearch={setSearchQuery}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedLinks.length === filteredLinks.length && filteredLinks.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLinks(filteredLinks.map(link => link.Id));
                      } else {
                        setSelectedLinks([]);
                      }
                    }}
                    className="rounded border-neutral-300 dark:border-neutral-600"
                  />
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Link
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Original URL
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Submissions
                </th>
                <th className="text-left p-4 font-medium text-neutral-900 dark:text-neutral-100">
                  Status
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
                {filteredLinks.map((link, index) => (
                  <motion.tr
                    key={link.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedLinks.includes(link.Id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLinks([...selectedLinks, link.Id]);
                          } else {
                            setSelectedLinks(selectedLinks.filter(id => id !== link.Id));
                          }
                        }}
                        className="rounded border-neutral-300 dark:border-neutral-600"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Link" size={16} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            magnet.link/{link.slug}
                          </p>
                          <button
                            onClick={() => copyToClipboard(`https://magnet.link/${link.slug}`)}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                          >
                            <ApperIcon name="Copy" size={12} />
                            Copy
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="text-neutral-900 dark:text-neutral-100 truncate">
                          {link.originalUrl}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {new URL(link.originalUrl).hostname}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {link.submissions || 0}
                        </span>
                        <ApperIcon name="Users" size={14} className="text-neutral-400" />
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(link.Id, link.isActive)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          link.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          link.isActive ? 'bg-green-500' : 'bg-neutral-400'
                        }`} />
                        {link.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-neutral-400">
                      {format(new Date(link.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          icon="BarChart3"
                          onClick={() => window.location.href = `/analytics/${link.Id}`}
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Edit3"
                          onClick={() => window.location.href = `/links/${link.Id}/edit`}
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Trash2"
                          onClick={() => handleDelete(link.Id)}
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

      {filteredLinks.length === 0 && searchQuery && (
        <Empty
          icon="Search"
          title="No links found"
          description={`No links match your search for "${searchQuery}". Try adjusting your search terms.`}
        />
      )}
    </div>
  );
};

export default LinkTable;