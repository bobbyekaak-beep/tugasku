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

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('App', () => {
  it('Beranda menampilkan bagian prioritas lebih dulu, lalu tugas lainnya', async () => {
    renderAt('/');
    const priority = await screen.findByText('Prioritas Mendekati Tenggat');
    const others = screen.getByText('Daftar Tugas Lainnya');
    expect(priority.compareDocumentPosition(others)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByRole('link', { name: /Tambah Tugas/ })).toBeInTheDocument();
  });

  it('menandai tugas selesai mengubah badge dan tetap tersimpan setelah dimuat ulang', async () => {
    const first = renderAt('/');
    expect(await screen.findAllByText('Selesai')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: /Tandai selesai: Agama/ }));
    expect(screen.getAllByText('Selesai')).toHaveLength(2);
    first.unmount();

    renderAt('/');
    expect(await screen.findAllByText('Selesai')).toHaveLength(2);
  });

  it('form menolak nama kosong, nama hanya spasi, dan nama terlalu panjang', async () => {
    renderAt('/tambah');
    const save = await screen.findByRole('button', { name: /Simpan Tugas/ });
    await userEvent.click(save);
    expect(screen.getByText('Nama tugas wajib diisi')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Nama tugas/), '   ');
    await userEvent.click(save);
    expect(screen.getByText('Nama tugas wajib diisi')).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText(/Nama tugas/));
    await userEvent.type(screen.getByLabelText(/Nama tugas/), 'a'.repeat(81));
    await userEvent.click(save);
    expect(screen.getByText('Nama tugas maksimal 80 karakter')).toBeInTheDocument();
  });

  it('tambah tugas: simpan, pesan berhasil, muncul di Beranda, dan bertahan setelah dimuat ulang', async () => {
    const first = renderAt('/tambah');
    await userEvent.type(await screen.findByLabelText(/Nama tugas/), 'Laporan Praktikum');
    await userEvent.click(screen.getByRole('button', { name: /Simpan Tugas/ }));

    expect(
      await screen.findByText('Tugas "Laporan Praktikum" berhasil disimpan'),
    ).toBeInTheDocument();
    expect(screen.getByText('Laporan Praktikum')).toBeInTheDocument();
    first.unmount();

    renderAt('/');
    expect(await screen.findByText('Laporan Praktikum')).toBeInTheDocument();
  });

  it('gagal menyimpan menampilkan pesan dan isian tidak hilang', async () => {
    renderAt('/tambah');
    await userEvent.type(await screen.findByLabelText(/Nama tugas/), 'Laporan Praktikum');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('penuh');
    });
    await userEvent.click(screen.getByRole('button', { name: /Simpan Tugas/ }));

    expect(
      await screen.findByText('Tugas gagal disimpan. Coba lagi.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nama tugas/)).toHaveValue('Laporan Praktikum');
  });

  it('alamat yang tidak dikenal menampilkan halaman not found', async () => {
    renderAt('/tidak-ada');
    expect(await screen.findByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });

  it('alamat ubah dengan id yang tidak ada menampilkan halaman not found', async () => {
    renderAt('/ubah/tidak-ada');
    expect(await screen.findByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });

  it('ubah tugas: isian terisi, perubahan tersimpan, dan muncul pesan', async () => {
    renderAt('/');
    await userEvent.click(await screen.findByRole('link', { name: /Agama/ }));
    const title = await screen.findByLabelText(/Nama tugas/);
    expect(title).toHaveValue('Agama');
    await userEvent.clear(title);
    await userEvent.type(title, 'Agama Islam');
    await userEvent.click(screen.getByRole('button', { name: /Simpan Perubahan/ }));

    expect(
      await screen.findByText('Perubahan tugas "Agama Islam" disimpan'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Agama Islam', { selector: '.task-title' }),
    ).toBeInTheDocument();
  });

  it('gagal menyimpan status selesai menampilkan pesan dan status tidak berubah', async () => {
    renderAt('/');
    expect(await screen.findAllByText('Selesai')).toHaveLength(1);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('penuh');
    });
    await userEvent.click(screen.getByRole('button', { name: /Tandai selesai: Agama/ }));

    expect(
      await screen.findByText('Status tugas gagal disimpan. Coba lagi.'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Selesai')).toHaveLength(1);
  });
});
