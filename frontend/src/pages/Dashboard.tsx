import React, { useState, useEffect } from 'react';
import { fetchPageRank, fetchCustomPageRank, listGraphs, PageRankResponse, GraphInfo } from '../api/pagerank';
import RankChart from '../components/RankChart';
import ConvergenceChart from '../components/ConvergenceChart';
import CustomGraphInput from '../components/CustomGraphInput';
import InteractivePageRank from '../components/InteractivePageRank';

export default function Dashboard() {
  const [data, setData] = useState<PageRankResponse | null>(null);
  const [graphs, setGraphs] = useState<GraphInfo[]>([]);
  const [selectedGraph, setSelectedGraph] = useState('wikipedia_graph');
  const [damping, setDamping] = useState(0.85);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    loadGraphList();
  }, []);

  useEffect(() => {
    if (selectedGraph) {
      loadData();
    }
  }, [damping, selectedGraph]);

  const loadGraphList = async () => {
    try {
      const graphList = await listGraphs();
      setGraphs(graphList);
    } catch (err) {
      console.error('Error loading graph list:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPageRank(damping, selectedGraph);
      setData(result);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the server is running on http://localhost:5000');
      console.error('Error fetching PageRank:', err);
    }
    setLoading(false);
  };

  const handleCustomGraph = async (nodes: string[], edges: [string, string][]) => {
    setLoading(true);
    setError(null);
    setShowCustomInput(false);
    try {
      const result = await fetchCustomPageRank(nodes, edges, damping);
      setData(result);
      setSelectedGraph('custom');
    } catch (err: any) {
      setError('Error processing custom graph: ' + (err.response?.data?.error || err.message));
      console.error('Error with custom graph:', err);
    }
    setLoading(false);
  };

  if (loading && !data) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px',
        fontSize: '18px',
        color: '#666'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        Loading PageRank data...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ 
        background: '#fee', 
        border: '2px solid #fcc',
        borderRadius: '12px',
        padding: '30px',
        color: '#c33',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>❌ Connection Error</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '16px' }}>{error}</p>
        <button 
          onClick={loadData}
          style={{
            padding: '12px 30px',
            background: '#c33',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {showCustomInput && (
        <CustomGraphInput
          onSubmit={handleCustomGraph}
          onCancel={() => setShowCustomInput(false)}
        />
      )}

      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '25px',
        color: 'white',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          📊 {data.graph_name}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {data.graph_description}
        </p>
      </div>

      {/* Graph Selector & Controls */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '25px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Graph Selection */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px'
            }}>
              📚 Select Graph Dataset:
            </label>
            <select
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {graphs.map(graph => (
                <option key={graph.id} value={graph.id}>
                  {graph.name} ({graph.num_nodes} nodes, {graph.num_edges} edges)
                </option>
              ))}
            </select>
          </div>

          {/* Custom Graph Button */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px'
            }}>
              🎨 Or Create Your Own:
            </label>
            <button
              onClick={() => setShowCustomInput(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
            >
              ➕ Custom Graph Input
            </button>
          </div>
        </div>

        {/* Damping Factor Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#333',
            fontSize: '14px'
          }}>
            🎛️ Damping Factor: <span style={{ 
              color: '#8884d8',
              fontSize: '18px',
              background: 'white',
              padding: '2px 12px',
              borderRadius: '6px',
              marginLeft: '8px'
            }}>{damping.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.70"
            max="0.95"
            step="0.05"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            disabled={loading}
            style={{ 
              width: '100%',
              height: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#888',
            marginTop: '5px'
          }}>
            <span>0.70 (Random)</span>
            <span>0.85 (Default)</span>
            <span>0.95 (Follow Links)</span>
          </div>
          <p style={{ 
            marginTop: '10px', 
            fontSize: '13px', 
            color: '#666',
            background: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <strong>💡 What is damping?</strong> It represents the probability a user follows a link (vs. jumping to a random page). 
            Higher = more emphasis on link structure.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ 
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #8884d8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>Iterations</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8884d8' }}>
              {data.num_iterations}
            </div>
          </div>
          <div style={{ 
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #82ca9d',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>Nodes</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#82ca9d' }}>
              {data.graph_stats.num_nodes}
            </div>
          </div>
          <div style={{ 
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #ffc658',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>Edges</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc658' }}>
              {data.graph_stats.num_edges}
            </div>
          </div>
          <div style={{ 
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            border: `2px solid ${data.graph_stats.is_connected ? '#82ca9d' : '#ff7c7c'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>Connected</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: data.graph_stats.is_connected ? '#82ca9d' : '#ff7c7c' }}>
              {data.graph_stats.is_connected ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: '#fff3cd',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffc107'
        }}>
          ⏳ Recalculating PageRank...
        </div>
      )}

      <div style={{
        background: '#0f1322',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '25px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#e9ecf8' }}>
          Interactive PageRank Simulator
        </h3>
        <p style={{ margin: '0 0 16px 0', color: '#aab2c8', fontSize: '14px' }}>
          Add sites, connect links, drag nodes, and step through iterations to see
          the probability flow.
        </p>
        <InteractivePageRank />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
        <RankChart pagerank={data.final_rank} naive={data.naive_rank} />
        <ConvergenceChart iterations={data.iterations} />
      </div>

      {/* Footer Explanation */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '12px',
        fontSize: '14px',
        color: '#333',
        border: '1px solid #b0c4de'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>
          📐 PageRank Formula:
        </div>
        <code style={{
          display: 'block',
          background: 'rgba(255,255,255,0.7)',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontFamily: 'monospace'
        }}>
          PR(page) = (1-d)/N + d × Σ(PR(linking_page) / OutLinks(linking_page))
        </code>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div><strong>d</strong> = Damping factor ({damping})</div>
          <div><strong>N</strong> = Total nodes ({data.graph_stats.num_nodes})</div>
          <div><strong>Convergence</strong> = Tolerance 1e-6</div>
        </div>
      </div>
    </div>
  );
}
