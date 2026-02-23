import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Permission types
 */
export type PermissionType = 
  | string // Simple permission string like "orders.view"
  | string[] // Multiple permissions - user needs ALL of them
  | { any: string[] }; // User needs ANY of these permissions

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasPermission: boolean;
  missingPermissions?: string[];
}

/**
 * Check if user has the required permission
 * Supports wildcard permissions (*)
 */
export const checkPermission = (
  userPermissions: string[],
  requiredPermission: PermissionType
): PermissionCheck => {
  // Wildcard permission grants everything
  if (userPermissions.includes('*')) {
    return { hasPermission: true };
  }

  // Handle string permission
  if (typeof requiredPermission === 'string') {
    const hasPermission = userPermissions.includes(requiredPermission) || 
      userPermissions.some(p => {
        // Support wildcards like "orders.*" or "*.view"
        if (p.endsWith('.*')) {
          const prefix = p.slice(0, -2);
          return requiredPermission.startsWith(prefix + '.');
        }
        if (p.startsWith('*.')) {
          const suffix = p.slice(2);
          return requiredPermission.endsWith('.' + suffix);
        }
        return false;
      });
    
    return {
      hasPermission,
      missingPermissions: hasPermission ? undefined : [requiredPermission],
    };
  }

  // Handle array of permissions (ALL must be present)
  if (Array.isArray(requiredPermission) && !('any' in requiredPermission)) {
    const missing = requiredPermission.filter(
      p => !userPermissions.includes(p) && 
           !userPermissions.some(up => {
             if (up.endsWith('.*')) {
               const prefix = up.slice(0, -2);
               return p.startsWith(prefix + '.');
             }
             return false;
           })
    );
    
    return {
      hasPermission: missing.length === 0,
      missingPermissions: missing.length > 0 ? missing : undefined,
    };
  }

  // Handle { any: string[] } - ANY must be present
  if (typeof requiredPermission === 'object' && 'any' in requiredPermission) {
    const anyPermissions = requiredPermission.any as string[];
    const hasAny = anyPermissions.some(
      (p: string) => userPermissions.includes(p) ||
           userPermissions.some(up => {
             if (up.endsWith('.*')) {
               const prefix = up.slice(0, -2);
               return p.startsWith(prefix + '.');
             }
             return false;
           })
    );
    
    return {
      hasPermission: hasAny,
      missingPermissions: hasAny ? undefined : anyPermissions,
    };
  }

  return { hasPermission: false };
};

/**
 * Permissions middleware factory
 * 
 * @param requiredPermissions - Permission(s) required to access the route
 * @param options - Configuration options
 * 
 * Usage:
 * // Single permission
 * router.get('/orders', authenticate, requirePermission('orders.view'), handler)
 * 
 * // Multiple permissions (ALL required)
 * router.get('/orders', authenticate, requirePermission(['orders.view', 'orders.create']), handler)
 * 
 * // Multiple permissions (ANY required)
 * router.get('/orders', authenticate, requirePermission({ any: ['admin', 'manager'] }), handler)
 */
export const requirePermission = (
  requiredPermissions: PermissionType,
  options: {
    /** Return 403 instead of 401 for missing permissions */
    useForbidden?: boolean;
  } = {}
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // If no user attached (shouldn't happen if authenticate middleware runs first)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    const check = checkPermission(userPermissions, requiredPermissions);

    if (!check.hasPermission) {
      const statusCode = options.useForbidden ? 403 : 403;
      return res.status(statusCode).json({
        message: 'Insufficient permissions',
        missingPermissions: check.missingPermissions,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is at least a manager
 * (has wildcard permission or manager-level access)
 */
export const requireManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const userPermissions = req.user.permissions || [];
  
  // Wildcard = full access
  if (userPermissions.includes('*')) {
    return next();
  }

  // Check for admin/manager permissions
  const hasManagerAccess = userPermissions.some(p => 
    p === 'admin' || 
    p === 'manager' || 
    p.startsWith('*.manage') ||
    p.endsWith('.manage')
  );

  if (!hasManagerAccess) {
    return res.status(403).json({ 
      message: 'Manager access required',
      missingPermissions: ['admin', 'manager'],
    });
  }

  next();
};

/**
 * Middleware to check if user is an admin
 * (has wildcard permission or admin-level access)
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const userPermissions = req.user.permissions || [];
  
  // Wildcard = full access
  if (userPermissions.includes('*')) {
    return next();
  }

  // Check for admin permissions
  const hasAdminAccess = userPermissions.includes('admin');

  if (!hasAdminAccess) {
    return res.status(403).json({ 
      message: 'Admin access required',
      missingPermissions: ['admin'],
    });
  }

  next();
};

/**
 * Optional permission check - doesn't block, just attaches permission info
 */
export const attachPermissions = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    // Attach permission check helper to request
    (req as any).hasPermission = (permission: PermissionType) => 
      checkPermission(req.user!.permissions || [], permission).hasPermission;
  }
  next();
};