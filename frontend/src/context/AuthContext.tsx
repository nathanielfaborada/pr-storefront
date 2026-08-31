import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'shopper' | 'admin';
export type AuthProviderType = 'google' | 'facebook' | 'admin' | 'guest';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  provider: AuthProviderType;
  verifiedAt: string;
}

// Whitelisted Admin Emails & Accounts
export const ADMIN_WHITELIST_EMAILS = [
  'nathaniel.faborada@gmail.com',
  'nathaniel.fb@facebook.com',
  'vault@pr-streetwear.com',
  'admin@pr-streetwear.com',
  'faborada@gmail.com',
];

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (customData?: Partial<UserSession>) => Promise<UserSession>;
  loginWithFacebook: (customData?: Partial<UserSession>) => Promise<UserSession>;
  loginAdminWithGoogle: () => Promise<UserSession>;
  loginAdminWithFacebook: () => Promise<UserSession>;
  loginAsAdmin: (passcode: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('pr_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pr_auth_session', JSON.stringify(user));
      localStorage.setItem('pr_auth_token', `token_${user.id}_${user.provider}_${user.role}`);
    } else {
      localStorage.removeItem('pr_auth_session');
      localStorage.removeItem('pr_auth_token');
    }
  }, [user]);

  // Google OAuth Handler (Auto-detects admin role if whitelisted)
  const loginWithGoogle = async (customData?: Partial<UserSession>): Promise<UserSession> => {
    const email = customData?.email || 'nathaniel.faborada@gmail.com';
    const isWhitelisted = ADMIN_WHITELIST_EMAILS.includes(email.toLowerCase());

    const googleSession: UserSession = {
      id: customData?.id || `G-${Math.floor(100000 + Math.random() * 900000)}`,
      name: customData?.name || 'Nathaniel Faborada',
      email,
      avatarUrl: customData?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: isWhitelisted ? 'admin' : 'shopper',
      provider: 'google',
      verifiedAt: new Date().toISOString(),
    };

    setUser(googleSession);
    setIsAuthModalOpen(false);
    return googleSession;
  };

  // Facebook OAuth Handler (Auto-detects admin role if whitelisted)
  const loginWithFacebook = async (customData?: Partial<UserSession>): Promise<UserSession> => {
    const email = customData?.email || 'nathaniel.fb@facebook.com';
    const isWhitelisted = ADMIN_WHITELIST_EMAILS.includes(email.toLowerCase());

    const fbSession: UserSession = {
      id: customData?.id || `FB-${Math.floor(100000 + Math.random() * 900000)}`,
      name: customData?.name || 'Nathaniel Faborada',
      email,
      avatarUrl: customData?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: isWhitelisted ? 'admin' : 'shopper',
      provider: 'facebook',
      verifiedAt: new Date().toISOString(),
    };

    setUser(fbSession);
    setIsAuthModalOpen(false);
    return fbSession;
  };

  // Dedicated Admin Google OAuth
  const loginAdminWithGoogle = async (): Promise<UserSession> => {
    const adminSession: UserSession = {
      id: `G-ADMIN-01`,
      name: 'Nathaniel Faborada (Curator)',
      email: 'nathaniel.faborada@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      provider: 'google',
      verifiedAt: new Date().toISOString(),
    };

    setUser(adminSession);
    setIsAuthModalOpen(false);
    return adminSession;
  };

  // Dedicated Admin Facebook OAuth
  const loginAdminWithFacebook = async (): Promise<UserSession> => {
    const adminSession: UserSession = {
      id: `FB-ADMIN-01`,
      name: 'Nathaniel Faborada (Curator)',
      email: 'nathaniel.fb@facebook.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      provider: 'facebook',
      verifiedAt: new Date().toISOString(),
    };

    setUser(adminSession);
    setIsAuthModalOpen(false);
    return adminSession;
  };

  // Legacy Passcode Admin Login
  const loginAsAdmin = (passcode: string): boolean => {
    if (passcode === 'admin123' || passcode === 'pr2026') {
      const adminSession: UserSession = {
        id: 'ADMIN-001',
        name: 'P&R Vault Curator',
        email: 'vault@pr-streetwear.com',
        role: 'admin',
        provider: 'admin',
        verifiedAt: new Date().toISOString(),
      };
      setUser(adminSession);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginWithFacebook,
        loginAdminWithGoogle,
        loginAdminWithFacebook,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
