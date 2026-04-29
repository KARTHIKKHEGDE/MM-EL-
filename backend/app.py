"""
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


@app.route('/graphs', methods=['GET'])
def list_graphs():
    """
    List available sample graphs
    """
    try:
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        graphs = []
        
        for filename in os.listdir(data_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(data_dir, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                    graphs.append({
                        "id": filename.replace('.json', ''),
                        "name": data.get("name", filename),
                        "description": data.get("description", ""),
                        "num_nodes": len(data.get("nodes", [])),
                        "num_edges": len(data.get("edges", []))
                    })
        
        return jsonify({
            "success": True,
            "graphs": graphs
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/pagerank', methods=['GET'])
def run_pagerank():
    """
    Run PageRank on sample graph
    Query params: 
      - damping (optional, default 0.85)
      - graph (optional, default 'sample_graph')
    """
    try:
        # Get damping factor from query params
        damping = float(request.args.get('damping', 0.85))
        graph_name = request.args.get('graph', 'sample_graph')
        
        # Load sample graph
        data_path = os.path.join(os.path.dirname(__file__), 'data', f'{graph_name}.json')
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
            "graph_name": "Custom Graph",
            "graph_description": "User-provided custom graph",
            "damping_factor": damping,
            "graph_stats": stats,
            "final_rank": sorted_pr,
            "naive_rank": sorted_naive,
            "iterations": history,
            "num_iterations": len(history) - 1,
            "nodes": data["nodes"],
            "edges": data["edges"]
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Starting PageRank API server...")
    print("🌐 Server running on http://localhost:5000")
    print("\n📊 Available sample graphs:")
    print("  • Wikipedia Pages Network")
    print("  • News Website Network")
    print("  • Social Media Network")
    print("  • Tech Companies Network")
    print("\n🔌 Available endpoints:")
    print("  GET  /graphs            - List all available graphs")
    print("  GET  /pagerank          - Run on sample graph")
    print("  POST /pagerank/custom   - Run on custom graph")
    app.run(debug=True, port=5000)
