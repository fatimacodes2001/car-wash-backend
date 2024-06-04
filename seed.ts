import { PrismaClient, State } from "@prisma/client";
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

  const locations = [
    { name: "Fuller-Calumet", state: State.ILL },
    { name: "Fuller-Cicero", state: State.ILL },
    { name: "Fuller-Matteson", state: State.ILL },
    { name: "Fuller-Elgin", state: State.ILL },
    { name: "Splash-Peoria", state: State.ILL },
    { name: "Getaway-Macomb", state: State.ILL },
    { name: "Getaway-Morton", state: State.ILL },
    { name: "Getaway-Ottawa", state: State.ILL },
    { name: "Getaway-Peru", state: State.ILL },
    { name: "Sparkle-Peach Orchard", state: State.GA },
    { name: "Sparkle-Evans", state: State.GA },
    { name: "Sparkle-Furrys Ferry", state: State.GA },
    { name: "Sparkle-Greenwood", state: State.GA },
    { name: "Sparkle-Grovetown 1", state: State.GA },
    { name: "Sparkle-Grovetown 2", state: State.GA },
    { name: "Sparkle-North Augusta", state: State.GA },
    { name: "Sparkle-Peach Orchard", state: State.GA },
    { name: "Sparkle-Windsor Spring", state: State.GA },
  ];

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
  let i = 1;
  for (const loc of locations) {
    const location = await prisma.location.create({
      data: loc,
    });

    await prisma.user.create({
      data: {
        email: `manager${i}@example.com`,
        password: hashedPassword,
        role: "MANAGER",
        manager: {
          create: {
            locationId: location.id,
          },
        },
      },
    });
    i += 1;

    await createReports(location.id, twoWeeksAgoMonday, twoWeeksAgoSunday);
    await createReports(location.id, lastMonday, lastSunday);
  }

  console.log({ admin });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
