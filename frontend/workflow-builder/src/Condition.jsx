
import { Handle, Position } from '@xyflow/react';

function Condition({ data }) {
  const handleInputChange = (field, value) => {
    data.updateNodeData(data.id, {
      [field]: value,
    });
  };

  return (
    <div
      style={{
        width: 260,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        overflow: 'visible',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}
    >
      {/* Input handle: receives data from the previous node */}
      <Handle
        type="target"
        position={Position.Top}
        id="condition-input"
        style={{
          background: '#9333ea',
          width: 10,
          height: 10,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          background: '#f3e8ff',
          borderBottom: '1px solid #e9d5ff',
          borderRadius: '14px 14px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 20 }}>❓</span>

        <strong
          style={{
            fontSize: 15,
            color: '#581c87',
          }}
        >
          CONDITION
        </strong>
      </div>

      {/* Editable configuration */}
      <div style={{ padding: 14 }}>
        {/* Field */}
        <label
          style={{
            display: 'block',
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 6,
          }}
        >
          Field
        </label>

        <input
          value={data.field ?? ''}
          onChange={(e) =>
            handleInputChange('field', e.target.value)
          }
          placeholder="e.g. urgency"
          className="nodrag"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 12,
            outline: 'none',
          }}
        />

        {/* Operator */}
        <label
          style={{
            display: 'block',
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 6,
          }}
        >
          Operator
        </label>

        <select
          value={data.operator ?? 'equals'}
          onChange={(e) =>
            handleInputChange('operator', e.target.value)
          }
          className="nodrag"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 12,
            background: '#ffffff',
            outline: 'none',
          }}
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not equals</option>
          <option value="contains">Contains</option>
          <option value="greater_than">Greater than</option>
          <option value="less_than">Less than</option>
        </select>

        {/* Expected value */}
        <label
          style={{
            display: 'block',
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 6,
          }}
        >
          Expected value
        </label>

        <input
          value={data.value ?? ''}
          onChange={(e) =>
            handleInputChange('value', e.target.value)
          }
          placeholder="e.g. HIGH"
          className="nodrag"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 8,
            outline: 'none',
          }}
        />
      </div>

      {/* TRUE output */}
      <div
        style={{
          position: 'absolute',
          right: -8,
          bottom: 43,
          fontSize: 11,
          fontWeight: 600,
          color: '#15803d',
          background: '#dcfce7',
          borderRadius: 5,
          padding: '3px 6px',
        }}
      >
        TRUE
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{
          left: '30%',
          background: '#16a34a',
          width: 10,
          height: 10,
        }}
      />

      {/* FALSE output */}
      <div
        style={{
          position: 'absolute',
          right: -8,
          bottom: 13,
          fontSize: 11,
          fontWeight: 600,
          color: '#b91c1c',
          background: '#fee2e2',
          borderRadius: 5,
          padding: '3px 6px',
        }}
      >
        FALSE
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{
          left: '70%',
          background: '#dc2626',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

export default Condition;