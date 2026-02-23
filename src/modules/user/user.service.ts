import { prisma } from "../../../lib/prisma";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      staff: true,
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
    orderBy:{staff:{
      firstName:"asc"
    }}
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      staff: true,
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
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      staff: true,
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
};

export const createUser = async (data: { 
  username: string; 
  email?: string; 
  password: string; 
  staffId?: number; 
  userGroupId?: number;
}) => {
  // Simple password hashing - in production use bcrypt
  const passwordHash = data.password;
  
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      staffId: data.staffId,
      userGroupId: data.userGroupId,
    },
    include: {
      staff: true,
      userGroup: true,
    },
  });
};

export const updateUser = async (id: number, data: { 
  username?: string; 
  email?: string; 
  password?: string;
  staffId?: number | null; 
  userGroupId?: number | null;
  isActive?: boolean;
  permissionOverrides?: { permissionId: number; allowed: boolean }[];
}) => {
  const { permissionOverrides, password, ...userData } = data;

  let updateData: any = { ...userData };
  if (password) {
    updateData.passwordHash = password;
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  if (permissionOverrides) {
    await prisma.userPermissionOverride.deleteMany({
      where: { userId: id },
    });

    if (permissionOverrides.length > 0) {
      await prisma.userPermissionOverride.createMany({
        data: permissionOverrides.map(override => ({
          userId: id,
          permissionId: override.permissionId,
          allowed: override.allowed,
        })),
      });
    }
  }

  return getUserById(id);
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const changeUserPassword = async (id: number, newPassword: string) => {
  return prisma.user.update({
    where: { id },
    data: { passwordHash: newPassword },
  });
};

// Get effective permissions for a user (group + overrides)
export const getEffectivePermissions = async (userId: number) => {
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

  const groupPermissions = user.userGroup?.permissions.map((p: any) => p.permission.name) || [];
  const overrides = new Map(
    user.permissionOverrides.map((o: any) => [o.permission.name, o.allowed])
  );

  const effectivePermissions = new Set<string>();
  
  groupPermissions.forEach((p: string) => effectivePermissions.add(p));
  
  overrides.forEach((allowed, permission) => {
    if (allowed) {
      effectivePermissions.add(permission);
    } else {
      effectivePermissions.delete(permission);
    }
  });

  return Array.from(effectivePermissions);
};

// Update a single user's permission override
export const updateUserPermission = async (userId: number, permissionId: number, allowed: boolean) => {
  // Check if an override already exists
  const existingOverride = await prisma.userPermissionOverride.findFirst({
    where: {
      userId,
      permissionId,
    },
  });

  if (existingOverride) {
    // Update existing override
    return prisma.userPermissionOverride.update({
      where: { id: existingOverride.id },
      data: { allowed },
    });
  } else {
    // Create new override
    return prisma.userPermissionOverride.create({
      data: {
        userId,
        permissionId,
        allowed,
      },
    });
  }
};

/**
 * Store refresh token for a user
 */
export const storeRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

/**
 * Validate refresh token for a user
 */
export const validateRefreshToken = async (userId: number, refreshToken: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { refreshToken: true },
  });
  
  return user?.refreshToken === refreshToken;
};

/**
 * Clear all refresh tokens for a user (logout)
 */
export const clearRefreshTokens = async (userId: number): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

// Update user's last login timestamp
export const updateLastLogin = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
};