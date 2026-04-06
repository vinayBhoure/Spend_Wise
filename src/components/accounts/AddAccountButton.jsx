import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';

/**
 * @typedef {Object} AddAccountButtonProps
 * @property {() => void} onClick
 */

export const AddAccountButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-3 text-slate-500 font-bold hover:bg-card-dark hover:text-primary hover:border-primary/30 transition-all group mt-6"
    >
      <PlusCircle className="size-6 group-hover:scale-110 transition-transform" />
      Add New Account
    </button>
  );
};

AddAccountButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
