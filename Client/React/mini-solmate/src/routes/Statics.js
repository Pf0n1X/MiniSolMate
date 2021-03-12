import React from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Statics = () => {
  useEffect(() => {
    // ref.current = React.createElement(<div></div>);
    drawChart();

    return () => {};
  }, []);

  const ref = useRef(null);

  const drawChart = () => {
    // const data = [12, 5, 6, 6, 9, 10];

    // const svg = d3.select(ref.current).append("svg").attr("width", 400).attr("height", 300).style("margin-left", 100);

    // svg
    //   .selectAll("h2")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d, i) => i * 70)
    //   .attr("y", (d, i) => 300 - 10 * d)
    //   .attr("width", 65)
    //   .attr("height", (d, i) => d * 10)
    //   .attr("fill", "green");
    const width = 500,
      height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const keys = ["Male", "Female"];
    const groupKey = "Num of songs";
    const data = [
      { [groupKey]: "10", Male: 5, Female: 10 },
      { [groupKey]: "20", Male: 2, Female: 3 },
      { [groupKey]: "30", Male: 2, Female: 3 },
      { [groupKey]: "40", Male: 2, Female: 3 },
      { [groupKey]: "60", Male: 2, Female: 3 },
    ];
    const y = "Population";

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d[groupKey]))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.1);

    const x1 = d3
      .scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x0).tickSizeOuter(0))
        .call((g) => g.select(".domain").remove());

    const y2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key]))])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y2).ticks(null, "s"))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(y)
        );

    const color = d3.scaleOrdinal().range(["#d0743c", "#ff8c00"]);

    const legend = (svg) => {
      const g = svg
        .attr("transform", `translate(${width},0)`)
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      g.append("rect")
        .attr("x", -19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

      g.append("text")
        .attr("x", -24)
        .attr("y", 9.5)
        .attr("dy", "0.35em")
        .text((d) => d);
    };

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
      .data((d) => keys.map((key) => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", (d) => y2(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y2(0) - y2(d.value))
      .attr("fill", (d) => color(d.key));

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg.append("g").call(legend);

    // const svg = d3.select(ref.current).append("svg").attr("width", 400).attr("height", 300).style("margin-left", 100);

    // svg
    //   .selectAll("h2")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d, i) => i * 70)
    //   .attr("y", (d, i) => 300 - 10 * d)
    //   .attr("width", 65)
    //   .attr("height", (d, i) => d * 10)
    //   .attr("fill", "green");
  };
  return <div ref={ref} style={{ margin: 20 }}></div>;
};

export default Statics;
