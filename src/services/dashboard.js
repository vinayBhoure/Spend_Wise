import { supabase } from '../lib/supabase';
import { convertCurrency } from '../utils/currency';

export const dashboardService = {
  /**
   * Fetch complete dashboard summary for a user
   * @param {string} userId - User's UUID
   * @param {string} targetCurrency - User's preferred currency
   */
  async fetchDashboardSummary(userId, targetCurrency = 'INR') {
    if (!userId) throw new Error('User ID is required');

    try {
      // 1. Fetch all accounts for balance
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('current_balance, currency')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .eq('exclude_from_transactions', false);

      if (accountsError) throw accountsError;
      const totalBalance = accounts?.reduce((sum, acc) => {
        const balance = Number(acc.current_balance) || 0;
        const converted = convertCurrency(balance, acc.currency || 'INR', targetCurrency);
        return sum + converted;
      }, 0) || 0;

      // 2. Fetch current month's transactions to calculate budget usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthTransactions, error: txError } = await supabase
        .from('transactions')
        .select(`
          amount, type, date,
          accounts:account_id (currency)
        `)
        .eq('user_id', userId)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .eq('type', 'expense');

      if (txError) throw txError;
      const monthExpenses = monthTransactions?.reduce((sum, tx) => {
        const amount = Number(tx.amount);
        // Note: tx.accounts might be an array if using inner joins, 
        // but here it's on account_id which is a foreign key.
        const txCurrency = tx.accounts?.currency || 'INR';
        const converted = convertCurrency(amount, txCurrency, targetCurrency);
        return sum + converted;
      }, 0) || 0;

      // Assumption: Budget is fixed at 3000 USD (converted to targetCurrency)
      const baseBudget = 3000;
      const monthlyBudget = convertCurrency(baseBudget, 'USD', targetCurrency);
      const budgetUsedPercentage = Math.min(100, Math.round((monthExpenses / monthlyBudget) * 100));

      // 3. Fetch recent 5 transactions with Category mapping
      const { data: recentTransactions, error: recentError } = await supabase
        .from('transactions')
        .select(`
          id, amount, date, time, type, note, is_transfer,
          categories:category_id (name, emoji, type),
          accounts:account_id (name, currency)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('time', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // 4. Fetch last 7 days transactions for "Weekly Activity" Graph 
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);

      const { data: weekTransactions, error: weekError } = await supabase
        .from('transactions')
        .select(`
          amount, date, type,
          accounts:account_id (currency)
        `)
        .eq('user_id', userId)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .eq('type', 'expense');

      if (weekError) throw weekError;

      // Process 7 days data
      const last7Days = [];
      let weeklyTotal = 0;

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const dayTotal = weekTransactions
          ?.filter(tx => tx.date === dateStr)
          .reduce((sum, tx) => {
            const amount = Number(tx.amount);
            const txCurrency = tx.accounts?.currency || 'INR';
            return sum + convertCurrency(amount, txCurrency, targetCurrency);
          }, 0) || 0;

        weeklyTotal += dayTotal;

        last7Days.push({
          date: dateStr,
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: dayTotal
        });
      }

      // Mock streak logic based on logging habits
      const uniqueDatesLogged = new Set(monthTransactions?.map(tx => tx.date));
      const streakDays = Math.min(12, uniqueDatesLogged.size || 1);

      return {
        balance: totalBalance,
        budget: {
          total: monthlyBudget,
          used: monthExpenses,
          percentage: budgetUsedPercentage
        },
        streak: {
          days: streakDays,
          logs: last7Days.map(day => ({ ...day, logged: day.amount > 0 }))
        },
        weeklyActivity: {
          total: weeklyTotal,
          trendPercentage: 12,
          isPositive: false,
          chartData: last7Days
        },
        recentLogs: recentTransactions || []
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};
