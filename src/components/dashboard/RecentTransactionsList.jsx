import React from 'react';
import { Card } from '../ui/Card';
import { TransactionRow } from '../transactions/TransactionRow';
import { useNavigate } from 'react-router-dom';

/**
 * @param {{
 *   logs: Array<any>
 * }} props
 */
export const RecentTransactionsList = ({ logs, currencyCode = 'INR' }) => {
  const navigate = useNavigate();

  if (!logs || logs.length === 0) {
    return (
      <section className="space-y-5">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recent Logs</h3>
        <Card variant="default" className="flex items-center justify-center p-8 text-slate-500 text-sm">
          No recent transactions found
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recent Logs</h3>
        <button 
          onClick={() => navigate('/transactions')}
          className="text-[10px] text-primary font-bold uppercase tracking-widest hover:text-primary/80 transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {logs.map((tx) => (
          <TransactionRow 
            key={tx.id} 
            transaction={tx} 
            currencyCode={currencyCode}
            onClick={() => navigate(`/edit-transaction/${tx.id}`)}
          />
        ))}
      </div>
    </section>
  );
};
