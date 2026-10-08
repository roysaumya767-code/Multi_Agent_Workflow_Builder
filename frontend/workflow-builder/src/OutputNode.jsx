import { Handle, Position } from '@xyflow/react';

function OutputNode({data}) {
    return (
       <div
      style={{
        width: 260,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif'
      }}>
        
         <Handle type="target" position={Position.Top}/>
     
          <div
        style={{
          padding: '12px 14px',
          background: '#f3e8ff',
          borderBottom: '1px solid #e9d5ff',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span style={{ fontSize: 20 }}></span>

        <strong
          style={{
            fontSize: 15,
            color: '#581c87'
          }}
        >
          OUTPUT
        </strong>
      </div>

      
      <div style={{ padding: 14 }}>

        <div
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 4
          }}
        >
          Output
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#111827',
            marginBottom: 12
          }}
        >
           <input
          value={data.output || ''}
          onChange={(e) =>
            data.updateNodeData(
              data.id,
              {
                output: e.target.value
              }
            )
          }
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 12,
            outline: 'none'
          }}
        />
        </div>

       </div>

        
       
        
    </div>
    );

}
export default OutputNode;
