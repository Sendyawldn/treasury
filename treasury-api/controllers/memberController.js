import prisma from '../prisma/client.js';

export const getAllMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, role, phone, avatarColor } = req.body;
    const member = await prisma.member.create({
      data: { name, role, phone, avatarColor },
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.member.delete({ where: { id: Number(id) } });
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
