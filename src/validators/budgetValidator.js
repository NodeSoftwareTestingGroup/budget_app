import { z } from "zod";

const expenseSchema = z.object({
  name: z.string().trim().min(1, "Expense name is required"),
  amount: z.coerce.number().positive("Expense amount must be greater than 0"),
  category: z.string().trim().optional().default("Other"),
});

export const createBudgetSchema = z.object({
  title: z.string().trim().min(1, "Budget title is required"),
  income: z.coerce.number().positive("Income must be greater than 0"),
  expenses: z.array(expenseSchema).optional().default([]),
});

export const updateBudgetSchema = z
  .object({
    title: z.string().trim().min(1, "Budget title cannot be empty").optional(),
    income: z.coerce.number().positive("Income must be greater than 0").optional(),
  })
  .strict()
  .refine((data) => data.title !== undefined || data.income !== undefined, {
    message: "At least one field is required to update",
  });