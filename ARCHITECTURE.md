# PageRank System Architecture

## 📐 System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                      (Web Browser)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP Requests
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + TS)                      │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │ Dashboard  │→ │  RankChart  │  │ ConvergenceChart │     │
│  │   Page     │  │  Component  │  │    Component     │     │
│  └─────┬──────┘  └─────────────┘  └──────────────────┘     │
│        │                                                      │
│        ▼                                                      │
│  ┌────────────────────────────────────────┐                 │
│  │  API Client (pagerank.ts)              │                 │
│  │  - fetchPageRank(damping)              │                 │
│  │  - axios HTTP client                   │                 │
│  └────────────────┬───────────────────────┘                 │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ GET /pagerank?damping=0.85
                    │ POST /pagerank/custom
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Python + Flask)                   │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │          Flask REST API (app.py)           │             │
│  │  - CORS enabled                            │             │
│  │  - Routes: /pagerank, /pagerank/custom     │             │
│  └───────┬────────────────────────────────────┘             │
│          │                                                    │
│          ▼                                                    │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   graph_builder.py   │    │  pagerank_algo.py    │      │
│  │ ┌─────────────────┐  │    │ ┌─────────────────┐  │      │
│  │ │ build_graph()   │  │    │ │compute_pagerank()│ │      │
│  │ │ validate_graph()│  │    │ │compute_naive()  │  │      │
│  │ └─────────────────┘  │    │ └─────────────────┘  │      │
│  │  - NetworkX DiGraph  │    │  - Iterative algo    │      │
│  │  - Graph validation  │    │  - Convergence check │      │
│  └──────────────────────┘    └──────────────────────┘      │
│          │                              │                     │
│          ▼                              ▼                     │
│  ┌────────────────────────────────────────────┐             │
│  │        sample_graph.json                   │             │
│  │  {"nodes": ["A","B","C","D"],             │             │
│  │   "edges": [["A","B"],["B","C"],...]}     │             │
│  └────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. User Interaction

```
User adjusts damping slider (0.7 - 0.95)
  ↓
Dashboard component updates state
  ↓
useEffect triggers API call
```

### 2. API Request

```
fetchPageRank(damping) called
  ↓
axios.get('http://localhost:5000/pagerank?damping=0.85')
  ↓
Request sent to Flask backend
```

### 3. Backend Processing

```
Flask receives request
  ↓
Load graph data (JSON)
  ↓
build_graph() → NetworkX DiGraph
  ↓
validate_graph() → Check structure
  ↓
compute_pagerank(G, d=damping)
  │
  ├─ Initialize: PR = 1/N for all nodes
  ├─ Loop (max 100 iterations):
  │    ├─ For each node i:
  │    │    └─ PR_new(i) = (1-d)/N + d * Σ(PR(j)/L(j))
  │    ├─ Check convergence: |PR_new - PR_old| < 1e-6
  │    └─ Store iteration in history[]
  │
  └─ Return (final_PR, history)
  ↓
compute_naive_ranking(G)
  ↓
Sort results by rank
  ↓
Return JSON response
```

### 4. Response Structure

```json
{
  "success": true,
  "damping_factor": 0.85,
  "graph_stats": {
    "num_nodes": 4,
    "num_edges": 4,
    "is_connected": true,
    "dangling_nodes": []
  },
  "final_rank": {
    "C": 0.349,
    "A": 0.283,
    "B": 0.227,
    "D": 0.141
  },
  "naive_rank": {
    "C": 0.5,
    "A": 0.25,
    "B": 0.25,
    "D": 0.0
  },
  "iterations": [
    {"A": 0.25, "B": 0.25, "C": 0.25, "D": 0.25},
    {"A": 0.213, "B": 0.213, "C": 0.394, "D": 0.181},
    ...
  ],
  "num_iterations": 23
}
```

### 5. Frontend Rendering

```
Data received in Dashboard
  ↓
Pass to chart components
  ↓
RankChart: Recharts BarChart
  - Transform data: [{name: "A", PageRank: 0.28, Naive: 0.25}, ...]
  - Render bars
  ↓
ConvergenceChart: Recharts LineChart
  - Transform data: [{iteration: 0, A: 0.25, B: 0.25, ...}, ...]
  - Render lines for each node
```

## 🎯 Component Hierarchy

```
App
 └─ Dashboard
     ├─ Controls Section
     │   └─ Damping Factor Slider
     ├─ Stats Display
     │   ├─ Iterations
     │   ├─ Nodes Count
     │   └─ Edges Count
     ├─ RankChart
     │   └─ BarChart (Recharts)
     │       ├─ PageRank Bars (blue)
     │       └─ Naive Bars (green)
     └─ ConvergenceChart
         └─ LineChart (Recharts)
             ├─ Line for Node A
             ├─ Line for Node B
             ├─ Line for Node C
             └─ Line for Node D
```

## 🧮 Algorithm Steps

### PageRank Iteration

```
Input: Graph G, damping d, tolerance tol
Output: PageRank scores PR, iteration history

1. Initialize:
   PR(v) = 1/N for all nodes v
   history = [PR.copy()]

2. Repeat until convergence:
   a. For each node i:
      - incoming = nodes pointing to i
      - sum = Σ(PR(j)/outDegree(j)) for j in incoming
      - PR_new(i) = (1-d)/N + d * sum

   b. history.append(PR_new.copy())

   c. If |PR_new(i) - PR(i)| < tol for all i:
      - CONVERGED → break

   d. PR = PR_new

3. Return (PR, history)
```

### Naive Ranking

```
Input: Graph G
Output: Normalized in-degree scores

1. For each node v:
   score(v) = inDegree(v)

2. total = Σ score(v)

3. For each node v:
   normalized(v) = score(v) / total

4. Return normalized
```

## 🔧 Configuration Points

| Component           | Configuration   | Default  |
| ------------------- | --------------- | -------- |
| Backend API         | Port            | 5000     |
| Frontend Dev Server | Port            | 3000     |
| PageRank            | Damping factor  | 0.85     |
| PageRank            | Max iterations  | 100      |
| PageRank            | Tolerance       | 1e-6     |
| CORS                | Allowed origins | \* (all) |

## 🚀 Deployment Considerations

**Backend:**

- Use production WSGI server (Gunicorn, uWSGI)
- Set `debug=False` in production
- Configure proper CORS origins
- Add request rate limiting
- Add input validation/sanitization

**Frontend:**

- Build optimized bundle: `npm run build`
- Serve static files via nginx/Apache
- Update API_BASE to production URL
- Enable HTTPS
- Add error boundaries

## 📊 Performance Characteristics

| Operation          | Complexity      | Notes                         |
| ------------------ | --------------- | ----------------------------- |
| Graph construction | O(V + E)        | V=nodes, E=edges              |
| PageRank iteration | O(V + E)        | Per iteration                 |
| Convergence        | O(k \* (V + E)) | k=iterations (~20-30 typical) |
| Sorting results    | O(V log V)      | For display                   |
| JSON serialization | O(k \* V)       | History array                 |

**Typical performance:**

- 100 nodes: <100ms
- 1000 nodes: <1s
- 10000 nodes: <10s

## 🔐 Security Notes

**Input validation needed for:**

- Custom graph size limits
- Edge validation (prevent self-loops?)
- Damping factor bounds (0.7 - 0.95)
- JSON structure validation

**Production hardening:**

- API authentication (if public)
- Rate limiting per IP
- Input sanitization
- Error message sanitization (don't leak internals)
