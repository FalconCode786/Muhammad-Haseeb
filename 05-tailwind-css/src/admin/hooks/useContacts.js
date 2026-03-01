import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sort: '-createdAt'
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/contact?${params}`);
      setContacts(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const updateContact = async (id, data) => {
    try {
      const response = await api.put(`/contact/${id}`, data);
      setContacts(contacts.map(c => c._id === id ? response.data.data : c));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update contact'
      };
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setContacts(contacts.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete contact'
      };
    }
  };

  const getContactStats = async () => {
    try {
      const response = await api.get('/contact/stats');
      return response.data.data;
    } catch {
      return null;
    }
  };

  return {
    contacts,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPagination,
    updateContact,
    deleteContact,
    getContactStats,
    refresh: fetchContacts
  };
};