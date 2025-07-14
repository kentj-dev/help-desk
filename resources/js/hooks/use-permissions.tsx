import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const permissionActions = ['can_view', 'can_create', 'can_update', 'can_delete', 'can_export', 'can_print', 'can_assign'];

export function usePermissions() {
    const { auth } = usePage<SharedData>().props;

    const permissions = auth.permissions ?? {};
    const isSuperAdmin = auth.is_super_admin;

    const hasPermission = (paths: string | string[], action: string): boolean => {
        if (isSuperAdmin) return true;

        const pathList = Array.isArray(paths) ? paths : [paths];

        return pathList.some((path) => Array.isArray(permissions[path]) && permissions[path].includes(action));
    };

    const canView = (paths: string | string[]) => hasPermission(paths, 'can_view');
    const canCreate = (paths: string | string[]) => hasPermission(paths, 'can_create');
    const canUpdate = (paths: string | string[]) => hasPermission(paths, 'can_update');
    const canDelete = (paths: string | string[]) => hasPermission(paths, 'can_delete');
    const canExport = (paths: string | string[]) => hasPermission(paths, 'can_export');
    const canPrint = (paths: string | string[]) => hasPermission(paths, 'can_print');
    const canAssign = (paths: string | string[]) => hasPermission(paths, 'can_assign');

    return {
        hasPermission,
        canView,
        canCreate,
        canUpdate,
        canDelete,
        canExport,
        canPrint,
        canAssign,
    };
}
