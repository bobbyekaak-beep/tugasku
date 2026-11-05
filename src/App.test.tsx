import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { TaskProvider } from './context/TaskContext';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AppProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe('Beranda', () => {
  it('menampilkan sapaan, 3 tugas mendatang, dan ringkasan 75%', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('heading', { name: 'Halo, Tyo Dzaky!' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Tandai selesai:/ })).toHaveLength(3);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('15 dari 20 tugas')).toBeInTheDocument();
  });

  it('menandai tugas selesai memperbarui ringkasan dan aktivitas', async () => {
    renderAt('/');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Tandai selesai: Basis Data Lanjut' }),
    );
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('16 dari 20 tugas')).toBeInTheDocument();
    expect(
      screen.getByText('Tugas “Basis Data Lanjut” ditandai selesai'),
    ).toBeInTheDocument();
  });

  it('Aksi Cepat Tambah Tugas menambah tugas lewat dialog', async () => {
    renderAt('/');
    await userEvent.click(await screen.findByRole('button', { name: 'Tambah Tugas' }));
    const dialog = screen.getByRole('dialog', { name: 'Tambah Tugas' });
    await userEvent.click(within(dialog).getByRole('button', { name: /Simpan Tugas/ }));
    expect(within(dialog).getByText('Nama tugas wajib diisi')).toBeInTheDocument();
    await userEvent.type(
      within(dialog).getByLabelText('Nama tugas'),
      'Laporan Praktikum',
    );
    await userEvent.click(within(dialog).getByRole('button', { name: /Simpan Tugas/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('15 dari 21 tugas')).toBeInTheDocument();
  });
});

describe('Halaman lain', () => {
  it('Tugas: filter Selesai hanya menampilkan tugas selesai', async () => {
    renderAt('/tugas');
    await userEvent.click(await screen.findByRole('tab', { name: /^Selesai/ }));
    expect(
      screen.getByText('Pengembangan Web', { selector: '.task-title' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Jaringan Komputer', { selector: '.task-title' }),
    ).not.toBeInTheDocument();
  });

  it('Tugas: menghapus tugas meminta konfirmasi', async () => {
    renderAt('/tugas');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Hapus Struktur Data' }),
    );
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }),
    );
    expect(
      screen.queryByRole('button', { name: 'Hapus Struktur Data' }),
    ).not.toBeInTheDocument();
  });

  it('Kalender menampilkan bulan berjalan', async () => {
    renderAt('/kalender');
    expect(
      await screen.findByRole('heading', { name: 'Kalender', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hari Ini' })).toBeInTheDocument();
  });

  it('Keluar mengarah ke halaman masuk, lalu bisa masuk lagi', async () => {
    renderAt('/');
    await userEvent.click(await screen.findByRole('button', { name: /Keluar/ }));
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Keluar' }),
    );
    expect(await screen.findByRole('button', { name: 'Masuk' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));
    expect(await screen.findByRole('heading', { name: /Halo,/ })).toBeInTheDocument();
  });

  it('alamat yang tidak dikenal menampilkan halaman not found', async () => {
    renderAt('/tidak-ada');
    expect(await screen.findByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });
});
