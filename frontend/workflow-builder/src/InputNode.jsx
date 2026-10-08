import { Handle, Position } from '@xyflow/react';

function InputNode({data}) {
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
        <span style={{ fontSize: 20 }}>Input</span>

        <strong
          style={{
            fontSize: 15,
            color: '#581c87'
          }}
        >
          Trigger
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
          INPUT
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
          value={data.input || ''}
          onChange={(e) =>
            data.updateNodeData(
              data.id,
              {
                input: e.target.value
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

    
       <Handle type="source" position={Position.Bottom}/>
       
        
    </div>
    );

}
export default InputNode;
