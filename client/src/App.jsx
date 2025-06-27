import React, { useState, useCallback, useMemo } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/Header';
import SearchBar from './components/ui/SearchBar';
import ContactsTable from './components/ContactsTable';
import Pagination from './components/ui/Pagination';
import ContactForm from './components/ContactForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { 
  useContacts, 
  useCreateContact, 
  useUpdateContact, 
  useDeleteContact 
} from './hooks/useContacts';
import toast from 'react-hot-toast';

function ContactManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const limit = 10;

  // Queries and mutations
  const { 
    data: contactsData, 
    isLoading, 
    error 
  } = useContacts(currentPage, limit, searchTerm);

  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  // Memoized values
  const contacts = useMemo(() => contactsData?.contacts || [], [contactsData]);
  const pagination = useMemo(() => contactsData?.pagination || {}, [contactsData]);

  // Event handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleAddContact = useCallback(() => {
    setSelectedContact(null);
    setIsFormOpen(true);
  }, []);

  const handleEditContact = useCallback((contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  }, []);

  const handleDeleteContact = useCallback((contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (selectedContact) {
        await updateContactMutation.mutateAsync({
          id: selectedContact.id,
          data: formData
        });
        toast.success('Contact updated successfully');
      } else {
        await createContactMutation.mutateAsync(formData);
        toast.success('Contact created successfully');
      }
      setIsFormOpen(false);
      setSelectedContact(null);
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  }, [selectedContact, updateContactMutation, createContactMutation]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedContact) return;

    try {
      await deleteContactMutation.mutateAsync(selectedContact.id);
      toast.success('Contact deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }, [selectedContact, deleteContactMutation]);

  const handleExportCSV = useCallback(() => {
    if (!contacts.length) {
      toast.error('No contacts to export');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Phone'],
      ...contacts.map(contact => [contact.name, contact.email, contact.phone])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Contacts exported to CSV');
  }, [contacts]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddContact={handleAddContact}
        onExportCSV={handleExportCSV}
        contactCount={pagination.total || 0}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search contacts by name, email, or phone..."
              className="max-w-md"
            />
          </div>

          {/* Contacts Table */}
          <ContactsTable
            contacts={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              total={pagination.total}
              limit={pagination.limit}
            />
          )}
        </div>
      </main>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={handleFormSubmit}
        contact={selectedContact}
        isLoading={createContactMutation.isLoading || updateContactMutation.isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedContact(null);
        }}
        onConfirm={handleDeleteConfirm}
        contact={selectedContact}
        isLoading={deleteContactMutation.isLoading}
      />
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <ContactManager />
    </SocketProvider>
  );
}

export default App;
