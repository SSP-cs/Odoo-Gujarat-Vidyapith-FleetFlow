const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const vehicle = await prisma.vehicle.create({
    data: req.body,
  });
  res.json(vehicle);
});

router.get("/", async (req, res) => {
  const vehicles = await prisma.vehicle.findMany();
  res.json(vehicles);
});

router.put("/:id", async (req, res) => {
  const vehicle = await prisma.vehicle.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(vehicle);
});

router.delete("/:id", async (req, res) => {
  await prisma.vehicle.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Deleted" });
});

module.exports = router;