import React from 'react';
import { Users, Plus, Download, RefreshCw } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const Header = ({ onAddContact, onExportCSV, contactCount = 0 }) => {
  const { isConnected } = useSocket();

  return (
    <div className="bg-background-secondary border-2 border-border-primary shadow-brute mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent-green border-2 border-border-primary flex items-center justify-center shadow-brute-sm">
              <Users className="w-7 h-7 text-text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-text-primary">
                Contact Manager
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-2">
                  <div className={`status-${isConnected ? 'online' : 'offline'}`}></div>
                  <span className="text-sm text-text-secondary font-medium">
                    {isConnected ? 'Live Sync' : 'Offline'}
                  </span>
                  {isConnected && (
                    <RefreshCw className="w-3 h-3 text-accent-green animate-spin" />
                  )}
                </div>
                <span className="text-sm text-text-muted">•</span>
                <span className="text-sm text-text-secondary font-medium">
                  {contactCount} contacts
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Export button */}
            <button
              onClick={onExportCSV}
              className="btn-secondary"
              title="Export to CSV"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            {/* Add contact button */}
            <button
              onClick={onAddContact}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;