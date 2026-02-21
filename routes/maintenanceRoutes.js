const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { vehicleId, cost, notes } = req.body;

  const log = await prisma.maintenance.create({
    data: { vehicleId, cost, notes },
  });

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: "IN_SHOP" },
  });

  res.json(log);
});

module.exports = router;