import { Request, Response } from 'express';
import * as userService from '../user/user.service';
import { generateToken, generateRefreshToken, verifyRefreshToken, verifyToken } from '../../middleware/auth';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by username
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled' });
    }

    // Verify password (compare plain text or hash)
    let isPasswordValid = false;
    if (user.passwordHash === password) {
      isPasswordValid = true;
    } else {
      // Try bcrypt comparison if password might be hashed
      try {
        isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      } catch {
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get effective permissions
    const permissions = await userService.getEffectivePermissions(user.id);

    // Generate access token and refresh token
    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      userGroupId: user.userGroupId || undefined,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
      userGroupId: user.userGroupId || undefined,
    });

    // Store refresh token in database
    await userService.storeRefreshToken(user.id, refreshToken);

    // Update last login
    await userService.updateLastLogin(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userGroupId: user.userGroupId,
        staffId: user.staffId,
      },
      permissions,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Verify the refresh token exists in database
    const isValid = await userService.validateRefreshToken(decoded.id, refreshToken);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Get user to ensure they're still active
    const user = await userService.getUserById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or disabled' });
    }

    // Get effective permissions
    const permissions = await userService.getEffectivePermissions(user.id);

    // Generate new access token
    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      userGroupId: user.userGroupId || undefined,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userGroupId: user.userGroupId,
        staffId: user.staffId,
      },
      permissions,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Error refreshing token', error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Get user from authenticated request (if logged in)
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;
      
      const decoded = verifyToken(token);
      
      if (decoded) {
        // Invalidate all refresh tokens for this user
        await userService.clearRefreshTokens(decoded.id);
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout', error });
  }
};