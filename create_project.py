"""
Complete PageRank Project Setup Script
Creates all directories and files for the project
"""
import os
import json

# Define all directories
directories = [
    'backend',
    'backend/pagerank',
    'backend/data',
    'frontend',
    'frontend/src',
    'frontend/src/components',
    'frontend/src/pages',
    'frontend/src/api'
]

# Create directories
print("📁 Creating directory structure...")
for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"   ✓ {directory}/")

print("\n📝 Creating backend files...")

# 1. backend/requirements.txt
with open('backend/requirements.txt', 'w') as f:
    f.write("""flask
flask-cors
networkx
numpy
""")
print("   ✓ requirements.txt")

# 2. backend/pagerank/__init__.py
with open('backend/pagerank/__init__.py', 'w') as f:
    f.write("# PageRank package\n")
print("   ✓ pagerank/__init__.py")

# 3. backend/pagerank/graph_builder.py
with open('backend/pagerank/graph_builder.py', 'w') as f:
    f.write('''"""
Graph Builder Module
Constructs a directed graph from JSON input
"""
import networkx as nx


def build_graph(data):
    """
    Build a directed graph from JSON data
    
    Args:
        data: Dictionary with 'nodes' (list) and 'edges' (list of [source, target])
    
    Returns:
        NetworkX DiGraph object
    """
    G = nx.DiGraph()
    
    # Add nodes
    for node in data["nodes"]:
        G.add_node(node)
    
    # Add edges
    for edge in data["edges"]:
        if len(edge) == 2:
            G.add_edge(edge[0], edge[1])
    
    return G


def validate_graph(G):
    """
    Validate graph properties
    
    Returns:
        dict with graph statistics
    """
    return {
        "num_nodes": G.number_of_nodes(),
        "num_edges": G.number_of_edges(),
        "is_connected": nx.is_weakly_connected(G),
        "dangling_nodes": [node for node in G.nodes() if G.out_degree(node) == 0]
    }
''')
print("   ✓ pagerank/graph_builder.py")

# 4. backend/pagerank/pagerank_algo.py
with open('backend/pagerank/pagerank_algo.py', 'w') as f:
    f.write('''"""
PageRank Algorithm Implementation
Iterative computation with convergence tracking
"""
import numpy as np


def compute_pagerank(G, d=0.85, max_iter=100, tol=1e-6):
    """
    Compute PageRank using iterative algorithm
    
    Formula: PR(i) = (1-d)/N + d * Σ(PR(j)/L(j))
    
    Args:
        G: NetworkX DiGraph
        d: Damping factor (default 0.85)
        max_iter: Maximum iterations (default 100)
        tol: Convergence tolerance (default 1e-6)
    
    Returns:
        tuple: (final_pagerank_dict, iteration_history)
    """
    nodes = list(G.nodes())
    N = len(nodes)
    
    if N == 0:
        return {}, []
    
    # Initialize: equal probability for all nodes
    pr = {node: 1.0 / N for node in nodes}
    
    # Track history for visualization
    history = []
    history.append(pr.copy())
    
    # Iterative computation
    for iteration in range(max_iter):
        new_pr = {}
        
        for node in nodes:
            # Get all nodes pointing to this node
            incoming = list(G.predecessors(node))
            
            # Sum contributions from incoming nodes
            rank_sum = 0.0
            for nbr in incoming:
                out_degree = G.out_degree(nbr)
                if out_degree > 0:
                    rank_sum += pr[nbr] / out_degree
            
            # Apply PageRank formula
            new_pr[node] = (1 - d) / N + d * rank_sum
        
        # Store iteration result
        history.append(new_pr.copy())
        
        # Check convergence
        converged = all(abs(new_pr[n] - pr[n]) < tol for n in nodes)
        
        pr = new_pr
        
        if converged:
            print(f"✅ Converged after {iteration + 1} iterations")
            break
    
    return pr, history


def compute_naive_ranking(G):
    """
    Compute naive ranking based only on incoming link count
    
    Args:
        G: NetworkX DiGraph
    
    Returns:
        dict: node -> normalized score
    """
    nodes = list(G.nodes())
    N = len(nodes)
    
    if N == 0:
        return {}
    
    # Count incoming links
    in_degrees = {node: G.in_degree(node) for node in nodes}
    
    # Normalize
    total = sum(in_degrees.values())
    if total == 0:
        return {node: 1.0 / N for node in nodes}
    
    return {node: count / total for node, count in in_degrees.items()}
''')
print("   ✓ pagerank/pagerank_algo.py")

# 5. backend/data/sample_graph.json
sample_graph = {
    "nodes": ["A", "B", "C", "D"],
    "edges": [
        ["A", "B"],
        ["B", "C"],
        ["C", "A"],
        ["D", "C"]
    ]
}
with open('backend/data/sample_graph.json', 'w') as f:
    json.dump(sample_graph, f, indent=2)
print("   ✓ data/sample_graph.json")

# 6. backend/app.py
with open('backend/app.py', 'w') as f:
    f.write('''"""
Flask API for PageRank Computation
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from pagerank.graph_builder import build_graph, validate_graph
from pagerank.pagerank_algo import compute_pagerank, compute_naive_ranking

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication


@app.route('/')
def home():
    """API status endpoint"""
    return jsonify({
        "status": "running",
        "message": "PageRank API is active",
        "endpoints": ["/pagerank", "/pagerank/custom"]
    })


@app.route('/pagerank', methods=['GET'])
def run_pagerank():
    """
    Run PageRank on sample graph
    Query params: damping (optional, default 0.85)
    """
    try:
        # Get damping factor from query params
        damping = float(request.args.get('damping', 0.85))
        
        # Load sample graph
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'sample_graph.json')
        with open(data_path, 'r') as f:
            data = json.load(f)
        
        # Build graph
        G = build_graph(data)
        
        # Validate graph
        stats = validate_graph(G)
        
        # Compute PageRank
        pr, history = compute_pagerank(G, d=damping)
        
        # Compute naive ranking for comparison
        naive = compute_naive_ranking(G)
        
        # Sort by rank
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
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/pagerank/custom', methods=['POST'])
def run_custom_pagerank():
    """
    Run PageRank on custom graph
    Body: JSON with 'nodes' and 'edges' arrays
    """
    try:
        data = request.get_json()
        
        if not data or 'nodes' not in data or 'edges' not in data:
            return jsonify({
                "success": False,
                "error": "Invalid input. Required: {nodes: [], edges: []}"
            }), 400
        
        # Get damping factor
        damping = float(data.get('damping', 0.85))
        
        # Build graph
        G = build_graph(data)
        
        # Validate
        stats = validate_graph(G)
        
        # Compute PageRank
        pr, history = compute_pagerank(G, d=damping)
        
        # Compute naive
        naive = compute_naive_ranking(G)
        
        # Sort
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
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Starting PageRank API server...")
    print("📊 Sample graph loaded: A -> B -> C -> A, D -> C")
    print("🌐 Server running on http://localhost:5000")
    print("\\nAvailable endpoints:")
    print("  GET  /pagerank          - Run on sample graph")
    print("  POST /pagerank/custom   - Run on custom graph")
    app.run(debug=True, port=5000)
''')
print("   ✓ app.py")

print("\n✅ Backend structure created successfully!")
print("\n📦 Next steps:")
print("   1. cd backend")
print("   2. pip install -r requirements.txt")
print("   3. python app.py")
print("\n🎯 Frontend setup will be created next...")
