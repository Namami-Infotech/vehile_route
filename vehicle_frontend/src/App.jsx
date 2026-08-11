import { useState } from "react";
import { Sidebar } from "./components";
import { WarehousesPage, RoutesPage } from "./pages";

function App() {
  const [activeTab, setActiveTab] = useState("warehouses");

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1>Vehicle Planner</h1>
      <p>
        Use the sidebar to switch between warehouse and route views. The API
        calls are handled in separate page components.
      </p>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1 }}>
          {activeTab === "warehouses" ? <WarehousesPage /> : <RoutesPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
