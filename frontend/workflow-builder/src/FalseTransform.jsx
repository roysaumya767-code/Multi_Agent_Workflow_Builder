import { Handle, Position } from '@xyflow/react';

function FalseTransformNode({ data }) {
  const handleInputChange = (field, value) => {
    data.updateNodeData(data.id, {
      [field]: value,
    });
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: 8,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    marginBottom: 12,
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        width: 260,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #fecaca',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        overflow: 'visible',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="transform-input"
        style={{
          background: '#dc2626',
          width: 10,
          height: 10,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          background: '#fee2e2',
          borderBottom: '1px solid #fecaca',
          borderRadius: '14px 14px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 20 }}>❌</span>
        <strong style={{ fontSize: 15, color: '#991b1b' }}>
          FALSE TRANSFORM
        </strong>
      </div>

      <div style={{ padding: 14 }}>
        <label style={labelStyle}>Input</label>
        <input
          value={data.input ?? ''}
          onChange={(e) =>
            handleInputChange('input', e.target.value)
          }
          placeholder="{{condition_1.output.text}}"
          className="nodrag"
          style={inputStyle}
        />

        <label style={labelStyle}>Operation</label>
        <input
          value={data.operation ?? ''}
          onChange={(e) =>
            handleInputChange('operation', e.target.value)
          }
          placeholder="e.g. uppercase"
          className="nodrag"
          style={inputStyle}
        />

        <label style={labelStyle}>Field / Key</label>
        <input
          value={data.key ?? data.field ?? ''}
          onChange={(e) =>
            handleInputChange('key', e.target.value)
          }
          placeholder="e.g. title"
          className="nodrag"
          style={inputStyle}
        />
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="transform-output"
        style={{
          background: '#16a34a',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

export default FalseTransformNode;