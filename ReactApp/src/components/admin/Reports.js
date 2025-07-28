// client/src/components/admin/Reports.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Reports = () => {
  const trendRef  = useRef(null);
  const pieRef    = useRef(null);
  const genderRef = useRef(null);

  // ————— Dummy data —————
  const monthlyTrendData = [
    { month: '2025-01', count: 5 },
    { month: '2025-02', count: 12 },
    { month: '2025-03', count: 8 },
    { month: '2025-04', count: 15 },
    { month: '2025-05', count: 20 },
    { month: '2025-06', count: 18 },
    { month: '2025-07', count: 22 },
  ];

  const vaccineDistData = [
    { vaccine: 'Pfizer',  count: 40 },
    { vaccine: 'Moderna', count: 25 },
    { vaccine: 'J&J',     count: 15 },
    { vaccine: 'Novavax', count: 10 },
  ];

  const monthlyGenderData = [
    { month: '2025-01', Male: 2,  Female: 3 },
    { month: '2025-02', Male: 6,  Female: 6 },
    { month: '2025-03', Male: 4,  Female: 4 },
    { month: '2025-04', Male: 8,  Female: 7 },
    { month: '2025-05', Male: 10, Female: 10 },
    { month: '2025-06', Male: 9,  Female: 9 },
    { month: '2025-07', Male: 12, Female: 10 },
  ];
  // ————————————————————

  useEffect(() => {
    drawTrend();
    drawPie();
    drawGenderBar();
  }, []);

  function drawTrend() {
    const parse = d3.timeParse('%Y-%m');
    monthlyTrendData.forEach(d => (d.date = parse(d.month)));

    const fullW  = 800;
    const fullH  = 300;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };
    const width  = fullW  - margin.left - margin.right;
    const height = fullH - margin.top  - margin.bottom;

    const svg = d3.select(trendRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${fullW} ${fullH}`)
      .style('background', '#fafafa');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(monthlyTrendData, d => d.date))
      .range([0, width]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyTrendData, d => d.count)]).nice()
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%b %Y')))
      .selectAll('text')
        .attr('transform','rotate(-45)')
        .style('text-anchor','end')
        .attr('dy','0.5em');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.count));

    g.append('path')
      .datum(monthlyTrendData)
      .attr('fill','none')
      .attr('stroke','#007bff')
      .attr('stroke-width',2.5)
      .attr('d', line);

    // Title at bottom center
    svg.append('text')
      .attr('x', fullW/2)
      .attr('y', fullH - 10)
      .attr('text-anchor','middle')
      .attr('font-size','16px')
      .attr('font-weight','bold')
      .text('Monthly Vaccination Trend');

    // Axis labels
    g.append('text')
      .attr('x', width/2)
      .attr('y', height + 50)
      .attr('text-anchor','middle')
      .attr('font-size','14px')
      .text('Month');

    g.append('text')
      .attr('transform', `translate(-45,${height/2}) rotate(-90)`)
      .attr('text-anchor','middle')
      .attr('font-size','14px')
      .text('Doses');
  }

  function drawPie() {
    const data = vaccineDistData;
    const fullW  = 350;
    const fullH  = 350;
    const radius = Math.min(fullW, fullH) / 2 - 40;

    const svg = d3.select(pieRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${fullW} ${fullH}`)
      .style('background', '#fafafa');

    const g = svg.append('g')
      .attr('transform', `translate(${fullW/2},${fullH/2 - 20})`);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeSet2);

    g.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (_,i) => color(i))
      .attr('stroke','#fff')
      .attr('stroke-width',1);

    // Legend at top‑right
    const legend = svg.append('g')
      .attr('transform', `translate(${fullW - 40}, 20)`);

    data.forEach((d,i) => {
      const yOff = i * 20;
      legend.append('rect')
        .attr('x', 0).attr('y', yOff)
        .attr('width', 12).attr('height', 12)
        .attr('fill', color(i));
      legend.append('text')
        .attr('x', 18).attr('y', yOff + 11)
        .attr('font-size','12px')
        .text(`${d.vaccine} (${d.count})`);
    });

    // Title at bottom center
    svg.append('text')
      .attr('x', fullW/2)
      .attr('y', fullH - 10)
      .attr('text-anchor','middle')
      .attr('font-size','16px')
      .attr('font-weight','bold')
      .text('Vaccine Distribution');
  }

  function drawGenderBar() {
    const data = monthlyGenderData;
    const months = data.map(d => d.month);
    const genders = ['Male','Female'];

    const pivot = months.map(month => {
      const rec = data.find(d => d.month === month) || {};
      return { month, Male: rec.Male || 0, Female: rec.Female || 0 };
    });

    const fullW  = 800;
    const fullH  = 350;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const width  = fullW  - margin.left - margin.right;
    const height = fullH - margin.top  - margin.bottom;

    const svg = d3.select(genderRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${fullW} ${fullH}`)
      .style('background', '#fafafa');

    // Title at bottom center
    svg.append('text')
      .attr('x', fullW/2)
      .attr('y', fullH - 10)
      .attr('text-anchor','middle')
      .attr('font-size','16px')
      .attr('font-weight','bold')
      .text('Monthly Gender Breakdown');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
      .domain(months)
      .range([0, width])
      .padding(0.2);
    const x1 = d3.scaleBand()
      .domain(genders)
      .range([0, x0.bandwidth()])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(pivot, d => Math.max(d.Male, d.Female))]).nice()
      .range([height, 0]);
    const color = d3.scaleOrdinal()
      .domain(genders)
      .range(['#4C9AFF','#FF8C00']);

    g.selectAll('g.month')
      .data(pivot)
      .join('g')
        .attr('transform', d => `translate(${x0(d.month)},0)`)
      .selectAll('rect')
      .data(d => genders.map(g => ({ gender: g, value: d[g] })))
      .join('rect')
        .attr('x', d => x1(d.gender))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', d => color(d.gender));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
        .attr('transform','rotate(-45)')
        .style('text-anchor','end')
        .attr('dy','0.5em');

    g.append('g').call(d3.axisLeft(y).ticks(5));

    // Legend at top‑right
    const legend = svg.append('g')
      .attr('transform', `translate(${fullW - 200}, 20)`);
    genders.forEach((gdr, i) => {
      const xOff = i * 100;
      legend.append('rect')
        .attr('x', xOff).attr('y', 0)
        .attr('width', 12).attr('height', 12)
        .attr('fill', color(gdr));
      legend.append('text')
        .attr('x', xOff + 18).attr('y', 12)
        .attr('font-size','12px')
        .text(gdr);
    });

    // Axis labels
    g.append('text')
      .attr('x', width/2)
      .attr('y', height + 60)
      .attr('text-anchor','middle')
      .attr('font-size','14px')
      .text('Month');
    g.append('text')
      .attr('transform', `translate(-45,${height/2}) rotate(-90)`)
      .attr('text-anchor','middle')
      .attr('font-size','14px')
      .text('Doses');
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Reports</h2>

      <div className="row mb-5">
        <div className="col-12">
          <svg ref={trendRef} style={{ width: '100%', height: '300px' }} />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <svg ref={pieRef} style={{ width: '100%', height: '350px' }} />
        </div>
        <div className="col-md-6">
          <svg ref={genderRef} style={{ width: '100%', height: '350px' }} />
        </div>
      </div>

      {/* Vaccine Category Table */}
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">Vaccine Category Data</h4>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Vaccine</th>
                <th>Doses Administered</th>
              </tr>
            </thead>
            <tbody>
              {vaccineDistData.map(({vaccine, count}) => (
                <tr key={vaccine}>
                  <td>{vaccine}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
