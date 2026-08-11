import { useEffect, useState } from "react";
import { fetchWarehouses } from "../api";

function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch (err) {
        setWarehouses([]);
        setError("Failed to load warehouses.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section>
      <h2>Warehouses</h2>
      {loading ? (
        <p>Loading warehouses…</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : warehouses.length ? (
        <ul>
          {warehouses.map((warehouse) => (
            <li key={warehouse.id} style={{ marginBottom: 10 }}>
              <strong>{warehouse.name}</strong>
              <br />
              {warehouse.latitude}, {warehouse.longitude}
            </li>
          ))}
        </ul>
      ) : (
        <p>No warehouses registered yet.</p>
      )}
    </section>
  );
}

export default WarehousesPage;
