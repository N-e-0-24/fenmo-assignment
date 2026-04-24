import express from 'express';
import cors from 'cors';
import { InMemoryExpenseRepository } from './repository/expense.repository';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { createExpenseRouter } from './routes/expense.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Dependency Injection ─────────────────────────────────
const repository = new InMemoryExpenseRepository();
const service = new ExpenseService(repository);
const controller = new ExpenseController(service);

// ── Routes ───────────────────────────────────────────────
app.use('/api/expenses', createExpenseRouter(controller));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler (must be last) ─────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

export default app;
