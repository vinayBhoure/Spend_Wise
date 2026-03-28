import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditTransaction } from '../hooks/useEditTransaction';
import { EditTransactionForm } from '../components/edit-transaction/EditTransactionForm';
import { PageHeader } from '../components/layout/PageHeader';
import { Loader2 } from 'lucide-react';

/**
 * Interface definition for EditTransaction page
 * @typedef {Object} EditTransactionProps
 */

/**
 * Edit Transaction Page — Responsible for composition and state management.
 * Coordinates input between floating header and form fields.
 */
export const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    transaction,
    categories,
    accounts,
    currency,
    status,
    saveStatus,
    deleteStatus,
    error,
    handleUpdate,
    handleDelete
  } = useEditTransaction(id);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    account_id: '',
    date: '',
    time: '',
    note: ''
  });

  // Sync internal state when transaction loads
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: String(transaction.amount || ''),
        category_id: transaction.category_id || '',
        account_id: transaction.account_id || '',
        date: transaction.date || '',
        time: transaction.time || '',
        note: transaction.note || ''
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    // Basic validation
    const isTransfer = transaction?.type === 'transfer';
    if (!formData.amount || (!isTransfer && !formData.category_id) || !formData.account_id) {
      alert('Please fill in amount, category and account.');
      return;
    }

    try {
      // Clean up payload for nullable fields
      const payload = { ...formData };
      if (payload.time === '') {
        payload.time = null;
      }
      if (payload.note === '') {
        payload.note = null;
      }

      await handleUpdate(payload);
      navigate('/transactions');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await handleDelete();
        navigate('/transactions');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const onClose = () => {
    navigate('/transactions');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-manrope">
      <PageHeader 
        title="Edit Transaction"
        showBack={true}
        onBack={onClose}
        rightElement={
          status === 'loading' ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : (
            <button
              onClick={onSave}
              disabled={saveStatus === 'loading'}
              className="text-primary font-bold text-base px-2 disabled:opacity-50 active:scale-95 transition-transform"
            >
              {saveStatus === 'loading' ? <Loader2 className="size-5 animate-spin" /> : 'Save'}
            </button>
          )
        }
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {error && (
          <div className="mx-4 mt-4 bg-danger/10 border border-danger/20 p-4 rounded-lg text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <EditTransactionForm
          formData={formData}
          onChange={handleChange}
          transaction={transaction}
          categories={categories}
          accounts={accounts}
          currencyCode={currency}
          onDelete={onDelete}
          loading={status === 'loading'}
          deleting={deleteStatus === 'loading'}
          error={status === 'failed'}
        />
      </div>

      {/* Bottom Indicator (iOS style) */}
      <footer className="flex justify-center pb-4 pt-2 bg-background-dark/80 backdrop-blur-md">
        <div className="w-32 h-1 bg-slate-800 rounded-full"></div>
      </footer>
    </div>
  );
};

export default EditTransaction;
