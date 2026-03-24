import React from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';

/**
 * @typedef {Object} CategoryRowProps
 * @property {string} emoji
 * @property {string} name
 * @property {boolean} isDeletable
 * @property {function} [onEdit]
 * @property {function} [onDelete]
 */

export const CategoryRow = ({ emoji, name, isDeletable, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 group">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0">{emoji}</span>
        <span className="text-sm font-semibold text-slate-100 truncate">{name}</span>
      </div>
      {isDeletable && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors active:scale-90"
            aria-label={`Edit ${name}`}
          >
            <Pencil className="size-4" strokeWidth={2} />
          </button>
          <button
            onClick={onDelete}
            className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
            aria-label={`Delete ${name}`}
          >
            <Trash2 className="size-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};

CategoryRow.propTypes = {
  emoji: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
