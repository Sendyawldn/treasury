import prisma from '../prisma/client.js';

export const getAllBudgetItems = async (req, res) => {
  try {
    const budgetItems = await prisma.budgetItem.findMany();
    res.json(budgetItems);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createBudgetItem = async (req, res) => {
  try {
    const { name, category, unit, volume, price, date } = req.body;
    const budgetItem = await prisma.budgetItem.create({
      data: { name, category, unit, volume, price, date },
    });
    res.status(201).json(budgetItem);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteBudgetItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.budgetItem.delete({ where: { id: Number(id) } });
    res.json({ message: 'Budget Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
