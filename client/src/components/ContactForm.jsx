import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, User, Mail, Phone } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import Input from './ui/Input';

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
        <div className="flex items-center justify-between p-6 border-b-2 border-border-primary">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <p className="text-sm text-text-muted mt-1 font-medium">
              {contact ? 'Update contact information' : 'Enter contact details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-beige hover:scale-95 transition-all border-2 border-transparent hover:border-border-primary"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="space-y-6">
            <Input
              label="Full Name *"
              icon={User}
              {...register('name')}
              placeholder="Enter full name"
              disabled={isLoading}
              error={errors.name?.message}
            />

            <Input
              label="Email Address *"
              icon={Mail}
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              disabled={isLoading}
              error={errors.email?.message}
            />

            <Input
              label="Phone Number *"
              icon={Phone}
              {...register('phone')}
              type="tel"
              placeholder="Enter phone number"
              disabled={isLoading}
              error={errors.phone?.message}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-border-primary mt-6">
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