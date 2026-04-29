"""Graph Builder Module"""
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
