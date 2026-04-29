import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ConvergenceChartProps {
  iterations: Record<string, number>[];
}

export default function ConvergenceChart({
  iterations,
}: ConvergenceChartProps) {
  const data = iterations.map((step, i) => ({
    iteration: i,
    ...Object.fromEntries(
      Object.entries(step).map(([k, v]) => [k, Number(v.toFixed(4))]),
    ),
  }));

  const nodes = iterations.length > 0 ? Object.keys(iterations[0]) : [];
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#a4de6c",
    "#d084d0",
  ];

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
        📈 Convergence Over Iterations
      </h3>
      <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
        Watch how each node's PageRank score evolves and converges
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="iteration"
            label={{ value: "Iteration", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{
              value: "PageRank Score",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          {nodes.map((node, i) => (
            <Line
              key={node}
              type="monotone"
              dataKey={node}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
