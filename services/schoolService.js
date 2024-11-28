const { PrismaClient } = require("@prisma/client");
const { calculateDistance } = require("../src/utils/distance.js");

const prisma = new PrismaClient();

const addSchool = async (schoolData) => {
  return await prisma.school.create({
    data: schoolData,
  });
};

const listSchools = async (userLat, userLon) => {
  const schools = await prisma.school.findMany();

  const schoolsWithDistance = schools.map((school) => ({
    ...school,
    distance: calculateDistance(
      userLat,
      userLon,
      school.latitude,
      school.longitude
    ),
  }));

  return schoolsWithDistance.sort((a, b) => a.distance - b.distance);
};

module.exports = { addSchool, listSchools };
