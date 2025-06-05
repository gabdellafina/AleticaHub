// User Management Hook

import { useState, useCallback } from 'react';
import { User } from '../../shared/types';
import { API_ENDPOINTS } from '../../shared/constants';
import { handleApiResponse, storage } from '../../shared/utils';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = storage.get<string>('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.USUARIOS, {
        headers: getAuthHeaders()
      });

      const data = await handleApiResponse<User[]>(response);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveUser = useCallback(async (userId: string) => {
    try {
      setError(null);

      const response = await fetch(API_ENDPOINTS.APROVAR_USUARIO(userId), {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const updatedUser = await handleApiResponse<User>(response);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? updatedUser : user
        )
      );

      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const promoteToAdmin = useCallback(async (userId: string) => {
    try {
      setError(null);

      const response = await fetch(API_ENDPOINTS.PROMOVER_USUARIO(userId), {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const updatedUser = await handleApiResponse<User>(response);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? updatedUser : user
        )
      );

      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const suspendUser = useCallback(async (userId: string) => {
    try {
      setError(null);

      const response = await fetch(API_ENDPOINTS.USUARIO_BY_ID(userId), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'suspenso' })
      });

      const updatedUser = await handleApiResponse<User>(response);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? updatedUser : user
        )
      );

      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setError(null);

      const response = await fetch(API_ENDPOINTS.USUARIO_BY_ID(userId), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      await handleApiResponse<void>(response);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    approveUser,
    promoteToAdmin,
    suspendUser,
    deleteUser
  };
};
