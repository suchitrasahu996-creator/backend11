import { supabase } from '../config/supabaseClient.js';

export const getDashboardAnalytics = async (userId) => {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

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
    .eq('user_id', userId)
     .order('due_date', { ascending: true });

  const { data: debts } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId);

  const { data: investments } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId);

   const tx = transactions || [];

  const totalIncome =
    tx.filter(t => t.type === "income")
      .reduce((sum,t)=>sum+Number(t.amount),0);

  const totalExpenses =
    tx.filter(t => t.type === "expense")
      .reduce((sum,t)=>sum+Number(t.amount),0);

  const monthlyTrend =
    getYearlyAnalyticsFromTransactions(tx);

  const expenseByCategory =
    getCategoryBreakdownFromTransactions(tx);

  const totalBudget =
    (budgets || []).reduce((sum,b)=>sum+Number(b.amount),0);

  const totalDebts = (debts || []).reduce((sum,d)=>sum+Number(d.amount),0);

  const totalInvestments =
    (investments || []).reduce(
      (sum,i)=>sum+Number(i.current_value || i.amount),0
    );

 

  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,

    monthlyTrend,
    expenseByCategory,

     recentTransactions: transactions?.slice(0, 5) || [],
    upcomingBills: bills?.slice(0, 5) || [],
    
    // balance: totalIncome - totalExpenses,

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
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate);

  const income =
    transactions?.filter(t => t.type === "income")
    .reduce((sum,t)=>sum+Number(t.amount),0) || 0;

  const expenses =
    transactions?.filter(t => t.type === "expense")
    .reduce((sum,t)=>sum+Number(t.amount),0) || 0;

  return {
    month:`${currentYear}-${currentMonth}`,
    income,
    expenses,
    balance: income - expenses
  };
};

export const getCategoryBreakdownFromTransactions = (transactions) => {

  const categoryTotals = {};

  transactions
  ?.filter(t => t.type === "expense")
  .forEach(transaction => {

    const category = transaction.category || "Uncategorized";

    if(!categoryTotals[category]){
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += Number(transaction.amount);
  });

  return Object.entries(categoryTotals).map(([category,amount]) => ({
    category,
    amount
  }));
};

export const getYearlyAnalyticsFromTransactions = (transactions) => {

  const currentYear = new Date().getFullYear();

  const monthlyData = {};

  for(let i=1;i<=12;i++){
    const month = String(i).padStart(2,'0');
    monthlyData[month] = {income:0,expenses:0};
  }

  transactions?.forEach(transaction => {

    if(!transaction.date) return;

    const month = transaction.date.substring(5,7);

    if(transaction.type === "income"){
      monthlyData[month].income += Number(transaction.amount);
    } else {
      monthlyData[month].expenses += Number(transaction.amount);
    }

  });

  return Object.entries(monthlyData).map(([month,data]) => ({
    month:`${currentYear}-${month}`,
    ...data
  }));
};

export const getSummary = async (userId) => {
  const dashboard = await getDashboardAnalytics(userId);
  const monthly = await getMonthlySummary(userId);


  return {
    overview: dashboard,
    currentMonth: monthly,
    topCategories: dashboard.expenseByCategory.slice(0, 5),
  };
};
