import { PrismaClient, Expense } from "@prisma/client";

const prisma = new PrismaClient();

export class ExpenseService {
    async createExpense(
        userId: string,
        data: {
            amount: number;
            category: string;
            description?: string;
            date?: Date;
            type: string;
        }
    ): Promise<Expense> {
        return prisma.expense.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    async getExpenses(userId: string): Promise<Expense[]> {
        return prisma.expense.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });
    }

    async updateExpense(
        userId: string,
        expenseId: string,
        data: Partial<{
            amount: number;
            category: string;
            description: string;
            date: Date;
            type: string;
        }>
    ): Promise<Expense> {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
        });

        if (!expense || expense.userId !== userId) {
            throw new Error("Expense not found or unauthorized");
        }

        return prisma.expense.update({
            where: { id: expenseId },
            data,
        });
    }

    async deleteExpense(userId: string, expenseId: string): Promise<void> {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
        });

        if (!expense || expense.userId !== userId) {
            throw new Error("Expense not found or unauthorized");
        }

        await prisma.expense.delete({
            where: { id: expenseId },
        });
    }

    async getExpenseStats(userId: string) {
        const expenses = await prisma.expense.findMany({
            where: { userId },
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        const byType = expenses.reduce((acc, exp) => {
            acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);

        const byCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalSpent,
            byType,
            byCategory,
        };
    }
}
