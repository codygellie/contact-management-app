import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../services/api';
import toast from 'react-hot-toast';

export const useContacts = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: ['contacts', page, limit, search],
    queryFn: () => contactsApi.getContacts({ page, limit, search }),
    select: (response) => {
      const contacts = response.data || [];
            const total = contacts.length;
      const totalPages = Math.ceil(total / limit);
      
      return {
        contacts: contacts,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          totalPages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    },
    keepPreviousData: true,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactsApi.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => contactsApi.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};