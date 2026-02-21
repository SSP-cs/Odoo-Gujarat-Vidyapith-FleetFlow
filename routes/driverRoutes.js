const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * CREATE DRIVER
 */
router.post("/", async (req, res) => {
  try {
    const { name, licenseExpiry, safetyScore } = req.body;

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseExpiry: new Date(licenseExpiry),
        safetyScore: safetyScore || 0,
        status: "OFF_DUTY"
      }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET ALL DRIVERS
 */
router.get("/", async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        trips: true
      }
    });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET SINGLE DRIVER
 */
router.get("/:id", async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: Number(req.params.id) },
      include: { trips: true }
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE DRIVER
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedDriver = await prisma.driver.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE DRIVER
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.driver.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * CHECK LICENSE VALIDITY (For Trip Assignment)
 */
router.get("/:id/check-license", async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driver.licenseExpiry < new Date()) {
      return res.json({
        valid: false,
        message: "License expired"
      });
    }

    res.json({
      valid: true,
      message: "License valid"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE DRIVER STATUS
 * ON_DUTY / OFF_DUTY / SUSPENDED
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedDriver = await prisma.driver.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });

    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;