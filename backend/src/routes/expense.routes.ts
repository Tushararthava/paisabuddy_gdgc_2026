import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const expenseController = new ExpenseController();

router.use(authenticate);

router.post("/", expenseController.create);
router.get("/", expenseController.getAll);
router.get("/stats", expenseController.getStats);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.delete);

export default router;
