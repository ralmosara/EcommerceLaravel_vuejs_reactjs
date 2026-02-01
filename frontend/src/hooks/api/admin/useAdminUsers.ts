import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/api/endpoints/admin/users';
import type { UserFilters } from '@/api/types';
import { UserRole } from '@/api/types';
import toast from 'react-hot-toast';

export function useAdminUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminUsersApi.getUsers(filters),
  });
}

export function useAdminUserStatistics() {
  return useQuery({
    queryKey: ['admin', 'users', 'statistics'],
    queryFn: () => adminUsersApi.getStatistics(),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, role }: { uuid: string; role: UserRole }) =>
      adminUsersApi.updateRole(uuid, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => adminUsersApi.deleteUser(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}
