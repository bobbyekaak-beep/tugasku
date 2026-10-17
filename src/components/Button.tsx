import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '../utils/classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  /** Tampilan tombol. Bawaan: primary. */
  variant?: ButtonVariant;
  /** Ukuran tombol. Bawaan: md. */
  size?: ButtonSize;
  /** Tombol selebar wadahnya. Bawaan: false. */
  fullWidth?: boolean;
  children: ReactNode;
}

/** Tombol biasa (aksi). Mendukung state loading dan disabled. */
type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** Saat true, teks diganti "Memproses..." dan tombol tidak bisa ditekan. */
    loading?: boolean;
    to?: undefined;
  };

/** Tombol sebagai tautan antarlayar. Tidak mendukung loading dan disabled. */
type ButtonAsLink = CommonProps & Omit<LinkProps, 'children'> & { to: LinkProps['to'] };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string,
  loading?: boolean,
) {
  return cx(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'is-loading',
    extra,
  );
}

export function Button(props: ButtonProps) {
  if (props.to !== undefined) {
    const {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className,
      children,
      ...linkProps
    } = props;
    return (
      <Link {...linkProps} className={buttonClass(variant, size, fullWidth, className)}>
        {children}
      </Link>
    );
  }

  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    type = 'button',
    disabled = false,
    className,
    children,
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      type={type}
      className={buttonClass(variant, size, fullWidth, className, loading)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? 'Memproses...' : children}
    </button>
  );
}
