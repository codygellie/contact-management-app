import React, { useMemo } from 'react';
import { Edit, Trash2, Phone, Mail, MapPin, User, Search } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import Pagination from './ui/Pagination';

const ContactsTable = ({ 
  contacts, 
  loading, 
  onEdit, 
  onDelete, 
  onSearch, 
  currentPage, 
  totalPages, 
  onPageChange,
  searchQuery 
}) => {
  const getInitials = useMemo(() => {
    return (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };
  }, []);

  const getAvatarColor = useMemo(() => {
    return (name) => {
      const colors = [
        'bg-accent-green',
        'bg-accent-beige',
        'bg-accent-matcha',
        'bg-red-100',
        'bg-blue-100',
        'bg-purple-100',
        'bg-orange-100',
        'bg-teal-100'
      ];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="card">
      {/* Search Bar */}
      <div className="p-6 border-b-2 border-border-primary">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search contacts by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="search-bar pl-12"
          />
        </div>
      </div>

      {/* No results state or Table */}
      {(!contacts || contacts.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
          <User className="w-16 h-16 text-text-muted mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-3">
            No contacts found
          </h3>
          <p className="text-text-secondary mb-6 font-medium">
            {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
          </p>
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-primary uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-primary uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-primary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-text-primary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-accent-beige hover:bg-opacity-30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${getAvatarColor(contact.name)} border-2 border-border-primary flex items-center justify-center text-text-primary font-bold text-sm shadow-brute-sm`}>
                          {getInitials(contact.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-text-primary">
                            {contact.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-text-secondary font-medium">
                        <Phone className="w-4 h-4 text-accent-green mr-3" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-text-secondary font-medium">
                        <Mail className="w-4 h-4 text-accent-green mr-3" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => onEdit(contact)}
                          className="btn-ghost p-2 hover:bg-accent-green hover:text-text-primary"
                          title="Edit contact"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(contact)}
                          className="btn-ghost p-2 text-red-600 hover:bg-red-100 hover:text-red-800"
                          title="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t-2 border-border-primary">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                hasNext={currentPage < totalPages}
                hasPrev={currentPage > 1}
                total={contacts.length * totalPages}
                limit={10}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactsTable;
