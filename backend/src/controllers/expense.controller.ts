import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.service";

const expenseService = new ExpenseService();

export class ExpenseController {
    async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { amount, category, description, date, type } = req.body;

            const expenseData = {
                amount: Number(amount),
                category,
                description,
                date: date ? new Date(date) : new Date(),
                type
            };

            const expense = await expenseService.createExpense(userId, expenseData);
            return res.status(201).json(expense);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const expenses = await expenseService.getExpenses(userId);
            return res.json(expenses);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const expense = await expenseService.updateExpense(
                userId,
                req.params.id,
                req.body
            );
            return res.json(expense);
        } catch (error: any) {
            if (error.message === "Expense not found or unauthorized") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await expenseService.deleteExpense(userId, req.params.id);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === "Expense not found or unauthorized") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stats = await expenseService.getExpenseStats(userId);
            return res.json(stats);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
