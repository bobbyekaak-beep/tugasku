import { getDeadlineStatus } from './deadline';

const today = new Date(2026, 9, 2, 23, 30); // 2 Okt 2026, malam hari

describe('getDeadlineStatus', () => {
  it('tenggat hari yang sama dihitung 0 hari', () => {
    expect(getDeadlineStatus('2026-10-02', false, today)).toEqual({
      label: 'Hari ini',
      tone: 'urgent',
    });
  });

  it('besok dan 3 hari berwarna merah', () => {
    expect(getDeadlineStatus('2026-10-03', false, today).label).toBe('Besok');
    expect(getDeadlineStatus('2026-10-05', false, today)).toEqual({
      label: '3 hari',
      tone: 'urgent',
    });
  });

  it('4 sampai 7 hari berwarna kuning', () => {
    expect(getDeadlineStatus('2026-10-08', false, today).tone).toBe('soon');
  });

  it('lebih dari 7 hari berwarna abu-abu', () => {
    expect(getDeadlineStatus('2026-10-14', false, today)).toEqual({
      label: '12 hari',
      tone: 'normal',
    });
    expect(getDeadlineStatus('2027-01-01', false, today).label).toBe('30+ hari');
  });

  it('melewati tenggat berstatus terlambat', () => {
    expect(getDeadlineStatus('2026-10-01', false, today).label).toBe('Terlambat');
  });

  it('tugas selesai berwarna hijau', () => {
    expect(getDeadlineStatus('2026-10-01', true, today)).toEqual({
      label: 'Selesai',
      tone: 'done',
    });
  });
});
