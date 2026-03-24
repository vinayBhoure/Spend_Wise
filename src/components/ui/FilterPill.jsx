import PropTypes from 'prop-types';

export const FilterPill = ({ label, icon: Icon, isActive, onClick }) => {
  const baseClasses = "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 text-sm transition-colors";
  const activeClasses = "bg-primary text-background-dark font-bold";
  const inactiveClasses = "bg-white/5 text-slate-300 font-medium border border-white/10 hover:bg-white/10";

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span>{label}</span>
      {Icon && <Icon size={18} />}
    </button>
  );
};

FilterPill.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
};

FilterPill.defaultProps = {
  isActive: false,
  onClick: () => {}
};
