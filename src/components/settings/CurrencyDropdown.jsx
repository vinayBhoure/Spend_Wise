import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { StyledSelect } from '../ui/StyledSelect';
import { CURRENCIES } from '../../utils/currency';

/**
 * @typedef {Object} CurrencyDropdownProps
 * @property {string} value
 * @property {function} onChange
 * @property {boolean} [updating]
 */

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} (${c.symbol}) — ${c.name}`,
}));

export const CurrencyDropdown = ({ value, onChange, updating }) => {
  if (updating) {
    return <Loader2 className="size-4 animate-spin text-primary" />;
  }

  const selected = CURRENCIES.find((c) => c.code === value) || CURRENCIES[0];

  return (
    <StyledSelect
      options={currencyOptions}
      value={value}
      onChange={onChange}
      placeholder="Select currency"
      triggerClassName="!bg-transparent !border-0 !p-0 !rounded-none !ring-0 w-auto justify-end"
      dropdownClassName="w-56 right-0 left-auto"
    />
  );
};

CurrencyDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  updating: PropTypes.bool,
};
