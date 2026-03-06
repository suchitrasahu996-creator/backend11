import { supabase } from '../config/supabaseClient.js';

export const getDashboardAnalytics = async (userId) => {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId);

  const { data: bills } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId);

  const { data: debts } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId);

  const { data: investments } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId);

  const totalIncome = transactions
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const totalExpenses = transactions
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.amount), 0) || 0;

  const totalDebts = debts?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;

  const totalInvestments = investments?.reduce((sum, i) => sum + parseFloat(i.current_value || i.amount), 0) || 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    totalBudget,
    totalDebts,
    totalInvestments,
    transactionCount: transactions?.length || 0,
    goalCount: goals?.length || 0,
    billCount: bills?.length || 0,
  };
};

export const getMonthlySummary = async (userId) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const startDate = `${currentYear}-${currentMonth}-01`;

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate);

  const income = transactions
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const expenses = transactions
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  return {
    month: `${currentYear}-${currentMonth}`,
    income,
    expenses,
    balance: income - expenses,
  };
};

export const getCategoryBreakdown = async (userId) => {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'expense');

  const categoryTotals = {};

  transactions?.forEach((transaction) => {
    const category = transaction.category || 'Uncategorized';
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += parseFloat(transaction.amount);
  });

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
};

export const getYearlyAnalytics = async (userId) => {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  const monthlyData = {};

  for (let i = 1; i <= 12; i++) {
    const month = String(i).padStart(2, '0');
    monthlyData[month] = { income: 0, expenses: 0 };
  }

  transactions?.forEach((transaction) => {
    const month = transaction.date.substring(5, 7);
    if (transaction.type === 'income') {
      monthlyData[month].income += parseFloat(transaction.amount);
    } else {
      monthlyData[month].expenses += parseFloat(transaction.amount);
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month: `${currentYear}-${month}`,
    ...data,
  }));
};

export const getSummary = async (userId) => {
  const dashboard = await getDashboardAnalytics(userId);
  const monthly = await getMonthlySummary(userId);
  const categories = await getCategoryBreakdown(userId);

  return {
    overview: dashboard,
    currentMonth: monthly,
    topCategories: categories.slice(0, 5),
  };
};
