import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * @typedef {Object} CategoryModalProps
 * @property {boolean} isOpen
 * @property {function} onClose
 * @property {function} onSave
 * @property {object} [initialData]
 * @property {string} categoryType
 */

export const CategoryModal = ({ isOpen, onClose, onSave, initialData, categoryType }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setEmoji(initialData?.emoji || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim() || !emoji.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), emoji: emoji.trim(), type: categoryType });
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-lg font-bold text-slate-100">
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h3>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 space-y-4">
          {/* Emoji input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Emoji
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="e.g. 🎮"
              maxLength={4}
              className="w-full h-12 px-4 bg-white/5 rounded-xl border border-white/10 text-slate-100 text-xl text-center focus:outline-none placeholder:text-slate-600 transition-all focus:ring-0"
            />
          </div>
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gaming"
              maxLength={30}
              className="w-full h-12 px-4 bg-white/5 rounded-xl border border-white/10 text-slate-100 focus:outline-none placeholder:text-slate-600 transition-all text-sm focus:ring-0"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-white/10 text-slate-400 font-semibold text-sm hover:bg-white/5 transition-colors active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !emoji.trim() || saving}
              className="flex-1 h-12 rounded-xl bg-primary text-background-dark font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    emoji: PropTypes.string,
  }),
  categoryType: PropTypes.string.isRequired,
};
