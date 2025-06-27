import React from 'react';
import { Users, Plus, Download, RefreshCw } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const Header = ({ onAddContact, onExportCSV, contactCount = 0 }) => {
  const { isConnected } = useSocket();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Manager</h1>
              <p className="text-sm text-gray-500">{contactCount} contacts</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Real-time sync indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isConnected && <RefreshCw className="w-4 h-4 text-green-500 animate-pulse-slow" />}
            </div>

            {/* Export button */}
            <button
              onClick={onExportCSV}
              className="btn-secondary px-4 py-2 text-sm"
              title="Export to CSV"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            {/* Add contact button */}
            <button
              onClick={onAddContact}
              className="btn-primary px-4 py-2 text-sm"
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