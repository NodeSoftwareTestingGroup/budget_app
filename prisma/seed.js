// Seed file to populate the database with initial data 
// for testing and development purposes. This file creates sample budgets 
// and associated expenses for a specific user.
// Put in environment variable(env) before deployment: USER_ID
// to link the budgets to that user.





import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const createdUserId = process.env.USER_ID;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

if (!createdUserId) {
  throw new Error("USER_ID is missing in .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});
const existingUser = await prisma.user.findUnique({
  where: { id: createdUserId },
});

if (!existingUser) {
  throw new Error(`User with ID ${createdUserId} does not exist`);
}

const budgets = [
  {
    title: "Budget 1",
    income: 5000,
    userId: createdUserId,
    expenses: [
      {
        name: "Expense 1",
        amount: 1000,
        category: "Food",
      },
      {
        name: "Expense 2",
        amount: 500,
        category: "Transport",
      },
    ],
  },
  {
    title: "Budget 2",
    income: 3000,
    userId: createdUserId,
    expenses: [
      {
        name: "Expense 3",
        amount: 800,
        category: "Entertainment",
      },
      {
        name: "Expense 4",
        amount: 200,
        category: "Utilities",
      },
    ],
  },
];

const main = async () => {
  console.log("Seeding budgets...");

  for (const budget of budgets) {
    await prisma.budget.create({
      data: {
        title: budget.title,
        income: budget.income,
        userId: budget.userId,
        expenses: {
          create: budget.expenses,
        },
      },
    });
  }

  console.log("Seeding completed.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });