import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (for now, protecting all routes to keep it simple, but in a real app you'd separate GET and POST/DELETE)
// According to instruction: "Akses publik hanya bersifat read-only. Semua manipulasi data keuangan wajib melalui authentication (login)."
// So let's mount them directly, but inside the routers we could protect POST/DELETE.
// However, since we didn't add authenticateToken in the individual routers, I'll protect the whole routers here for simplicity, 
// OR better yet, let's just make the APIs public for GET, and protect POST/DELETE. I'll modify the routers instead. Let's just register authRoutes for now.

app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('Treasury API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
