# 🚀 PageRank Project - Quick Start Guide

## ✅ What's Been Created

Your complete PageRank visualization system is ready! Here's what you have:

### 📁 Project Structure

```
MM EL/
├── backend/              ← Python API (Flask + NetworkX)
│   ├── pagerank/        ← Algorithm modules
│   ├── data/            ← Sample graph
│   └── app.py           ← REST API
│
├── frontend/            ← React TypeScript UI
│   ├── src/
│   │   ├── components/  ← Charts
│   │   ├── pages/       ← Dashboard
│   │   └── api/         ← API client
│   └── package.json
│
├── SETUP_ALL.py         ← Master setup script
└── SETUP.bat            ← Windows quick setup
```

## 🎯 Core Features Implemented

✅ **PageRank Algorithm**

- Iterative computation with formula: PR(i) = (1-d)/N + d \* Σ(PR(j)/L(j))
- Convergence tracking (tolerance: 1e-6, max 100 iterations)
- Full iteration history for visualization

✅ **Naive Ranking Comparison**

- Simple incoming link counting
- Side-by-side comparison with PageRank

✅ **Damping Factor Experiments**

- Interactive slider (0.7 to 0.95)
- Real-time recomputation
- See how damping affects rankings

✅ **Visualization Dashboard**

- Bar chart: PageRank vs Naive ranking
- Line chart: Convergence over iterations
- Graph statistics display

✅ **REST API**

- GET /pagerank?damping=0.85
- POST /pagerank/custom (for custom graphs)
- Full CORS support

## 🚦 How to Run

### Option 1: Quick Setup (Windows)

```batch
# Double-click SETUP.bat or run:
SETUP.bat
```

### Option 2: Manual Setup

#### Step 1: Run Setup Script

```bash
python SETUP_ALL.py
```

#### Step 2: Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on: http://localhost:5000

#### Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend will open at: http://localhost:3000

## 🧪 Sample Graph

The system comes with a pre-configured graph:

```
A → B → C → A
    ↑
    D
```

Expected PageRank (d=0.85):

- **C: ~0.35** (highest - receives links from B and D)
- **A: ~0.28**
- **B: ~0.22**
- **D: ~0.15** (lowest - no incoming links)

## 🎮 Using the Dashboard

1. **Adjust Damping Factor**: Use the slider (0.7 to 0.95)
   - Lower values: More uniform distribution
   - Higher values: More emphasis on link structure

2. **View Rankings**: Bar chart shows PageRank vs Naive side-by-side
   - Blue: PageRank algorithm
   - Green: Naive (simple link counting)

3. **Watch Convergence**: Line chart shows how scores evolve
   - Each line represents a node
   - See how quickly the algorithm converges

4. **Check Stats**: Top panel shows:
   - Number of iterations to convergence
   - Total nodes and edges
   - Current damping factor

## 📊 API Examples

### Get PageRank with default damping (0.85)

```bash
curl http://localhost:5000/pagerank
```

### Get PageRank with custom damping

```bash
curl "http://localhost:5000/pagerank?damping=0.7"
```

### Submit custom graph

```bash
curl -X POST http://localhost:5000/pagerank/custom \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": ["A", "B", "C"],
    "edges": [["A", "B"], ["B", "C"], ["C", "A"]],
    "damping": 0.85
  }'
```

## 🔧 Project Files

| File                                           | Purpose                        |
| ---------------------------------------------- | ------------------------------ |
| `backend/pagerank/graph_builder.py`            | Graph construction from JSON   |
| `backend/pagerank/pagerank_algo.py`            | Core algorithm + naive ranking |
| `backend/app.py`                               | Flask REST API                 |
| `backend/data/sample_graph.json`               | Example graph data             |
| `frontend/src/components/RankChart.tsx`        | Bar chart component            |
| `frontend/src/components/ConvergenceChart.tsx` | Line chart component           |
| `frontend/src/pages/Dashboard.tsx`             | Main UI page                   |
| `frontend/src/api/pagerank.ts`                 | API client service             |

## 🎨 Tech Stack

**Backend:**

- Python 3.x
- Flask (REST API)
- NetworkX (graph operations)
- NumPy (numerical computations)
- Flask-CORS (cross-origin requests)

**Frontend:**

- React 18
- TypeScript
- Recharts (data visualization)
- Axios (HTTP client)

## 🧮 The Math

### PageRank Formula

```
PR(i) = (1-d)/N + d * Σ(PR(j)/L(j))
```

Where:

- **PR(i)**: PageRank of node i
- **d**: Damping factor (0.85 = 85% follow links, 15% random jump)
- **N**: Total number of nodes
- **PR(j)**: PageRank of nodes pointing to i
- **L(j)**: Number of outgoing links from node j

### Convergence Criterion

```
|PR_new(i) - PR_old(i)| < 1e-6  for all nodes i
```

## ⚠️ Common Issues

**Backend won't start?**

- Ensure Python 3.x is installed: `python --version`
- Install dependencies: `pip install -r backend/requirements.txt`

**Frontend won't start?**

- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install` (in frontend/ directory)

**Charts not loading?**

- Check backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled in backend

**Port already in use?**

- Change backend port in `backend/app.py`: `app.run(port=5001)`
- Update frontend API URL in `frontend/src/api/pagerank.ts`

## 🚀 Next Steps

**Want to experiment?**

1. Edit `backend/data/sample_graph.json` with your own graph
2. Restart backend to see new results
3. Try different graph topologies:
   - Cyclic graphs
   - Star topology
   - Fully connected graphs
   - Graphs with dangling nodes

**Want to extend?**

- Add graph visualization with D3.js
- Implement personalized PageRank
- Add more sample graphs
- Export results to CSV
- Add Monte Carlo simulation comparison

## 📚 References

- Original PageRank paper: [The PageRank Citation Ranking](http://ilpubs.stanford.edu:8090/422/)
- NetworkX docs: https://networkx.org/
- Recharts docs: https://recharts.org/

---

**Built with ❤️ using Python + React + TypeScript**
