import { useState } from 'react';
import type { Task } from '../types/task';
import {
  dotTone,
  groupByDate,
  MONTH_NAMES,
  monthGrid,
  WEEKDAYS,
} from '../utils/calendar';
import { toDateString } from '../utils/deadline';
import { Icon } from './Icon';

interface Props {
  tasks: Task[];
  onPick: (date: string) => void;
  onDetail: () => void;
}

/** Kalender ringkas untuk Beranda. Titik merah = mendesak, kuning = 7 hari ke depan. */
export function MiniCalendar({ tasks, onPick, onDetail }: Props) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const todayStr = toDateString(now);
  const byDate = groupByDate(tasks);

  function shift(delta: number) {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  }

  return (
    <div className="mini-cal">
      <div className="mini-cal-nav">
        <div className="month-pill">
          <button type="button" aria-label="Bulan sebelumnya" onClick={() => shift(-1)}>
            <Icon name="chevronLeft" size={18} />
          </button>
          <span aria-live="polite">
            {MONTH_NAMES[cursor.m]} {cursor.y}
          </span>
          <button type="button" aria-label="Bulan berikutnya" onClick={() => shift(1)}>
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
        <button type="button" className="soft-btn" onClick={onDetail}>
          Lihat Detail
        </button>
      </div>

      <div className="cal-grid cal-head" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {monthGrid(cursor.y, cursor.m).map((date) => {
          const key = toDateString(date);
          const outside = date.getMonth() !== cursor.m;
          const tone = dotTone(byDate.get(key) ?? [], now);
          return (
            <button
              key={key}
              type="button"
              className={`cal-day ${outside ? 'is-outside' : ''} ${key === todayStr ? 'is-today' : ''}`}
              aria-label={`${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`}
              aria-current={key === todayStr ? 'date' : undefined}
              onClick={() => onPick(key)}
            >
              <span>{date.getDate()}</span>
              {tone && !outside && <i className={`dot dot-${tone}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
