import { prisma } from "../config/budgetDB.js";

const addBudgetSummary = (budget) => {
  const totalExpenses = budget.expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const remaining = Number(budget.income) - totalExpenses;

  return {
    ...budget,
    totalExpenses,
    remaining,
  };
};

const createBudget = async (req, res) => {
  try {
    const { title, income, expenses = [] } = req.body;
    const userId = req.user.id;

    if (!title || income === undefined) {
      return res.status(400).json({
        error: "Title and income are required",
      });
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        title,
        userId,
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        error: "Budget with this title already exists for this user",
      });
    }

    const validExpenses = expenses
      .filter((expense) => expense.name && Number(expense.amount) > 0)
      .map((expense) => ({
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category || "Other",
      }));

    const budget = await prisma.budget.create({
      data: {
        title,
        income: Number(income),
        userId,
        expenses: {
          create: validExpenses,
        },
      },
      include: {
        expenses: true,
      },
    });

    return res.status(201).json({
      status: "success",
      data: {
        budget: addBudgetSummary(budget),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
      },
      include: {
        expenses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const budgetsWithSummary = budgets.map(addBudgetSummary);

    return res.status(200).json({
      status: "success",
      results: budgetsWithSummary.length,
      data: {
        budgets: budgetsWithSummary,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        expenses: true,
      },
    });

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        budget: addBudgetSummary(budget),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, income } = req.body;
    const userId = req.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id,
      },
      data: {
        ...(title && { title }),
        ...(income !== undefined && { income: Number(income) }),
      },
      include: {
        expenses: true,
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        budget: addBudgetSummary(updatedBudget),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    await prisma.budget.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};