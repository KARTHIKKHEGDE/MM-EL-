"""
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


def handle_dangling_nodes(G, pr):
    """
    Handle nodes with no outgoing edges (dangling nodes)
    Distribute their PageRank equally to all nodes
    
    Args:
        G: NetworkX DiGraph
        pr: Current PageRank dict
    
    Returns:
        float: Dangling contribution per node
    """
    N = len(G.nodes())
    dangling_sum = sum(pr[node] for node in G.nodes() if G.out_degree(node) == 0)
    return dangling_sum / N if N > 0 else 0
