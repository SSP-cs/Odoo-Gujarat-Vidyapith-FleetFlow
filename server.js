const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ---------------- AUTH ROUTE ---------------- */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = "supersecretkey";

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* ---------------- DASHBOARD ROUTE ---------------- */

app.get("/api/dashboard", async (req, res) => {
  try {
    const activeFleet = await prisma.vehicle.count({
      where: { status: "ON_TRIP" },
    });

    const inShop = await prisma.vehicle.count({
      where: { status: "IN_SHOP" },
    });

    const total = await prisma.vehicle.count();

    const utilization =
      total > 0 ? ((activeFleet / total) * 100).toFixed(2) : 0;

    res.json({
      activeFleet,
      maintenanceAlerts: inShop,
      utilizationRate: utilization,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});

/* ---------------- SERVER START ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/api/vehicles", async (req, res) => {
  const vehicle = await prisma.vehicle.create({
    data: req.body,
  });
  res.json(vehicle);
});

app.get("/api/vehicles", async (req, res) => {
  const vehicles = await prisma.vehicle.findMany();
  res.json(vehicles);
});

app.post("/api/trips", async (req, res) => {
  const { vehicleId, cargoWeight } = req.body;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (cargoWeight > vehicle.maxCapacity) {
    return res.status(400).json({
      message: "Cargo exceeds max capacity",
    });
  }

  const trip = await prisma.trip.create({
    data: req.body,
  });

  res.json(trip);
});