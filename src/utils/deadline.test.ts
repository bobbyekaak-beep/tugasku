import { getDeadlineStatus } from './deadline';

const today = new Date(2026, 10, 4, 23, 30); // 4 Nov 2026, malam hari

describe('getDeadlineStatus', () => {
  it('hari ini dan besok berstatus Mendesak', () => {
    expect(getDeadlineStatus('2026-11-04', false, today)).toEqual({
      label: 'Mendesak!',
      tone: 'urgent',
    });
    expect(getDeadlineStatus('2026-11-05', false, today)).toEqual({
      label: 'Mendesak!',
      tone: 'urgent',
    });
  });

  it('2 sampai 6 hari berlabel "N hari lagi" berwarna kuning', () => {
    expect(getDeadlineStatus('2026-11-07', false, today)).toEqual({
      label: '3 hari lagi',
      tone: 'soon',
    });
    expect(getDeadlineStatus('2026-11-10', false, today).tone).toBe('soon');
  });

  it('7 hari ke atas berlabel minggu atau bulan berwarna biru', () => {
    expect(getDeadlineStatus('2026-11-11', false, today)).toEqual({
      label: '1 minggu lagi',
      tone: 'normal',
    });
    expect(getDeadlineStatus('2027-01-10', false, today).label).toBe('2 bulan lagi');
  });

  it('melewati tenggat berstatus terlambat', () => {
    expect(getDeadlineStatus('2026-11-03', false, today).label).toBe('Terlambat');
  });

  it('tugas selesai berwarna hijau', () => {
    expect(getDeadlineStatus('2026-11-01', true, today)).toEqual({
      label: 'Selesai',
      tone: 'done',
    });
  });
});
