import { useEffect, useState } from "react";
import { apiRequest } from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest("/api/dashboard");
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Active Fleet: {stats.activeFleet}</p>
      <p>Maintenance Alerts: {stats.maintenanceAlerts}</p>
      <p>Utilization Rate: {stats.utilizationRate}%</p>
    </div>
  );
}

export default Dashboard;