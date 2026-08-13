import { useEffect, useState } from "react";
import { fetchWarehouses, createWarehouse } from "../api";

function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !address.trim()) {
      setError("Please enter both name and address.");
      return;
    }

    setSaving(true);
    try {
      const warehouse = await createWarehouse({
        name: name.trim(),
        address: address.trim(),
      });
      setWarehouses((current) => [warehouse, ...current]);
      setName("");
      setAddress("");
      setSuccess("Warehouse created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create warehouse.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Warehouses</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, maxWidth: 520 }}>
        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="warehouse-name"
            style={{ display: "block", marginBottom: 6 }}
          >
            Name
          </label>
          <input
            id="warehouse-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Warehouse name"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="warehouse-address"
            style={{ display: "block", marginBottom: 6 }}
          >
            Address
          </label>
          <input
            id="warehouse-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Warehouse address"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{ padding: "10px 16px" }}
        >
          {saving ? "Saving…" : "Create Warehouse"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {loading ? (
        <p>Loading warehouses…</p>
      ) : warehouses.length ? (
        <ul>
          {warehouses.map((warehouse) => (
            <li key={warehouse.id} style={{ marginBottom: 16 }}>
              <strong>{warehouse.name}</strong>
              <br />
              {warehouse.address}
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
