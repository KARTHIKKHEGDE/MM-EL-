import axios from "axios";

const API_BASE = "http://localhost:5000";

export interface GraphInfo {
  id: string;
  name: string;
  description: string;
  num_nodes: number;
  num_edges: number;
}

export interface PageRankResponse {
  success: boolean;
  graph_name: string;
  graph_description: string;
  damping_factor: number;
  graph_stats: {
    num_nodes: number;
    num_edges: number;
    is_connected: boolean;
    dangling_nodes: string[];
  };
  final_rank: Record<string, number>;
  naive_rank: Record<string, number>;
  iterations: Record<string, number>[];
  num_iterations: number;
  nodes: string[];
  edges: [string, string][];
}

export async function listGraphs(): Promise<GraphInfo[]> {
  try {
    const response = await axios.get(`${API_BASE}/graphs`);
    return response.data.graphs;
  } catch (error) {
    console.error("Error listing graphs:", error);
    throw error;
  }
}

export async function fetchPageRank(
  damping: number = 0.85,
  graphId: string = "sample_graph"
): Promise<PageRankResponse> {
  try {
    const response = await axios.get(`${API_BASE}/pagerank?damping=${damping}&graph=${graphId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PageRank:", error);
    throw error;
  }
}

export async function fetchCustomPageRank(
  nodes: string[],
  edges: [string, string][],
  damping: number = 0.85
): Promise<PageRankResponse> {
  try {
    const response = await axios.post(`${API_BASE}/pagerank/custom`, {
      nodes,
      edges,
      damping
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching custom PageRank:", error);
    throw error;
  }
}
