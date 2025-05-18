import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const users = [
    { login: 'alice', password: 'passworda' },
    { login: 'bob', password: 'passwordb' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { login: user.login },
      update: {},
      create: {
        login: user.login,
        password: hashedPassword,
      },
    });
  }

  console.log('Users seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
