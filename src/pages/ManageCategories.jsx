import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { CategoryRow } from '../components/categories/CategoryRow';
import { CategoryModal } from '../components/categories/CategoryModal';

export default function ManageCategories() {
  const navigate = useNavigate();
  const { categories, loading, error, addCategory, editCategory, removeCategory } = useCategories(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeCategoryType, setActiveCategoryType] = useState('expense');
  const [activeTab, setActiveTab] = useState('expense');

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');
  const displayedCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;

  const handleAddClick = () => {
    setEditingCategory(null);
    setActiveCategoryType(activeTab);
    setModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setActiveCategoryType(category.type);
    setModalOpen(true);
  };

  const handleSave = async ({ name, emoji, type }) => {
    if (editingCategory) {
      await editCategory(editingCategory.id, { name, emoji });
    } else {
      await addCategory({ name, emoji, type });
    }
  };

  const handleDelete = async (categoryId) => {
    await removeCategory(categoryId);
  };

  // Loading
  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Loading Categories</p>
      </div>
    );
  }

  // Error
  if (error && categories.length === 0) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6">
        <AlertCircle className="size-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-100">Something went wrong</h2>
        <p className="text-slate-400 text-center text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-background-dark font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-dark font-manrope antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 h-16 border-b border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/settings')}
            className="text-primary active:scale-95 transition-transform p-2 rounded-full"
          >
            <ChevronLeft className="size-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-primary">Categories</h1>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 bg-primary text-background-dark px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Add
        </button>
      </header>

      {/* Tabs */}
      <div className="flex px-6 pt-4 gap-2">
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            activeTab === 'expense'
              ? 'bg-primary text-background-dark'
              : 'bg-card-dark text-slate-400 border border-white/5'
          }`}
        >
          Expense ({expenseCategories.length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            activeTab === 'income'
              ? 'bg-primary text-background-dark'
              : 'bg-card-dark text-slate-400 border border-white/5'
          }`}
        >
          Income ({incomeCategories.length})
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        {/* Empty state */}
        {displayedCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-500 text-sm font-medium mb-2">No {activeTab} categories yet</p>
            <button
              onClick={handleAddClick}
              className="text-primary text-sm font-bold active:scale-95 transition-transform"
            >
              Add your first category
            </button>
          </div>
        )}

        {displayedCategories.length > 0 && (
          <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
            {displayedCategories.map((category) => (
              <CategoryRow
                key={category.id}
                emoji={category.emoji}
                name={category.name}
                isDeletable={category.is_deletable}
                onEdit={() => handleEditClick(category)}
                onDelete={() => handleDelete(category.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        initialData={editingCategory}
        categoryType={activeCategoryType}
      />
    </div>
  );
}
