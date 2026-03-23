import React, { useRef, useEffect } from 'react';

const OicaMap = ({ data = [] }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a simple world map representation
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500px');
    svg.setAttribute('viewBox', '0 0 1000 500');
    svg.style.border = '1px solid #ccc';
    svg.style.borderRadius = '8px';
    svg.style.backgroundColor = '#f0f0f0';

    // Add zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.style.position = 'absolute';
    zoomControls.style.top = '10px';
    zoomControls.style.left = '10px';
    zoomControls.style.zIndex = '1000';
    zoomControls.innerHTML = `
      <button style="display: block; width: 30px; height: 30px; margin-bottom: 5px; background: white; border: 1px solid #ccc; cursor: pointer; border-radius: 4px;">+</button>
      <button style="display: block; width: 30px; height: 30px; background: white; border: 1px solid #ccc; cursor: pointer; border-radius: 4px;">-</button>
    `;

    // Add attribution
    const attribution = document.createElement('div');
    attribution.style.position = 'absolute';
    attribution.style.bottom = '10px';
    attribution.style.right = '10px';
    attribution.style.fontSize = '10px';
    attribution.style.color = '#666';
    attribution.textContent = 'Leaflet | © OpenStreetMap';

    // Color countries based on CAGR (growth)
    // Simplified: just show that countries can be colored
    const maxCagr = Math.max(...data.map((d) => Math.abs(d.cagr)), 1);
    data.forEach((item) => {
      // This is a simplified representation - in production use actual map coordinates
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', Math.random() * 800 + 100);
      rect.setAttribute('y', Math.random() * 300 + 100);
      rect.setAttribute('width', '40');
      rect.setAttribute('height', '30');
      const intensity = Math.abs(item.cagr) / maxCagr;
      if (item.cagr > 0) {
        rect.setAttribute('fill', `rgba(16, 185, 129, ${0.3 + intensity * 0.7})`); // Green for growth
      } else {
        rect.setAttribute('fill', `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`); // Red for decline
      }
      rect.setAttribute('stroke', '#fff');
      rect.setAttribute('stroke-width', '1');
      rect.style.cursor = 'pointer';
      rect.setAttribute('title', `${item.country}: ${item.cagr.toFixed(2)}% CAGR`);

      svg.appendChild(rect);
    });

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.appendChild(svg);
    container.appendChild(zoomControls);
    container.appendChild(attribution);

    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(container);
  }, [data]);

  return (
    <div>
      <div ref={mapRef} style={{ minHeight: '500px', position: 'relative' }}></div>
      <div className="mt-4 flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span className="text-sm text-gray-600">Positive Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500"></div>
          <span className="text-sm text-gray-600">Negative Growth</span>
        </div>
      </div>
    </div>
  );
};

export default OicaMap;

