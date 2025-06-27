import React, { useState, useCallback, useMemo } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/Header';
import ContactsTable from './components/ContactsTable';
import ContactForm from './components/ContactForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { 
  useContacts, 
  useCreateContact, 
  useUpdateContact, 
  useDeleteContact 
} from './hooks/useContacts';
import toast from 'react-hot-toast';
import './App.css';

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

  console.log('App - isLoading:', isLoading, 'error:', error, 'contactsData:', contactsData);

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
    } catch {
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
    } catch {
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
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h2>
          <p className="text-text-secondary mb-4 font-medium">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header
          onAddContact={handleAddContact}
          onExportCSV={handleExportCSV}
          contactCount={pagination.total || 0}
        />

        {/* Contacts Table */}
        <ContactsTable
          contacts={contacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onSearch={handleSearch}
          currentPage={currentPage}
          totalPages={pagination.totalPages || 1}
          onPageChange={handlePageChange}
          searchQuery={searchTerm}
          loading={isLoading}
        />
      </main>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="modal-backdrop">
          <div className="modal">
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
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
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
      )}
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
