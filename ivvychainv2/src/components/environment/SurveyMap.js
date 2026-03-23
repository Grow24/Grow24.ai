import React, { useRef, useEffect } from 'react';

const SurveyMap = ({ geoData = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Simple map placeholder - in production, use Leaflet or similar
    if (!mapRef.current) return;

    // Create a simple SVG map representation
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500px');
    svg.setAttribute('viewBox', '0 0 800 500');
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
      <button style="display: block; width: 30px; height: 30px; margin-bottom: 5px; background: white; border: 1px solid #ccc; cursor: pointer;">+</button>
      <button style="display: block; width: 30px; height: 30px; background: white; border: 1px solid #ccc; cursor: pointer;">-</button>
    `;

    // Add map attribution
    const attribution = document.createElement('div');
    attribution.style.position = 'absolute';
    attribution.style.bottom = '10px';
    attribution.style.right = '10px';
    attribution.style.fontSize = '10px';
    attribution.style.color = '#666';
    attribution.textContent = 'Leaflet | © OpenStreetMap';

    // Plot markers (simplified - in production use actual map library)
    geoData.forEach((point) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      // Convert lat/lng to approximate x/y (simplified projection)
      const x = ((point.lng + 180) / 360) * 800;
      const y = ((90 - point.lat) / 180) * 500;
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', Math.min(point.count / 2, 30));
      circle.setAttribute('fill', point.count > 50 ? '#F59E0B' : '#10B981');
      circle.setAttribute('opacity', '0.7');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';
      circle.setAttribute('title', `${point.territory}: ${point.count} completed`);

      svg.appendChild(circle);

      // Add text label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y - Math.min(point.count / 2, 30) - 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#333');
      text.textContent = point.count;
      svg.appendChild(text);
    });

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.appendChild(svg);
    container.appendChild(zoomControls);
    container.appendChild(attribution);

    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(container);

    mapInstanceRef.current = { svg, container };
  }, [geoData]);

  return (
    <div>
      <div ref={mapRef} style={{ minHeight: '500px', position: 'relative' }}></div>
      <div className="mt-4 text-sm text-gray-600">
        Map showing survey completion counts by territory. Click markers for details.
      </div>
    </div>
  );
};

export default SurveyMap;

