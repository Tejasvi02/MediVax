// client/src/components/admin/Reports.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Reports = () => {
  const trendRef   = useRef();
  const dailyRef   = useRef();
  const pieRef     = useRef();
  const genderRef  = useRef();

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

  const dailyData = [
    { date: '2025-07-01', count: 2 },
    { date: '2025-07-02', count: 5 },
    { date: '2025-07-03', count: 4 },
    { date: '2025-07-04', count: 7 },
    { date: '2025-07-05', count: 6 },
    { date: '2025-07-06', count: 9 },
    { date: '2025-07-07', count: 11 },
  ];

  const coverageData = {
    totalUsers: 200,
    coveredCount: 150,
    percent: 75
  };

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

  const vaccineGenderPercentData = [
    { vaccine: 'Pfizer',  male: 45, female: 55 },
    { vaccine: 'Moderna', male: 50, female: 50 },
    { vaccine: 'J&J',     male: 40, female: 60 },
    { vaccine: 'Novavax', male: 48, female: 52 },
  ];

  const hospitalVaccinePercentData = [
    { hospital: 'City Hospital',    vaccine: 'Pfizer',  percent: 30 },
    { hospital: 'City Hospital',    vaccine: 'Moderna', percent: 20 },
    { hospital: 'City Hospital',    vaccine: 'J&J',     percent: 50 },
    { hospital: 'Green Clinic',     vaccine: 'Pfizer',  percent: 40 },
    { hospital: 'Green Clinic',     vaccine: 'Moderna', percent: 35 },
    { hospital: 'Green Clinic',     vaccine: 'Novavax', percent: 25 },
    { hospital: 'General Hospital', vaccine: 'Pfizer',  percent: 25 },
    { hospital: 'General Hospital', vaccine: 'J&J',     percent: 75 },
  ];
  // ————————————————————

  useEffect(() => {
    drawTrend();
    drawDaily();
    drawPie();
    drawGenderBar();
  }, []);

  function drawTrend() {
    const parse = d3.timeParse('%Y-%m');
    monthlyTrendData.forEach(d => d.date = parse(d.month));

    const W = 900, H = 350, m = { top: 40, right: 30, bottom: 100, left: 60 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = d3.select(trendRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .selectAll('*').remove() && d3.select(trendRef.current);

    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(monthlyTrendData, d => d.date))
      .range([0, w]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyTrendData, d => d.count)]).nice()
      .range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%b %Y')))
      .selectAll('text')
        .attr('transform','rotate(-45)')
        .style('text-anchor','end')
        .attr('dy','0.5em');

    g.append('g').call(d3.axisLeft(y).ticks(5));

    g.append('path')
      .datum(monthlyTrendData)
      .attr('fill','none')
      .attr('stroke','#007bff')
      .attr('stroke-width',3)
      .attr('d', d3.line().x(d => x(d.date)).y(d => y(d.count)));

    svg.append('text')
      .attr('x', W/2)
      .attr('y', H - 5)
      .attr('text-anchor','middle')
      .attr('font-size','20px')
      .attr('font-weight','600')
      .text('Monthly Vaccination Trend');
  }

  function drawDaily() {
    const parse = d3.timeParse('%Y-%m-%d');
    dailyData.forEach(d => d.date = parse(d.date));

    const W = 650, H = 350, m = { top: 40, right: 30, bottom: 100, left: 60 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = d3.select(dailyRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .selectAll('*').remove() && d3.select(dailyRef.current);

    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    const x = d3.scaleBand()
      .domain(dailyData.map(d => d3.timeFormat('%b %d')(d.date)))
      .range([0, w]).padding(0.2);
    const y = d3.scaleLinear()
      .domain([0, d3.max(dailyData, d => d.count)]).nice()
      .range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform','rotate(-45)')
        .style('text-anchor','end')
        .attr('dy','0.5em');

    g.append('g').call(d3.axisLeft(y).ticks(5));

    g.selectAll('rect')
      .data(dailyData)
      .join('rect')
        .attr('x', d => x(d3.timeFormat('%b %d')(d.date)))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => h - y(d.count))
        .attr('fill','#28a745');

    svg.append('text')
      .attr('x', W/2)
      .attr('y', H - 5)
      .attr('text-anchor','middle')
      .attr('font-size','20px')
      .attr('font-weight','600')
      .text('Daily Doses Administered');
  }

  function drawPie() {
    const data = vaccineDistData;
    const W = 350, H = 350, r = Math.min(W, H)/2 - 40;

    const svg = d3.select(pieRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .selectAll('*').remove() && d3.select(pieRef.current);

    const g = svg.append('g').attr('transform', `translate(${W/2},${H/2 - 20})`);

    g.selectAll('path')
      .data(d3.pie().value(d => d.count)(data))
      .join('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(r))
      .attr('fill', (_,i) => d3.schemeSet2[i])
      .attr('stroke','#fff')
      .attr('stroke-width',1);

    // move legend further right
    const legend = svg.append('g').attr('transform', `translate(${W - 50},20)`);
    data.forEach((d,i) => {
      const y = i * 20;
      legend.append('rect')
        .attr('x', 0).attr('y', y)
        .attr('width', 12).attr('height', 12)
        .attr('fill', d3.schemeSet2[i]);
      legend.append('text')
        .attr('x', 18).attr('y', y + 11)
        .attr('font-size','12px')
        .text(d.vaccine);
    });

    svg.append('text')
      .attr('x', W/2)
      .attr('y', H - 5)
      .attr('text-anchor','middle')
      .attr('font-size','20px')
      .attr('font-weight','600')
      .text('Vaccine Distribution');
  }

  function drawGenderBar() {
    const data = monthlyGenderData;
    const months = data.map(d => d.month);
    const genders = ['Male','Female'];
    const pivot = months.map(m => {
      const rec = data.find(d => d.month === m) || {};
      return { month: m, Male: rec.Male||0, Female: rec.Female||0 };
    });

    const W = 600, H = 350, m = { top: 40, right: 30, bottom: 100, left: 60 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = d3.select(genderRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .selectAll('*').remove() && d3.select(genderRef.current);

    const legend = svg.append('g').attr('transform', `translate(${W - 180},20)`);
    genders.forEach((gdr,i) => {
      legend.append('rect')
        .attr('x', i * 80).attr('y', 0)
        .attr('width', 12).attr('height', 12)
        .attr('fill', d3.schemeSet3[i]);
      legend.append('text')
        .attr('x', i * 80 + 18).attr('y', 11)
        .attr('font-size','12px')
        .text(gdr);
    });

    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    const x0 = d3.scaleBand().domain(months).range([0, w]).padding(0.2);
    const x1 = d3.scaleBand().domain(genders).range([0, x0.bandwidth()]).padding(0.1);
    const y  = d3.scaleLinear().domain([0, d3.max(pivot, d => Math.max(d.Male, d.Female))]).nice().range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
        .attr('transform','rotate(-45)')
        .style('text-anchor','end')
        .attr('dy','0.5em');

    g.append('g').call(d3.axisLeft(y).ticks(5));

    g.selectAll('g.month')
      .data(pivot).join('g')
        .attr('transform', d => `translate(${x0(d.month)},0)`)
      .selectAll('rect')
      .data(d => genders.map(g => ({ gender: g, value: d[g] })))
      .join('rect')
        .attr('x', d => x1(d.gender))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => h - y(d.value))
        .attr('fill', d => d3.schemeSet3[genders.indexOf(d.gender)]);

    svg.append('text')
      .attr('x', W/2)
      .attr('y', H - 5)
      .attr('text-anchor','middle')
      .attr('font-size','20px')
      .attr('font-weight','600')
      .text('Monthly Gender Breakdown');
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">Admin Reports</h2>
      <div className="row g-5">
        <div className="col-12 mb-5">
          <svg ref={trendRef} style={{ width: '100%', height: '350px' }} />
        </div>

        <div className="col-md-8 mb-5">
          <svg ref={dailyRef} style={{ width: '100%', height: '350px' }} />
        </div>
        <div className="col-md-4 mb-5">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Population Coverage</h5>
              <p>Total Registered Users: <strong>{coverageData.totalUsers}</strong></p>
              <p>Users Vaccinated (≥1 dose): <strong>{coverageData.coveredCount}</strong></p>
              <h4 className="display-6">{coverageData.percent}% Covered</h4>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-5">
          <svg ref={pieRef} style={{ width: '100%', height: '350px' }} />
        </div>
        <div className="col-md-6 mb-5">
          <svg ref={genderRef} style={{ width: '100%', height: '350px' }} />
        </div>

        <div className="col-md-6 mb-5">
          <div className="card bg-light mb-3">
            <div className="card-body p-3">
              <h6 className="card-subtitle mb-2">Vaccine Gender Percentage</h6>
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr><th>Vaccine</th><th>Male %</th><th>Female %</th></tr>
                </thead>
                <tbody>
                  {vaccineGenderPercentData.map(d => (
                    <tr key={d.vaccine}>
                      <td className="py-1">{d.vaccine}</td>
                      <td className="py-1">{d.male}%</td>
                      <td className="py-1">{d.female}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-5">
          <div className="card bg-light mb-3">
            <div className="card-body p-3">
              <h6 className="card-subtitle mb-2">Hospital Vaccine Distribution Percentage</h6>
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr><th>Hospital</th><th>Vaccine</th><th>% Sold</th></tr>
                </thead>
                <tbody>
                  {hospitalVaccinePercentData.map((d, i) => (
                    <tr key={i}>
                      <td className="py-1">{d.hospital}</td>
                      <td className="py-1">{d.vaccine}</td>
                      <td className="py-1">{d.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
