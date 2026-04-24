import express from "express";
import {createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,} from "../controllers/budgetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../validators/budgetValidator.js";

const router = express.Router();
router.use(authMiddleware); // Apply authentication middleware to all budget routes

router.post("/", authMiddleware, validate(createBudgetSchema), createBudget);
router.get("/", authMiddleware, getBudgets);
router.get("/:id", authMiddleware, getBudgetById);
//router.post("/login", login);
//router.post("/logout", logout);
router.put("/:id", authMiddleware, validate(updateBudgetSchema), updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);
export default router;