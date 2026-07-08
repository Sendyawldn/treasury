import prisma from '../prisma/client.js';

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { date, terkumpul, konsumsi, notes } = req.body;
    const transaction = await prisma.transaction.create({
      data: { date: new Date(date), terkumpul, konsumsi, notes },
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, terkumpul, konsumsi, notes } = req.body;
    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { date: new Date(date), terkumpul, konsumsi, notes },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({ where: { id: Number(id) } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
