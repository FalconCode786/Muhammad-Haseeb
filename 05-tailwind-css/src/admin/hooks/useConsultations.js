import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useConsultations = () => {
  const [consultations, setConsultations] = useState([]);
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
    upcoming: false,
  });

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.upcoming && { upcoming: 'true' }),
      });

      const response = await api.get(`/consultation?${params}`);
      setConsultations(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const updateConsultation = async (id, data) => {
    try {
      const response = await api.put(`/consultation/${id}`, data);
      setConsultations(prev => prev.map(c => c._id === id ? response.data.data : c));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update consultation'
      };
    }
  };

  const deleteConsultation = async (id) => {
    try {
      await api.delete(`/consultation/${id}`);
      setConsultations(prev => prev.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete consultation'
      };
    }
  };

  return {
    consultations,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPagination,
    updateConsultation,
    deleteConsultation,
    refresh: fetchConsultations
  };
};
