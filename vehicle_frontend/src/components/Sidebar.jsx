function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside
      style={{
        width: 220,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Navigation</h2>
      <button
        onClick={() => setActiveTab("warehouses")}
        style={{
          width: "100%",
          padding: "10px 14px",
          marginBottom: 12,
          textAlign: "left",
          cursor: "pointer",
          background: activeTab === "warehouses" ? "#111" : "#fff",
          color: activeTab === "warehouses" ? "#fff" : "#000",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        Warehouses
      </button>
      <button
        onClick={() => setActiveTab("routes")}
        style={{
          width: "100%",
          padding: "10px 14px",
          textAlign: "left",
          cursor: "pointer",
          background: activeTab === "routes" ? "#111" : "#fff",
          color: activeTab === "routes" ? "#fff" : "#000",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        Routes
      </button>
    </aside>
  );
}

export default Sidebar;
