import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { Icon } from './Icon';
import { cx } from '../utils/classNames';

interface BaseProps {
  /** Wajib. Dipakai untuk menghubungkan label dengan kolom isian. */
  id: string;
  /** Wajib. Teks label di atas kolom. */
  label: string;
  /** Penanda di kanan label: Wajib atau Opsional. */
  requirement?: 'wajib' | 'opsional';
  /** Petunjuk di bawah kolom. Tidak tampil bila ada error. */
  helper?: ReactNode;
  /** Pesan kesalahan. Bila ada, kolom diberi garis merah. */
  error?: string;
}

type InputField = BaseProps & { control?: 'input' } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id'
  >;

type TextareaField = BaseProps & { control: 'textarea' } & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'id'
  >;

export interface SelectOption {
  value: string;
  label: string;
}

type SelectField = BaseProps & {
  control: 'select';
  options: SelectOption[];
  /** Teks pilihan pertama yang bernilai kosong. */
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>;

/** Untuk kontrol buatan sendiri (misalnya kolom tanggal). Isinya dikelola oleh pemakai. */
type CustomField = BaseProps & { control: 'custom'; children: ReactNode };

export type FormFieldProps = InputField | TextareaField | SelectField | CustomField;

const OWN_KEYS = ['control', 'id', 'label', 'requirement', 'helper', 'error'] as const;

function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const copy = { ...obj };
  for (const key of keys) Reflect.deleteProperty(copy, key as PropertyKey);
  return copy;
}

export function FormField(props: FormFieldProps) {
  const { id, label, requirement, helper, error } = props;
  const messageId = `${id}-message`;
  const aria = {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || helper ? messageId : undefined,
  };

  let control: ReactNode;
  if (props.control === 'custom') {
    control = props.children;
  } else if (props.control === 'textarea') {
    const rest = omit(props, OWN_KEYS);
    control = (
      <textarea
        {...rest}
        id={id}
        {...aria}
        className={cx('input', error && 'has-error', rest.className)}
      />
    );
  } else if (props.control === 'select') {
    const { options, placeholder, ...rest } = omit(props, OWN_KEYS);
    control = (
      <div className="select-wrap">
        <select
          {...rest}
          id={id}
          {...aria}
          className={cx('input', error && 'has-error', rest.className)}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" />
      </div>
    );
  } else {
    const rest = omit(props, OWN_KEYS);
    control = (
      <input
        {...rest}
        id={id}
        {...aria}
        className={cx('input', error && 'has-error', rest.className)}
      />
    );
  }

  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        {requirement && (
          <span className="caption">
            {requirement === 'wajib' ? 'Wajib' : 'Opsional'}
          </span>
        )}
      </div>
      {control}
      {error ? (
        <p id={messageId} className="error">
          <Icon name="alertCircle" size={16} /> {error}
        </p>
      ) : helper ? (
        <p id={messageId} className="hint caption">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
