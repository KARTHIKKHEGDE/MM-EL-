import React, { useState } from 'react';

interface CustomGraphInputProps {
  onSubmit: (nodes: string[], edges: [string, string][]) => void;
  onCancel: () => void;
}

export default function CustomGraphInput({ onSubmit, onCancel }: CustomGraphInputProps) {
  const [nodesText, setNodesText] = useState('Google\nFacebook\nTwitter\nLinkedIn');
  const [edgesText, setEdgesText] = useState('Google,Facebook\nFacebook,Twitter\nTwitter,LinkedIn\nLinkedIn,Google');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    try {
      // Parse nodes
      const nodes = nodesText.split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      if (nodes.length < 2) {
        setError('Please enter at least 2 nodes');
        return;
      }

      // Parse edges
      const edges: [string, string][] = edgesText.split('\n')
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .map(e => {
          const [from, to] = e.split(',').map(n => n.trim());
          if (!from || !to) {
            throw new Error(`Invalid edge format: ${e}`);
          }
          if (!nodes.includes(from) || !nodes.includes(to)) {
            throw new Error(`Edge references non-existent node: ${e}`);
          }
          return [from, to] as [string, string];
        });

      if (edges.length < 1) {
        setError('Please enter at least 1 edge');
        return;
      }

      setError(null);
      onSubmit(nodes, edges);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>🎨 Create Custom Graph</h2>
        
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#555'
          }}>
            Nodes (one per line):
          </label>
          <textarea
            value={nodesText}
            onChange={(e) => setNodesText(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Google&#10;Facebook&#10;Twitter"
          />
          <small style={{ color: '#666' }}>
            Enter each node name on a new line
          </small>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#555'
          }}>
            Edges (format: from,to):
          </label>
          <textarea
            value={edgesText}
            onChange={(e) => setEdgesText(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Google,Facebook&#10;Facebook,Twitter"
          />
          <small style={{ color: '#666' }}>
            Enter each edge as: SourceNode,TargetNode (one per line)
          </small>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#8884d8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#7773c7'}
            onMouseOut={(e) => e.currentTarget.style.background = '#8884d8'}
          >
            ✓ Apply Graph
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
