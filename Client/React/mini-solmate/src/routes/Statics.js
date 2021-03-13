// import React from "react";
import * as d3 from "d3";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useToken from "../hooks/useToken";

const Statics = () => {
  const [chart, setCharts] = useState();
  const { token } = useToken();
  const ColChart = [];
  const PiChart = [];
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/user/statistic", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setCharts(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    if (chart) {
      drawChartCol();
      drawChartPie();
    }
    return () => {};
  }, [chart]);

  useEffect(() => {
    fetchData();
  }, []);

  const refCol = useRef(null);
  const refPie = useRef(null);

  const drawChartCol = () => {
    const width = 500,
      height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const keys = ["Male", "Female"];
    const groupKey = "Num of songs";
    const data = [{ [groupKey]: "", Male: 5, Female: 10 }];
    const y = "Num of Songs";
    chart["docs_send"].forEach((element) => {
      if (element._id == 1) {
        data[0].Female = element.value;
      } else if (element._id == 0) {
        data[0].Male = element.value;
      }
    });
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

    const color = d3.scaleOrdinal().range(["#000066", "#b30059"]);

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
      .select(refCol.current)
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
  };

  const drawChartPie = () => {
    const width = 400,
      height = 400;

    const data = [
      { name: "Male", value: 0 },
      { name: "Female", value: 0 },
    ];
    chart["data1"].forEach((element) => {
      if (element._id == 1) {
        data[1].value = element.count;
      } else if (element._id == 0) {
        data[0].value = element.count;
      }
    });

    // const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
    const radius = (Math.min(width, height) / 2) * 0.8;
    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        ["#000066", "#b30059"]
        // d3
        //   .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
        //   .reverse()
      );

    const arcs = pie(data);

    const svg = d3
      .select(refPie.current)
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, 800, 800]);

    svg
      .append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString())
      );
  };
  return (
    <div style={{ textAlign: "center" }}>
      <div ref={refCol} style={{ margin: 10 }}></div>
      <div
        ref={refPie}
        style={{ marginLeft: 40, marginTop: 10, maxWidth: 500, maxHeight: 500 }}
      ></div>
    </div>
  );
};

export default Statics;
