import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getLocations = async (req: Request, res: Response) => {
  const locations = await prisma.location.findMany();
  res.json(locations);
};

export const getWeeklyReport = async (req: Request, res: Response) => {
  const { locationId, weekStartDate } = req.params;
  const report = await prisma.weeklyReport.findFirst({
    where: {
      locationId: parseInt(locationId),
      weekStartDate: new Date(weekStartDate),
    },
  });
  res.json(report);
};

export const createOrUpdateWeeklyReport = async (
  req: Request,
  res: Response
) => {
  const { locationId, weekStartDate, weekEndDate, ...data } = req.body;
  const existingReport = await prisma.weeklyReport.findFirst({
    where: {
      locationId: parseInt(locationId),
      weekStartDate: new Date(weekStartDate),
    },
  });

  if (existingReport) {
    const updatedReport = await prisma.weeklyReport.update({
      where: { id: existingReport.id },
      data: { ...data },
    });
    res.json(updatedReport);
  } else {
    const newReport = await prisma.weeklyReport.create({
      data: {
        locationId: parseInt(locationId),
        weekStartDate: new Date(weekStartDate),
        weekEndDate: new Date(weekEndDate),
        ...data,
      },
    });
    res.json(newReport);
  }
};

export const getSummary = async (req: Request, res: Response) => {
  const { locationId, weekStartDate } = req.params;
  const reports = await prisma.weeklyReport.findMany({
    where: {
      locationId: parseInt(locationId),
      weekStartDate: new Date(weekStartDate),
    },
  });
  res.json(reports);
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.weeklyReport.findMany({
      include: {
        location: true,
      },
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({ error: "Failed to fetch all reports" });
  }
};
