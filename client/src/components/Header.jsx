import React from 'react';
import { Users, Plus, Download, RefreshCw } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const Header = ({ onAddContact, onExportCSV, contactCount = 0 }) => {
  const { isConnected } = useSocket();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Contact Manager
              </h1>
              <p className="text-sm text-gray-500">
                {contactCount} contacts
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Real-time sync indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`status-${isConnected ? 'online' : 'offline'}`}></div>
              <span>{isConnected ? 'Connected' : 'Offline'}</span>
              {isConnected && (
                <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />
              )}
            </div>

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
    </header>
  );
};

export default Header;