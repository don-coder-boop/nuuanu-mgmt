
import React, { useState } from 'react';

interface Props {
  onLogin: (code: string) => boolean;
  onReset: (phrase: string) => boolean;
}

const Login: React.FC<Props> = ({ onLogin, onReset }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(code)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReset(recoveryPhrase)) {
      setRecoveryMsg('Password reset to ADMIN. Please login.');
      setTimeout(() => {
        setIsRecovery(false);
        setRecoveryMsg('');
      }, 3000);
    } else {
      setRecoveryMsg('Incorrect recovery phrase.');
    }
  };

  if (isRecovery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center space-y-8">
          <h1 className="text-xl font-light tracking-[0.2em] uppercase italic">Recover Admin Access</h1>
          <form onSubmit={handleRecovery} className="space-y-6">
            <input
              type="text"
              placeholder="ENTER RECOVERY PHRASE"
              value={recoveryPhrase}
              onChange={(e) => setRecoveryPhrase(e.target.value)}
              className="w-full border-b border-gray-300 py-2 text-center focus:outline-none focus:border-black transition-colors uppercase tracking-widest text-sm"
            />
            {recoveryMsg && <p className="text-[10px] uppercase tracking-widest text-black">{recoveryMsg}</p>}
            <button type="submit" className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] font-medium uppercase">Reset Password</button>
            <button type="button" onClick={() => setIsRecovery(false)} className="text-[10px] uppercase tracking-widest text-gray-400">Back to Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-light tracking-[0.2em] mb-12 uppercase italic">nuuanu</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="ACCESS CODE"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border-b border-gray-300 py-2 text-center focus:outline-none focus:border-black transition-colors uppercase tracking-widest text-sm"
            />
            {error && (
              <p className="text-red-500 text-[10px] mt-2 tracking-wide uppercase">Invalid access code</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] font-medium hover:bg-zinc-800 transition-colors uppercase"
          >
            Enter
          </button>
        </form>
        <button 
          onClick={() => setIsRecovery(true)}
          className="mt-8 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Forgot admin password?
        </button>
      </div>
    </div>
  );
};

export default Login;
