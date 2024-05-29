import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./src/config";

const prisma = new PrismaClient();

const getPreviousMonday = (date: any) => {
  const day = date.getUTCDay();
  const diff = day <= 1 ? 7 - day : day - 1;
  const previousMonday = new Date(date);
  previousMonday.setUTCDate(date.getUTCDate() - diff);
  previousMonday.setUTCHours(0, 0, 0, 0);
  return previousMonday;
};

const main = async () => {
  await prisma.weeklyReport.deleteMany({});
  await prisma.manager.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const location1 = await prisma.location.create({
    data: {
      name: "Fuller-Calumet",
      state: "ILL",
    },
  });

  const location2 = await prisma.location.create({
    data: {
      name: "Fuller-Cicero",
      state: "ILL",
    },
  });

  const location3 = await prisma.location.create({
    data: {
      name: "Sparkle-Belair",
      state: "GA",
    },
  });

  const location4 = await prisma.location.create({
    data: {
      name: "Sparkle-Peach Orchard",
      state: "GA",
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      email: "manager1@example.com",
      password: hashedPassword,
      role: "MANAGER",
      manager: {
        create: {
          locationId: location1.id,
        },
      },
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      email: "manager2@example.com",
      password: hashedPassword,
      role: "MANAGER",
      manager: {
        create: {
          locationId: location2.id,
        },
      },
    },
  });

  const manager3 = await prisma.user.create({
    data: {
      email: "manager3@example.com",
      password: hashedPassword,
      role: "MANAGER",
      manager: {
        create: {
          locationId: location3.id,
        },
      },
    },
  });

  const manager4 = await prisma.user.create({
    data: {
      email: "manager4@example.com",
      password: hashedPassword,
      role: "MANAGER",
      manager: {
        create: {
          locationId: location4.id,
        },
      },
    },
  });

  const now = new Date();

  // Last week's Monday and Sunday
  const lastMonday = getPreviousMonday(now);
  lastMonday.setUTCDate(lastMonday.getUTCDate() - 7);
  const lastSunday = new Date(lastMonday);
  lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
  lastSunday.setUTCHours(0, 0, 0, 0);

  // Two weeks ago Monday and Sunday
  const twoWeeksAgoMonday = new Date(lastMonday);
  twoWeeksAgoMonday.setUTCDate(lastMonday.getUTCDate() - 7);
  const twoWeeksAgoSunday = new Date(twoWeeksAgoMonday);
  twoWeeksAgoSunday.setUTCDate(twoWeeksAgoMonday.getUTCDate() + 6);
  twoWeeksAgoSunday.setUTCHours(0, 0, 0, 0);

  // Ensure locations are created properly
  console.log(`Location 1 ID: ${location1.id}`);
  console.log(`Location 2 ID: ${location2.id}`);
  console.log(`Location 3 ID: ${location3.id}`);
  console.log(`Location 4 ID: ${location4.id}`);

  const createReports = async (
    locationId: number,
    startDate: Date,
    endDate: Date,
    offset = 0
  ) => {
    await prisma.weeklyReport.create({
      data: {
        locationId: locationId,
        weekStartDate: startDate,
        weekEndDate: endDate,
        carCountMonFri: 100 + offset,
        carCountSatSun: 50 + offset,
        retailCarCountMonFri: 80 + offset,
        retailCarCountSatSun: 40 + offset,
        retailRevenueMonFri: 2000 + offset,
        retailRevenueSatSun: 1000 + offset,
        totalRevenueMonFri: 3000 + offset,
        totalRevenueSatSun: 1500 + offset,
        staffHoursMonFri: 160 + offset,
        staffHoursSatSun: 80 + offset,
        totalClubPlanMembers: 10 + offset,
        totalClubPlansSold: 5 + offset,
      },
    });
  };

  await createReports(location1.id, twoWeeksAgoMonday, twoWeeksAgoSunday);
  await createReports(location1.id, lastMonday, lastSunday);
  await createReports(location2.id, twoWeeksAgoMonday, twoWeeksAgoSunday);
  await createReports(location2.id, lastMonday, lastSunday);
  await createReports(location3.id, twoWeeksAgoMonday, twoWeeksAgoSunday, 20);
  await createReports(location3.id, lastMonday, lastSunday, 20);
  await createReports(location4.id, twoWeeksAgoMonday, twoWeeksAgoSunday, 20);
  await createReports(location4.id, lastMonday, lastSunday, 20);

  console.log({
    admin,
    location1,
    location2,
    location3,
    location4,
    manager1,
    manager2,
    manager3,
    manager4,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
