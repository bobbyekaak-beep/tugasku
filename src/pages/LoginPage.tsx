import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { LogoMark } from '../components/Illustrations';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { profile, loggedIn, login } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(profile.displayName);
  const [error, setError] = useState('');

  if (loggedIn) return <Navigate to="/" replace />;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Nama wajib diisi');
    login(name);
    navigate('/', { replace: true });
  }

  return (
    <div className="login-wrap">
      <form className="glass login-card" onSubmit={submit} noValidate>
        <LogoMark size={64} />
        <h1>TugasKu</h1>
        <p className="page-sub">Masuk untuk melihat tugas kuliahmu.</p>
        <FormField
          id="login-name"
          label="Nama panggilan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          autoComplete="nickname"
        />
        <Button type="submit" fullWidth size="lg">
          Masuk
        </Button>
      </form>
    </div>
  );
}
