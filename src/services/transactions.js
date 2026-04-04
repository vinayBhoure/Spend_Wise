import { supabase } from '../lib/supabase';

export const transactionsService = {
  /**
   * Fetch all transactions for a user
   * @param {string} userId - User's UUID
   * @param {object} filters - Optional filters
   */
  async fetchTransactions(userId, filters = {}) {
    if (!userId) throw new Error('User ID is required');

    try {
      let query = supabase
        .from('transactions')
        .select(`
          id, amount, date, time, type, note, is_transfer,
          categories:category_id (name, emoji, type),
          accounts:account_id (name, type, currency)
        `)
        .eq('user_id', userId);

      // Apply Date Filter & History Limit
      if (filters?.historyMonthsLimit) {
        const limitDate = new Date();
        limitDate.setMonth(limitDate.getMonth() - filters.historyMonthsLimit);
        const limitDateStr = limitDate.toISOString().split('T')[0];
        
        if (filters?.startDate) {
          // Use the more restrictive of the two
          const effectiveStart = filters.startDate > limitDateStr ? filters.startDate : limitDateStr;
          query = query.gte('date', effectiveStart);
        } else {
          query = query.gte('date', limitDateStr);
        }
      } else if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      // Apply Type Filter
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      // Apply Amount Filter
      if (filters?.minAmount) {
        query = query.gte('amount', filters.minAmount);
      }
      if (filters?.maxAmount) {
        query = query.lte('amount', filters.maxAmount);
      }

      // Apply Categories Filter
      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category_id', filters.categories);
      }

      // Apply Accounts Filter
      if (filters?.accounts && filters.accounts.length > 0) {
        query = query.in('account_id', filters.accounts);
      }

      // Order by date and time
      query = query.order('date', { ascending: false })
                   .order('time', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },



  /**
   * Fetch a single transaction by its ID with joined category and account.
   * @param {string} id - Transaction UUID
   * @returns {Promise<object>}
   */
  async fetchTransactionById(id) {
    if (!id) throw new Error('Transaction ID is required');

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id, amount, date, time, type, note, is_transfer,
        category_id,
        account_id,
        transfer_to_account_id,
        categories:category_id (id, name, emoji, type),
        accounts:account_id (id, name, type)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing transaction.
   * @param {string} id - Transaction UUID
   * @param {object} payload - Fields to update
   * @returns {Promise<object>}
   */
  async updateTransaction(id, payload) {
    if (!id) throw new Error('Transaction ID is required');

    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a transaction permanently.
   * @param {string} id - Transaction UUID
   * @returns {Promise<void>}
   */
  async deleteTransaction(id) {
    if (!id) throw new Error('Transaction ID is required');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Create a new transaction
   * @param {object} payload - Transaction data
   * @returns {Promise<object>}
   */
  async createTransaction(payload) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new transfer
   * @param {object} payload - Transfer data
   * @returns {Promise<object>}
   */
  async createTransfer(payload) {
    // A transfer is essentially a transaction with `is_transfer: true` and a `transfer_to_account_id`.
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...payload,
        is_transfer: true,
        type: 'transfer' // Explicitly set it although DB might accept 'expense' or just ignore type if it checks is_transfer
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
