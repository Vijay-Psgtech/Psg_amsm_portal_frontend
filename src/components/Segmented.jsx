/** A row of buttons where exactly one is selected. options: [{ value, label, dot? }] */
export default function Segmented({ label, options, value, onChange, pill = false }) {
  return (
    <div className={'seg' + (pill ? ' seg--pill' : '')} role="group" aria-label={label}>
      {options.map((option) => {
        const on = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={'seg__btn' + (on ? ' is-on' : '')}
            aria-pressed={on}
            onClick={() => onChange(option.value)}
          >
            {option.dot ? (
              <span
                className="swatch swatch--dot"
                style={{ background: option.dot, boxShadow: '0 0 0 2px #fff' }}
                aria-hidden="true"
              />
            ) : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
