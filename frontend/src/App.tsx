import React from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            color: "#333",
            fontSize: "32px",
          }}
        >
          🎯 PageRank Visualization System
        </h1>
        <p
          style={{
            margin: "0 0 30px 0",
            color: "#666",
            fontSize: "16px",
          }}
        >
          Interactive PageRank algorithm with convergence tracking
        </p>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
