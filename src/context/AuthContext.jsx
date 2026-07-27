import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ADMIN } from '../data/mockData';
import { COLLECTIONS, saveItemToFirestore } from '../services/firebaseService';

const AuthContext = createContext(null);

export { DEFAULT_ADMIN };

export const AuthProvider = ({ children }) => {
  // Active Logged-in User
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kirana_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Registered Customer Accounts List
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('kirana_registered_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'admin-login'
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Admin'

  useEffect(() => {
    if (user) {
      localStorage.setItem('kirana_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kirana_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kirana_registered_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Admin Login Handler
  const loginAdmin = (adminId, password) => {
    const cleanId = String(adminId || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    if (
      (cleanId === 'admin@kirana' || cleanId === 'admin' || cleanId === 'admin@kirana.com') &&
      (cleanPass === 'admin@1234kirana' || cleanPass === '1234' || cleanPass === 'admin')
    ) {
      const adminUser = {
        ...DEFAULT_ADMIN,
        email: cleanId
      };
      setUser(adminUser);
      return { success: true, user: adminUser, message: 'Welcome Admin! Logged in successfully.' };
    }

    return {
      success: false,
      message: 'Invalid Admin credentials! Use Username: admin@kirana & Password: admin@1234kirana'
    };
  };

  // Customer Login Handler
  const loginCustomer = (identifier, password) => {
    const cleanId = String(identifier || '').trim().toLowerCase();

    // Check in registered accounts
    const found = accounts.find(
      (a) =>
        (a.phone && a.phone.toLowerCase() === cleanId) ||
        (a.email && a.email.toLowerCase() === cleanId) ||
        (a.name && a.name.toLowerCase() === cleanId)
    );

    if (found) {
      if (found.password && password && found.password !== password) {
        return { success: false, message: 'Incorrect Password! Please try again.' };
      }
      setUser(found);
      return { success: true, user: found, message: `Welcome back, ${found.name}!` };
    }

    // Direct Login / Registration for entered phone or email
    const newCustomerName = identifier.includes('@') ? identifier.split('@')[0] : 'Customer (' + identifier.slice(-4) + ')';
    const newCustomer = {
      id: 'usr_' + Date.now(),
      name: newCustomerName,
      phone: identifier,
      email: identifier.includes('@') ? identifier : '',
      location: '',
      role: 'Customer'
    };

    setAccounts((prev) => [newCustomer, ...prev]);
    setUser(newCustomer);
    saveItemToFirestore(COLLECTIONS.CUSTOMERS, newCustomer);

    return { success: true, user: newCustomer, message: `Logged in as ${newCustomer.name}` };
  };

  // Customer Sign Up Handler
  const signupCustomer = (name, phone, email, location, password) => {
    const existing = accounts.find((a) => a.phone === phone || (email && a.email === email));
    if (existing) {
      const updatedUser = {
        ...existing,
        name,
        location: location || existing.location
      };
      setUser(updatedUser);
      saveItemToFirestore(COLLECTIONS.CUSTOMERS, updatedUser);
      return { success: true, user: updatedUser, message: `Welcome back, ${name}!` };
    }

    const newAccount = {
      id: 'usr_' + Date.now(),
      name,
      phone,
      email: email || '',
      location: location || '',
      password: password || '123456',
      role: 'Customer'
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setUser(newAccount);
    saveItemToFirestore(COLLECTIONS.CUSTOMERS, newAccount);

    return { success: true, user: newAccount, message: `Account created successfully! Welcome ${name}.` };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (user.role === 'Customer') {
      saveItemToFirestore(COLLECTIONS.CUSTOMERS, updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'Guest',
        isAdmin: user?.role === 'Admin',
        isCustomer: user?.role === 'Customer',
        loginAdmin,
        loginCustomer,
        signupCustomer,
        logout,
        updateProfile,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        selectedRole,
        setSelectedRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
