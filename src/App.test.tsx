import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { TaskProvider } from './context/TaskContext';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TaskProvider>
        <App />
      </TaskProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('Beranda menampilkan bagian prioritas lebih dulu, lalu tugas lainnya', () => {
    renderAt('/');
    const priority = screen.getByText('Prioritas Mendekati Tenggat');
    const others = screen.getByText('Daftar Tugas Lainnya');
    expect(priority.compareDocumentPosition(others)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByRole('link', { name: /Tambah Tugas/ })).toBeInTheDocument();
  });

  it('menandai tugas selesai mengubah badge menjadi Selesai', async () => {
    renderAt('/');
    expect(screen.getAllByText('Selesai')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: /Tandai selesai: Agama/ }));
    expect(screen.getAllByText('Selesai')).toHaveLength(2);
  });

  it('form menolak nama tugas kosong', async () => {
    renderAt('/tambah');
    await userEvent.click(await screen.findByRole('button', { name: /Simpan Tugas/ }));
    expect(screen.getByText('Nama tugas wajib diisi')).toBeInTheDocument();
  });

  it('alamat yang tidak dikenal menampilkan halaman not found', async () => {
    renderAt('/tidak-ada');
    expect(await screen.findByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });
});
