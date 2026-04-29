import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RankChartProps {
  pagerank: Record<string, number>;
  naive: Record<string, number>;
}

export default function RankChart({ pagerank, naive }: RankChartProps) {
  const data = Object.keys(pagerank).map((node) => ({
    name: node,
    PageRank: Number(pagerank[node].toFixed(4)),
    Naive: Number(naive[node].toFixed(4)),
  }));

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
        📊 Ranking Comparison
      </h3>
      <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
        Blue: PageRank algorithm | Green: Naive (incoming link count)
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="PageRank" fill="#8884d8" />
          <Bar dataKey="Naive" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
