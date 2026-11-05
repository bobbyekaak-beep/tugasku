import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import { daysLeft } from '../utils/deadline';

export function ProfilePage() {
  const { profile, updateProfile } = useApp();
  const { tasks } = useTasks();
  const { toast } = useUI();
  const [form, setForm] = useState(profile);
  const [error, setError] = useState('');

  const done = tasks.filter((t) => t.done).length;
  const late = tasks.filter((t) => !t.done && daysLeft(t.dueDate) < 0).length;
  const stats = [
    { label: 'Total tugas', value: tasks.length },
    { label: 'Selesai', value: done },
    { label: 'Belum selesai', value: tasks.length - done },
    { label: 'Terlambat', value: late },
  ];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.displayName.trim()) return setError('Nama panggilan wajib diisi');
    setError('');
    updateProfile({
      ...form,
      displayName: form.displayName.trim(),
      fullName: form.fullName.trim(),
    });
    toast('Profil disimpan');
  }

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Profil</h1>
          <p className="page-sub">Data dirimu yang tampil di TugasKu.</p>
        </div>
      </div>

      <div className="profile-layout">
        <section className="glass card profile-card">
          <span className="avatar avatar-xl">
            <Icon name="user" size={44} />
          </span>
          <h2>{profile.fullName || profile.displayName}</h2>
          <p className="caption">{profile.nim ? `NIM ${profile.nim}` : 'Mahasiswa'}</p>
          <dl className="stat-grid">
            {stats.map((s) => (
              <div key={s.label}>
                <dd>{s.value}</dd>
                <dt>{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="glass card">
          <h2 className="h-small">Ubah Profil</h2>
          <form className="form" onSubmit={submit} noValidate>
            <FormField
              id="displayName"
              label="Nama panggilan"
              requirement="wajib"
              value={form.displayName}
              onChange={set('displayName')}
              error={error}
              helper="Dipakai pada sapaan di Beranda."
            />
            <FormField
              id="fullName"
              label="Nama lengkap"
              value={form.fullName}
              onChange={set('fullName')}
            />
            <div className="form-row">
              <FormField
                id="nim"
                label="NIM"
                value={form.nim}
                onChange={set('nim')}
                inputMode="numeric"
              />
              <FormField
                id="campus"
                label="Kampus"
                requirement="opsional"
                value={form.campus}
                onChange={set('campus')}
              />
            </div>
            <FormField
              id="email"
              type="email"
              label="Email"
              requirement="opsional"
              value={form.email}
              onChange={set('email')}
            />
            <div className="form-actions">
              <Button type="submit">
                <Icon name="check" size={18} /> Simpan Profil
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
