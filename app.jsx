import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const API = "http://localhost:5001";

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [dashboard, setDashboard] = useState({});

  const [vehicleName, setVehicleName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [driverName, setDriverName] = useState("");

  const fetchData = async () => {
    const v = await axios.get(API + "/vehicles");
    const d = await axios.get(API + "/drivers");
    const dash = await axios.get(API + "/dashboard");

    setVehicles(v.data);
    setDrivers(d.data);
    setDashboard(dash.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addVehicle = async () => {
    if (!vehicleName || !capacity) return alert("Enter all vehicle details");

    await axios.post(API + "/vehicles", {
      name: vehicleName,
      maxCapacity: Number(capacity)
    });

    setVehicleName("");
    setCapacity("");
    fetchData();
  };

  const addDriver = async () => {
    if (!driverName) return alert("Enter driver name");

    await axios.post(API + "/drivers", {
      name: driverName
    });

    setDriverName("");
    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>FleetFlow Dashboard</h1>

      <h2>Stats</h2>
      <p>Total Vehicles: {dashboard.totalVehicles || 0}</p>
      <p>Active Trips: {dashboard.activeTrips || 0}</p>
      <p>Available Drivers: {dashboard.availableDrivers || 0}</p>
      <hr />
      <h2>Add Vehicle</h2>
      <input
        placeholder="Vehicle Name"
        value={vehicleName}
        onChange={(e) => setVehicleName(e.target.value)}
      />
      <input
        placeholder="Max Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button onClick={addVehicle}>Add Vehicle</button>
      <h2>Add Driver</h2>
      <input
        placeholder="Driver Name"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
      />
      <button onClick={addDriver}>Add Driver</button>
      <hr />
      <h2>Vehicles</h2>
      {vehicles.map(v => (
        <div key={v.id}>
          {v.name} - Capacity: {v.maxCapacity} - Status: {v.status}
        </div>
      ))}
      <h2>Drivers</h2>
      {drivers.map(d => (
        <div key={d.id}>
          {d.name} - Status: {d.status}
        </div>
      ))}
    </div>
  );
}
