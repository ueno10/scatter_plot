import React, { Component } from "react";
import { render } from "react-dom";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const dataPath = "./data/plot_test_data.json";
    window
      .fetch(dataPath)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
    //drawCluster();
  }

  render() {
    const { data } = this.state;
    if (data == null) {
      return <div>loading</div>;
    }
    return (
      <div className="App">
        <WordPlot data={data} />
      </div>
    );
  }
}

class WordPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
    };
  }
  render() {
    const data = this.props.data;
    console.log(data);
    const contentWidth = 500;
    const contentHeight = 500;
    const margin = {
      left: 80,
      right: 100,
      top: 20,
      bottom: 80,
    };
    const width = contentWidth + margin.left + margin.right;
    const height = contentHeight + margin.top + margin.bottom;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (item) => item.x), d3.max(data, (item) => item.x)])
      .range([0, contentWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([d3.max(data, (item) => item.y), d3.min(data, (item) => item.y)])
      .range([0, contentHeight - 5])
      .nice();

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {xScale.ticks().map((x) => {
            return (
              <g transform={`translate(${xScale(x)},0)`}>
                <line
                  x1="0"
                  y1={contentHeight - 5}
                  x2="0"
                  y2={contentHeight}
                  stroke="black"
                />
                <text y={contentHeight + 20} textAnchor="middle">
                  {x}
                </text>
              </g>
            );
          })}
          {yScale.ticks().map((y) => {
            return (
              <g transform={`translate(0,${yScale(y)})`}>
                <line x1="-5" y1="0" x2="0" y2="0" stroke="black" />
                <text x="-20" y="5" textAnchor="middle">
                  {y}
                </text>
              </g>
            );
          })}
          {
            <g>
              <line
                x1="0"
                y1={contentHeight - 5}
                x2={contentWidth}
                y2={contentHeight - 5}
                stroke="black"
              />
              <line
                x1="0"
                y1={contentHeight - 5}
                x2="0"
                y2="0"
                stroke="black"
              />
            </g>
          }

          {data.map((item, i) => {
            return (
              <g
                key={i}
                onClick={() => {
                  this.setState({ word: item.word });
                }}
              >
                {console.log(this.state.word)}
                <title>{`word:${item.word}`}</title>
                <circle
                  style={{ cursor: "pointer" }}
                  cx={xScale(item.x)}
                  cy={yScale(item.y)}
                  r="5"
                  fill={color(item.color)}
                />
              </g>
            );
          })}
          {
            <text x={contentWidth} y="0">
              {this.state.word}
            </text>
          }
        </g>
      </svg>
    );
  }
}

render(<App />, document.querySelector("#content"));
