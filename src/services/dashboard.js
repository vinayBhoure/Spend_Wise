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

      // 2. Fetch current month's transactions (expense & income)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthTransactions, error: txError } = await supabase
        .from('transactions')
        .select(`
          amount, type, date,
          accounts:account_id (currency),
          categories:category_id (name)
        `)
        .eq('user_id', userId)
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (txError) throw txError;
      
      let monthIncome = 0;
      let monthExpenses = 0;
      const categoryMap = {};
      
      const CHART_COLORS = ['#00e6cb', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#64748b'];
      let colorIndex = 0;

      monthTransactions?.forEach(tx => {
        const amount = Number(tx.amount);
        // Note: tx.accounts might be an array if using inner joins, 
        // but here it's on account_id which is a foreign key.
        const txCurrency = tx.accounts?.currency || 'INR';
        const converted = convertCurrency(amount, txCurrency, targetCurrency);

        if (tx.type === 'income') {
          monthIncome += converted;
        } else if (tx.type === 'expense') {
          monthExpenses += converted;
          
          // Track category breakdown
          const catName = tx.categories?.name || 'Uncategorized';
          if (!categoryMap[catName]) {
            categoryMap[catName] = { amount: 0, color: { hex: CHART_COLORS[colorIndex % CHART_COLORS.length] } };
            colorIndex++;
          }
          categoryMap[catName].amount += converted;
        }
      });

      const monthSavings = monthIncome - monthExpenses;

      // Calculate Category Percentages
      const categoryBreakdown = Object.keys(categoryMap).map(key => ({
        name: key,
        percentage: monthExpenses > 0 ? (categoryMap[key].amount / monthExpenses) * 100 : 0,
        amount: categoryMap[key].amount,
        color: categoryMap[key].color
      })).sort((a, b) => b.amount - a.amount);

      // 3. Fetch recent 10 transactions
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
        .limit(10);

      if (recentError) throw recentError;

      // 4. Fetch last 14 days transactions for "Weekly Activity" Graph & Trend
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

      const { data: twoWeekTransactions, error: weekError } = await supabase
        .from('transactions')
        .select(`
          amount, date, type,
          accounts:account_id (currency)
        `)
        .eq('user_id', userId)
        .gte('date', twoWeeksAgo.toISOString().split('T')[0])
        .eq('type', 'expense');

      if (weekError) throw weekError;

      // Process 7 days data (current week) and previous week totals
      const last7Days = [];
      let currentWeekTotal = 0;
      let previousWeekTotal = 0;

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const dayTotal = twoWeekTransactions
          ?.filter(tx => tx.date === dateStr)
          .reduce((sum, tx) => {
            const amount = Number(tx.amount);
            const txCurrency = tx.accounts?.currency || 'INR';
            return sum + convertCurrency(amount, txCurrency, targetCurrency);
          }, 0) || 0;

        currentWeekTotal += dayTotal;

        last7Days.push({
          date: dateStr,
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: dayTotal
        });
      }

      for (let i = 13; i >= 7; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const dayTotal = twoWeekTransactions
          ?.filter(tx => tx.date === dateStr)
          .reduce((sum, tx) => {
            const amount = Number(tx.amount);
            const txCurrency = tx.accounts?.currency || 'INR';
            return sum + convertCurrency(amount, txCurrency, targetCurrency);
          }, 0) || 0;

        previousWeekTotal += dayTotal;
      }

      // Calculate Real Trend Percentage
      let trendPercentage = 0;
      let isPositive = false; // lower expense is positive outcome

      if (previousWeekTotal > 0) {
        trendPercentage = Math.round(Math.abs((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100);
        isPositive = currentWeekTotal <= previousWeekTotal; // true if this week costs less or equal
      }

      // Mock streak logic based on logging habits
      const uniqueDatesLogged = new Set(monthTransactions?.map(tx => tx.date));
      const streakDays = Math.min(12, uniqueDatesLogged.size || 1);

      return {
        balance: totalBalance,
        monthSummary: {
          income: monthIncome,
          expense: monthExpenses,
          savings: monthSavings
        },
        categoryBreakdown,
        streak: {
          days: streakDays,
          logs: last7Days.map(day => ({ ...day, logged: day.amount > 0 }))
        },
        weeklyActivity: {
          total: currentWeekTotal,
          trendPercentage: trendPercentage,
          isPositive: isPositive,
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
