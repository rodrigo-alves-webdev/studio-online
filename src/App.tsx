import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { AuthModal } from './components/auth/AuthModal';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './lib/auth';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Music className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Studio
                    </a>
                    <a href="/projects" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Meus Projetos
                    </a>
                    <a href="/community" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Comunidade
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300">{profile?.name}</span>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Entrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-8">Web Music Studio</h1>
                <p className="text-gray-300 mb-8">Crie, colabore e produza música no seu navegador</p>
                {user ? (
                  <button 
                    onClick={() => navigate('/projects')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Meus Projetos
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Começar Agora
                  </button>
                )}
              </div>
            } />
            <Route 
              path="/projects" 
              element={user ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/studio/:id" 
              element={user ? <div>Studio (em breve)</div> : <Navigate to="/" />} 
            />
          </Routes>
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;