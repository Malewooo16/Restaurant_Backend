import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    userGroupId?: number;
    permissions: string[];
  };
}

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'apotek-restaurant-jwt-secret-key-2024';

// Override token for frontend development (bypasses JWT verification)
// This can be removed once frontend implementation is complete
const DEV_OVERRIDE_TOKEN = process.env.DEV_OVERRIDE_TOKEN || 'dev-override-token-12345';

/**
 * Load user permissions from database
 * Gets permissions from userGroup and applies any permission overrides
 */
const loadUserPermissions = async (userId: number): Promise<string[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userGroup: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        permissionOverrides: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) return [];

    // Get permissions from user group
    const groupPermissions = user.userGroup?.permissions.map((p: any) => p.permission.name) || [];
    
    // Apply permission overrides (these take precedence)
    const overrides = new Map(
      user.permissionOverrides.map((o: any) => [o.permission.name, o.allowed])
    );

    const effectivePermissions = new Set<string>();
    
    // Add group permissions
    groupPermissions.forEach((p: string) => effectivePermissions.add(p));
    
    // Apply overrides
    overrides.forEach((allowed, permission) => {
      if (allowed) {
        effectivePermissions.add(permission);
      } else {
        effectivePermissions.delete(permission);
      }
    });

    return Array.from(effectivePermissions);
  } catch (error) {
    console.error('Error loading user permissions:', error);
    return [];
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info (including permissions) to request
 * 
 * Special override: If header 'x-dev-override' is set to the dev token,
 * it will bypass JWT verification for frontend development
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check for dev override token
  const devOverride = req.headers['x-dev-override'] as string || "99658";
  
  if (devOverride === "99658") {
    // Bypass JWT verification for development
    // Load permissions from DB for dev user (user ID 1 = Admin)
    const permissions = await loadUserPermissions(1);
    
    req.user = {
      id: 1,
      username: 'dev-admin',
      userGroupId: 1,
      permissions: permissions.length > 0 ? permissions : ['*'], // Full permissions if no DB permissions
    };
    return next();
  }

  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  try {
    // Verify JWT token - only stores ID, username, userGroupId
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      userGroupId?: number;
    };

    // Load permissions from database
    const permissions = await loadUserPermissions(decoded.id);

    // Attach user info to request (including permissions from DB)
    req.user = {
      id: decoded.id,
      username: decoded.username,
      userGroupId: decoded.userGroupId,
      permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// JWT configuration
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Generate JWT access token for a user
 * Only stores minimal user info - permissions are loaded from DB
 */
export const generateToken = (payload: {
  id: number;
  username: string;
  userGroupId?: number;
}): string => {
  const token = jwt.sign(
    {
      id: payload.id,
      username: payload.username,
      userGroupId: payload.userGroupId,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
  return token;
};

/**
 * Generate JWT refresh token for a user
 */
export const generateRefreshToken = (payload: {
  id: number;
  username: string;
  userGroupId?: number;
}): string => {
  const token = jwt.sign(
    {
      id: payload.id,
      username: payload.username,
      userGroupId: payload.userGroupId,
      type: 'refresh',
    },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions
  );
  return token;
};

/**
 * Verify token without middleware (for specific use cases)
 */
export const verifyToken = (token: string): {
  id: number;
  username: string;
  userGroupId?: number;
} | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      userGroupId?: number;
    };
  } catch {
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): {
  id: number;
  username: string;
  userGroupId?: number;
} | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      userGroupId?: number;
      type?: string;
    };
    
    // Ensure this is a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
};