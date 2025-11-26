import React from 'react';

interface ControlProps {
  value?: string,
  setValue?: (val: string) => void,
}

const Controls = ({ value, setValue }: ControlProps) => {
  return(
    <div className="controls">
      <span>Phones</span>
      <input
        placeholder="Filter by brand or model (type 3+ chars)"
        value={value}
        onChange={(e) => setValue && setValue(e.target.value)}
      />
    </div>
  )
}

export default Controls
