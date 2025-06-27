import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, User, Mail, Phone } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[+]?[0-9][\d]{0,15}$/, 'Please enter a valid phone number'),
});

const ContactForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contact = null, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: contact?.name || '',
        email: contact?.email || '',
        phone: contact?.phone || '',
      });
    }
  }, [contact, isOpen, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {contact ? 'Update contact information' : 'Enter contact details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>Full Name *</span>
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>Email Address *</span>
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>Phone Number *</span>
              </label>
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                className={`input ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter phone number"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{contact ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                contact ? 'Update Contact' : 'Create Contact'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;