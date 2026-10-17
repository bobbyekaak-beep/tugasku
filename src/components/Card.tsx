import type { ReactNode } from 'react';
import { cx } from '../utils/classNames';

interface CardProps {
  /** Elemen HTML pembungkus. Bawaan: section. Pakai li bila kartu ada di dalam daftar. */
  as?: 'section' | 'article' | 'div' | 'li';
  /** Judul kartu (opsional). */
  title?: string;
  /** Bagian bawah kartu, misalnya tombol aksi (opsional). */
  footer?: ReactNode;
  /** Kelas tambahan untuk penyesuaian tata letak isi. */
  className?: string;
  children: ReactNode;
}

/** Pembungkus isi dengan latar putih, garis tepi, dan sudut membulat sesuai style guide. */
export function Card({
  as: Tag = 'section',
  title,
  footer,
  className,
  children,
}: CardProps) {
  return (
    <Tag className={cx('card', className)}>
      {title ? <h3 className="card-title">{title}</h3> : null}
      <div className="card-body">{children}</div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </Tag>
  );
}
