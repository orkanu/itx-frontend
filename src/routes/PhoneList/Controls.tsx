import React from 'react';

interface ControlProps {
  value?: string,
  setValue?: (val: string) => void,
}

const Controls = ({ value, setValue }: ControlProps) => {
  return(
    <div className="controls" role="region" aria-labelledby="phones-heading">
      <h2 id="phones-heading">Phones</h2>
      <label
        htmlFor="phone-filter"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Filter phones by brand or model
      </label>
      <input
        id="phone-filter"
        type="search"
        role="searchbox"
        placeholder="Filter by brand or model (type 3+ chars)"
        aria-describedby="phone-filter-help"
        value={value}
        onChange={(e) => setValue && setValue(e.target.value)}
      />
      <p
        id="phone-filter-help"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Type at least 3 characters to filter the list.
      </p>
    </div>
  )
}

export default Controls
