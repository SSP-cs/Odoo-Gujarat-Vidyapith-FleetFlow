const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { vehicleId, driverId, cargoWeight, revenue } = req.body;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (cargoWeight > vehicle.maxCapacity) {
    return res.status(400).json({
      message: "Cargo exceeds vehicle capacity",
    });
  }

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
  });

  if (driver.licenseExpiry < new Date()) {
    return res.status(400).json({
      message: "Driver license expired",
    });
  }

  const trip = await prisma.trip.create({
    data: {
      vehicleId,
      driverId,
      cargoWeight,
      revenue,
      status: "DISPATCHED",
    },
  });

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: "ON_TRIP" },
  });

  res.json(trip);
});

module.exports = router;