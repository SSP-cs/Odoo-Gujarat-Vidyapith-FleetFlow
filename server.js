import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
let vehicles = [];
let drivers = [];
let trips = [];
let vehicleId = 1;
let driverId = 1;
let tripId = 1;
/* =============================
   VEHICLES
============================= */

app.get("/vehicles", (req, res) => {
  res.json(vehicles);
});
app.post("/vehicles", (req, res) => {
  const { name, maxCapacity } = req.body;
  if (!name || !maxCapacity) {
    return res.status(400).json({ error: "Missing vehicle data" });
  }
  const vehicle = {
    id: vehicleId++,
    name,
    maxCapacity,
    status: "AVAILABLE"
  };
  vehicles.push(vehicle);
  res.json(vehicle);
});

/* =============================
   DRIVERS
============================= */

app.get("/drivers", (req, res) => {
  res.json(drivers);
});
app.post("/drivers", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Missing driver name" });
  }
  const driver = {
    id: driverId++,
    name,
    status: "AVAILABLE"
  };
drivers.push(driver);
  res.json(driver);
});

/* =============================
   TRIPS (Dispatch Logic)
============================= */

app.get("/trips", (req, res) => {
  res.json(trips);
});
app.post("/trips", (req, res) => {
  const { vehicleId: vId, driverId: dId, cargoWeight } = req.body;
  const vehicle = vehicles.find(v => v.id === vId);
  const driver = drivers.find(d => d.id === dId);
  if (!vehicle || !driver) {
    return res.status(400).json({ error: "Invalid vehicle or driver" });
  }
  if (vehicle.status !== "AVAILABLE") {
    return res.status(400).json({ error: "Vehicle not available" });
  }
  if (driver.status !== "AVAILABLE") {
    return res.status(400).json({ error: "Driver not available" });
  }
  if (cargoWeight > vehicle.maxCapacity) {
    return res.status(400).json({ error: "Exceeds vehicle capacity" });
  }
  const trip = {
    id: tripId++,
    vehicleId: vId,
    driverId: dId,
    cargoWeight,
    status: "ACTIVE"
  };
  trips.push(trip);
  vehicle.status = "ON_TRIP";
  driver.status = "ON_TRIP";
  res.json(trip);
});

/* =============================
   DASHBOARD
============================= */

app.get("/dashboard", (req, res) => {
  res.json({
    totalVehicles: vehicles.length,
    activeTrips: trips.filter(t => t.status === "ACTIVE").length,
    availableDrivers: drivers.filter(d => d.status === "AVAILABLE").length
  });
});

/* =============================
   SERVER
============================= */

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/dashboard", (req, res) => {
  res.json({
    totalVehicles: vehicles.length,
    activeTrips: trips.filter(t => t.status === "DISPATCHED").length,
    availableDrivers: drivers.filter(d => d.status === "AVAILABLE").length
  });
});
