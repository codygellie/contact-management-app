import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  contact, 
  isLoading = false 
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-2 border-border-primary">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-text-primary">Delete Contact</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-beige hover:scale-95 transition-all border-2 border-transparent hover:border-border-primary"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-text-secondary mb-6 font-medium">
            Are you sure you want to delete <strong className="text-text-primary">{contact.name}</strong>? 
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn-danger"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Contact'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
