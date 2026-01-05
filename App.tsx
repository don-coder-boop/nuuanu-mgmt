
import React, { useState, useEffect } from 'react';
import { Collection, AccessCodeConfig } from './types';
import { INITIAL_COLLECTIONS } from './constants';
import Login from './pages/Login';
import InfluencerPage from './pages/InfluencerPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('seeding_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [adminConfig, setAdminConfig] = useState(() => {
    const saved = localStorage.getItem('seeding_admin_config');
    return saved ? JSON.parse(saved) : { password: 'ADMIN', recoveryPhrase: 'nuuanu' };
  });

  const [session, setSession] = useState<{
    role: 'admin' | 'influencer';
    collectionId?: string;
    accessCode?: string;
    limit?: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('seeding_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('seeding_admin_config', JSON.stringify(adminConfig));
  }, [adminConfig]);

  const handleLogin = (code: string) => {
    const normalizedInput = code.trim();
    
    if (normalizedInput.toUpperCase() === adminConfig.password.toUpperCase()) {
      setSession({ role: 'admin' });
      return true;
    }

    const upperInput = normalizedInput.toUpperCase();
    for (const col of collections) {
      const match = col.accessCodes.find(c => c.code.toUpperCase() === upperInput);
      if (match) {
        setSession({
          role: 'influencer',
          collectionId: col.id,
          accessCode: match.code,
          limit: match.limit
        });
        return true;
      }
    }
    return false;
  };

  const handleResetPassword = (phrase: string) => {
    if (phrase.trim().toLowerCase() === adminConfig.recoveryPhrase.toLowerCase()) {
      setAdminConfig({ ...adminConfig, password: 'ADMIN' });
      return true;
    }
    return false;
  };

  const handleLogout = () => setSession(null);

  const updateCollection = (updated: Collection) => {
    setCollections(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const addCollection = (newCol: Collection) => {
    setCollections(prev => [...prev, newCol]);
  };

  if (!session) {
    return <Login onLogin={handleLogin} onReset={handleResetPassword} />;
  }

  if (session.role === 'admin') {
    return (
      <AdminDashboard 
        collections={collections} 
        adminConfig={adminConfig}
        onUpdateAdminConfig={setAdminConfig}
        onUpdateCollection={updateCollection}
        onAddCollection={addCollection}
        onLogout={handleLogout}
      />
    );
  }

  const currentCollection = collections.find(c => c.id === session.collectionId);
  if (!currentCollection) {
    handleLogout();
    return null;
  }

  return (
    <InfluencerPage 
      collection={currentCollection} 
      limit={session.limit || 0}
      onLogout={handleLogout}
      onOrderSubmit={(orders) => {
        const updatedCollection = {
          ...currentCollection,
          orders: [...currentCollection.orders, ...orders]
        };
        updateCollection(updatedCollection);
      }}
    />
  );
};

export default App;
