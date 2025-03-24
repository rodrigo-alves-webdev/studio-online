import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn.email(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
      navigate('/projects'); // Redireciona para a página de projetos após autenticação
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? 'Entrar' : 'Criar conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLogin ? 'Entrar' : 'Criar conta'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  await signIn.google();
                  navigate('/projects');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Ocorreu um erro com login Google');
                }
              }}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Google
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await signIn.facebook();
                  navigate('/projects');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Ocorreu um erro com login Facebook');
                }
              }}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}