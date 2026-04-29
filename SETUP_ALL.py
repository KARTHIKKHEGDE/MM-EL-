"""
Complete Project Setup - Extended with Frontend
Run this script to create ALL project files
"""
import os
import json

print("="*60)
print(" 🚀 PAGERANK PROJECT SETUP")
print("="*60)

# 1. CREATE DIRECTORIES
directories = [
    'backend',
    'backend/pagerank',
    'backend/data',
    'frontend',
    'frontend/src',
    'frontend/src/components',
    'frontend/src/pages',
    'frontend/src/api',
    'frontend/public'
]

print("\n📁 Creating directory structure...")
for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"   ✓ {directory}/")

# 2. BACKEND FILES
print("\n🐍 Creating backend files...")

with open('backend/requirements.txt', 'w') as f:
    f.write("flask\nflask-cors\nnetworkx\nnumpy\n")
print("   ✓ requirements.txt")

with open('backend/pagerank/__init__.py', 'w') as f:
    f.write("# PageRank package\n")
print("   ✓ pagerank/__init__.py")

with open('backend/pagerank/graph_builder.py', 'w') as f:
    f.write('''"""Graph Builder Module"""
import networkx as nx

def build_graph(data):
    G = nx.DiGraph()
    for node in data["nodes"]:
        G.add_node(node)
    for edge in data["edges"]:
        if len(edge) == 2:
            G.add_edge(edge[0], edge[1])
    return G

def validate_graph(G):
    return {
        "num_nodes": G.number_of_nodes(),
        "num_edges": G.number_of_edges(),
        "is_connected": nx.is_weakly_connected(G),
        "dangling_nodes": [node for node in G.nodes() if G.out_degree(node) == 0]
    }
''')
print("   ✓ pagerank/graph_builder.py")

with open('backend/pagerank/pagerank_algo.py', 'w') as f:
    f.write('''"""PageRank Algorithm Implementation"""
import numpy as np

def compute_pagerank(G, d=0.85, max_iter=100, tol=1e-6):
    nodes = list(G.nodes())
    N = len(nodes)
    if N == 0:
        return {}, []
    
    pr = {node: 1.0 / N for node in nodes}
    history = [pr.copy()]
    
    for iteration in range(max_iter):
        new_pr = {}
        for node in nodes:
            incoming = list(G.predecessors(node))
            rank_sum = sum(pr[nbr] / G.out_degree(nbr) for nbr in incoming if G.out_degree(nbr) > 0)
            new_pr[node] = (1 - d) / N + d * rank_sum
        
        history.append(new_pr.copy())
        
        if all(abs(new_pr[n] - pr[n]) < tol for n in nodes):
            print(f"✅ Converged after {iteration + 1} iterations")
            break
        pr = new_pr
    
    return pr, history

def compute_naive_ranking(G):
    nodes = list(G.nodes())
    N = len(nodes)
    if N == 0:
        return {}
    in_degrees = {node: G.in_degree(node) for node in nodes}
    total = sum(in_degrees.values())
    if total == 0:
        return {node: 1.0 / N for node in nodes}
    return {node: count / total for node, count in in_degrees.items()}
''')
print("   ✓ pagerank/pagerank_algo.py")

sample_graph = {
    "nodes": ["A", "B", "C", "D"],
    "edges": [["A", "B"], ["B", "C"], ["C", "A"], ["D", "C"]]
}
with open('backend/data/sample_graph.json', 'w') as f:
    json.dump(sample_graph, f, indent=2)
print("   ✓ data/sample_graph.json")

with open('backend/app.py', 'w') as f:
    f.write('''from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os
from pagerank.graph_builder import build_graph, validate_graph
from pagerank.pagerank_algo import compute_pagerank, compute_naive_ranking

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"status": "running", "message": "PageRank API is active"})

@app.route('/pagerank', methods=['GET'])
def run_pagerank():
    try:
        damping = float(request.args.get('damping', 0.85))
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'sample_graph.json')
        with open(data_path) as f:
            data = json.load(f)
        
        G = build_graph(data)
        stats = validate_graph(G)
        pr, history = compute_pagerank(G, d=damping)
        naive = compute_naive_ranking(G)
        
        sorted_pr = dict(sorted(pr.items(), key=lambda x: x[1], reverse=True))
        sorted_naive = dict(sorted(naive.items(), key=lambda x: x[1], reverse=True))
        
        return jsonify({
            "success": True,
            "damping_factor": damping,
            "graph_stats": stats,
            "final_rank": sorted_pr,
            "naive_rank": sorted_naive,
            "iterations": history,
            "num_iterations": len(history) - 1
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 PageRank API server running on http://localhost:5000")
    app.run(debug=True, port=5000)
''')
print("   ✓ app.py")

# 3. FRONTEND FILES
print("\n⚛️  Creating frontend files...")

with open('frontend/package.json', 'w') as f:
    json.dump({
        "name": "pagerank-frontend",
        "version": "1.0.0",
        "private": True,
        "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1",
            "recharts": "^2.10.0",
            "axios": "^1.6.0",
            "typescript": "^4.9.5",
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0"
        },
        "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build"
        }
    }, f, indent=2)
print("   ✓ package.json")

with open('frontend/tsconfig.json', 'w') as f:
    json.dump({
        "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": True,
            "skipLibCheck": True,
            "esModuleInterop": True,
            "allowSyntheticDefaultImports": True,
            "strict": True,
            "forceConsistentCasingInFileNames": True,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": True,
            "isolatedModules": True,
            "noEmit": True,
            "jsx": "react-jsx"
        },
        "include": ["src"]
    }, f, indent=2)
print("   ✓ tsconfig.json")

with open('frontend/public/index.html', 'w') as f:
    f.write('''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PageRank Visualization</title>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>
''')
print("   ✓ public/index.html")

with open('frontend/src/index.tsx', 'w') as f:
    f.write('''import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
''')
print("   ✓ src/index.tsx")

with open('frontend/src/App.tsx', 'w') as f:
    f.write('''import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎯 PageRank Visualization System</h1>
      <Dashboard />
    </div>
  );
}

export default App;
''')
print("   ✓ src/App.tsx")

with open('frontend/src/api/pagerank.ts', 'w') as f:
    f.write('''import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export interface PageRankResponse {
  success: boolean;
  damping_factor: number;
  graph_stats: any;
  final_rank: Record<string, number>;
  naive_rank: Record<string, number>;
  iterations: Record<string, number>[];
  num_iterations: number;
}

export async function fetchPageRank(damping: number = 0.85): Promise<PageRankResponse> {
  const response = await axios.get(`${API_BASE}/pagerank?damping=${damping}`);
  return response.data;
}
''')
print("   ✓ src/api/pagerank.ts")

with open('frontend/src/components/RankChart.tsx', 'w') as f:
    f.write('''import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RankChartProps {
  pagerank: Record<string, number>;
  naive: Record<string, number>;
}

export default function RankChart({ pagerank, naive }: RankChartProps) {
  const data = Object.keys(pagerank).map(node => ({
    name: node,
    PageRank: pagerank[node],
    Naive: naive[node]
  }));

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>📊 Ranking Comparison</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="PageRank" fill="#8884d8" />
        <Bar dataKey="Naive" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
''')
print("   ✓ src/components/RankChart.tsx")

with open('frontend/src/components/ConvergenceChart.tsx', 'w') as f:
    f.write('''import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ConvergenceChartProps {
  iterations: Record<string, number>[];
}

export default function ConvergenceChart({ iterations }: ConvergenceChartProps) {
  const data = iterations.map((step, i) => ({ iteration: i, ...step }));
  const nodes = iterations.length > 0 ? Object.keys(iterations[0]) : [];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>📈 Convergence Over Iterations</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        {nodes.map((node, i) => (
          <Line key={node} type="monotone" dataKey={node} stroke={colors[i % colors.length]} />
        ))}
      </LineChart>
    </div>
  );
}
''')
print("   ✓ src/components/ConvergenceChart.tsx")

with open('frontend/src/pages/Dashboard.tsx', 'w') as f:
    f.write('''import React, { useState, useEffect } from 'react';
import { fetchPageRank, PageRankResponse } from '../api/pagerank';
import RankChart from '../components/RankChart';
import ConvergenceChart from '../components/ConvergenceChart';

export default function Dashboard() {
  const [data, setData] = useState<PageRankResponse | null>(null);
  const [damping, setDamping] = useState(0.85);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchPageRank(damping);
      setData(result);
    } catch (error) {
      console.error('Error fetching PageRank:', error);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [damping]);

  if (loading) return <div>⏳ Loading...</div>;
  if (!data) return <div>❌ Error loading data</div>;

  return (
    <div>
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>🎛️ Controls</h2>
        <label>
          Damping Factor: {damping}
          <input
            type="range"
            min="0.7"
            max="0.95"
            step="0.05"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', width: '200px' }}
          />
        </label>
        <div style={{ marginTop: '10px' }}>
          <strong>Iterations:</strong> {data.num_iterations} | 
          <strong> Nodes:</strong> {data.graph_stats.num_nodes} | 
          <strong> Edges:</strong> {data.graph_stats.num_edges}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <RankChart pagerank={data.final_rank} naive={data.naive_rank} />
        <ConvergenceChart iterations={data.iterations} />
      </div>
    </div>
  );
}
''')
print("   ✓ src/pages/Dashboard.tsx")

print("\n" + "="*60)
print(" ✅ PROJECT SETUP COMPLETE!")
print("="*60)
print("\n📦 NEXT STEPS:")
print("\n1️⃣  BACKEND SETUP:")
print("   cd backend")
print("   pip install -r requirements.txt")
print("   python app.py")
print("\n2️⃣  FRONTEND SETUP (in new terminal):")
print("   cd frontend")
print("   npm install")
print("   npm start")
print("\n3️⃣  OPEN BROWSER:")
print("   http://localhost:3000")
print("\n" + "="*60)
