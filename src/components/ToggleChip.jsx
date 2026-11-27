import Icon from './Icon.jsx';

/** A pill button that can be switched on and off (single or multi select). */
export default function ToggleChip({ on, onClick, disabled, check = false, small = false, children }) {
  return (
    <button
      type="button"
      className={'toggle' + (small ? ' toggle--sm' : '') + (on ? ' is-on' : '')}
      aria-pressed={on}
      onClick={onClick}
      disabled={disabled}
    >
      {check && on ? <Icon name="check" size={14} strokeWidth={3} /> : null}
      {children}
    </button>
  );
}
