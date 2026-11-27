import ToggleChip from './ToggleChip.jsx';

function LabelText({ label, required, optional, extra }) {
  return (
    <>
      {label}
      {required ? (
        <span className="field__req" aria-hidden="true">
          {' '}*
        </span>
      ) : null}
      {optional ? <span className="field__opt"> (optional)</span> : null}
      {extra ? <span className="field__opt"> {extra}</span> : null}
    </>
  );
}

const optionValue = (o) => (typeof o === 'string' ? o : o.value);
const optionLabel = (o) => (typeof o === 'string' ? o : o.label);

/** Text input, or a textarea when multiline is set. onChange receives the new value. */
export function TextField({
  id,
  label,
  value,
  onChange,
  required,
  optional,
  hint,
  type = 'text',
  placeholder,
  multiline = false,
  rows = 3,
  minLength,
  maxLength,
  autoComplete,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const props = {
    id,
    name: id,
    className: 'control',
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    placeholder,
    minLength,
    maxLength,
    autoComplete,
    'aria-required': required || undefined,
    'aria-describedby': hintId,
  };
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        <LabelText label={label} required={required} optional={optional} />
      </label>
      {multiline ? <textarea rows={rows} {...props} /> : <input type={type} {...props} />}
      {hint ? (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** Drop-down. options: strings or { value, label }. */
export function SelectField({ id, label, value, onChange, options, placeholder, required, optional, hint }) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        <LabelText label={label} required={required} optional={optional} />
      </label>
      <select
        id={id}
        name={id}
        className="control"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-describedby={hintId}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={optionValue(o)} value={optionValue(o)}>
            {optionLabel(o)}
          </option>
        ))}
      </select>
      {hint ? (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A group of pill buttons. Single choice by default (value is a string);
 * set multiple for several choices (value is an array), optionally capped by max.
 */
export function ChipField({ legend, options, value, onChange, multiple = false, max, required, optional }) {
  const selected = multiple ? value || [] : value;
  const toggle = (v) => {
    if (!multiple) {
      onChange(v);
      return;
    }
    const has = selected.includes(v);
    if (!has && max && selected.length >= max) return;
    onChange(has ? selected.filter((x) => x !== v) : [...selected, v]);
  };
  return (
    <fieldset className="fieldset">
      <legend>
        <LabelText label={legend} required={required} optional={optional} extra={max ? `(up to ${max})` : null} />
      </legend>
      <div className="row" style={{ '--gap': '8px' }}>
        {options.map((o) => {
          const v = optionValue(o);
          const on = multiple ? selected.includes(v) : selected === v;
          const full = multiple && !on && max && selected.length >= max;
          return (
            <ToggleChip key={v} on={on} check={multiple} disabled={Boolean(full)} onClick={() => toggle(v)}>
              {optionLabel(o)}
            </ToggleChip>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CheckField({ id, label, checked, onChange, required }) {
  return (
    <label className="checkline" htmlFor={id}>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        aria-required={required || undefined}
      />
      <span>
        <LabelText label={label} required={required} />
      </span>
    </label>
  );
}
