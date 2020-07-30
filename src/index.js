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
    const dataPath = "./data/plot_test_data_10.json";
    window
      .fetch(dataPath)
      .then((response) => response.json())
      .then((data) => {
        data = data.filter((item) => {
          return (
            item.word === "開発" ||
            item.word === "学校" ||
            item.word === "支援" ||
            item.word === "日本" ||
            item.word === "文化" ||
            item.word === "海外"
          );
        });
        this.setState({ data });
      });
  }

  render() {
    const { data } = this.state;
    if (data == null) {
      return <div>loading</div>;
    }
    return (
      <div className="App">
        <Draw data={data} />
      </div>
    );
  }
}

class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      data: null,
    };
  }

  componentDidMount() {
    const dendrogramDataPath = `./data/dendrogramData/${this.state.word}.json`;
    window
      .fetch(dendrogramDataPath)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
  }

  render() {
    const dendrogramDataPath = `./data/dendrogramData/${this.state.word}.json`;
    window
      .fetch(dendrogramDataPath)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
    const { data } = this.state;
    const data_j = data;
    if (data_j != null) {
      console.log(data_j);
    }

    const dataPlot = this.props.data;

    console.log(this.state);
    const contentWidth = 1200; // 全体
    const contentHeight = 3000; //　全体

    const plotWidth = 300;
    const plotHeight = 300;
    const margin = {
      left: 15,
      right: 100,
      top: 20,
      bottom: 60,
    };

    const width = contentWidth + margin.left + margin.right;
    const height = contentHeight + margin.top + margin.bottom;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScaleP = d3
      .scaleLinear()
      .domain([
        d3.min(dataPlot, (item) => item.x),
        d3.max(dataPlot, (item) => item.x),
      ])
      .range([0, plotWidth])
      .nice();

    const yScaleP = d3
      .scaleLinear()
      .domain([
        d3.max(dataPlot, (item) => item.y),
        d3.min(dataPlot, (item) => item.y),
      ])
      .range([0, plotHeight - 5])
      .nice();

    //
    let xScaleD;
    let testData;
    if (data_j != null) {
      xScaleD = d3
        .scaleLinear()
        .domain([
          d3.max(data_j, (item) => item.height),
          d3.min(data_j, (item) => item.height),
        ])
        .range([plotWidth + margin.left, contentWidth - 150]);

      const stratify = d3
        .stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent);
      const data_stratify = stratify(data_j);
      const root = d3.hierarchy(data_stratify);

      const cluster = d3
        .cluster()
        .size([contentHeight, contentWidth - plotWidth - margin.left - 150]);
      cluster(root);

      testData = root.descendants();
    }

    console.log(testData);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {dataPlot.map((item, i) => {
            return (
              <g
                key={i}
                onMouseOver={() => {
                  this.setState({ word: item.word });
                }}
              >
                {console.log(this.state.word)}
                <title>{`word:${item.word}`}</title>
                <circle
                  style={{ cursor: "pointer" }}
                  cx={xScaleP(item.x)}
                  cy={yScaleP(item.y)}
                  r="5"
                  fill={color(item.color)}
                />
              </g>
            );
          })}
          {
            <text x={plotWidth} y="0">
              {this.state.word}
            </text>
          }
        </g>
        {data_j != null ? (
          <g transform={`translate(100, ${margin.top})`}>
            {testData.slice(1).map((item) => {
              return (
                <path
                  className="link"
                  d={`M${xScaleD(item.data.data.height)},${item.x}
                      L${xScaleD(item.parent.data.data.height)},${item.x}
                      L${xScaleD(item.parent.data.data.height)},${
                    item.parent.x
                  }`}
                />
              );
            })}
            {testData.map((item, i) => {
              return (
                <g
                  key={i}
                  transform={`translate(${xScaleD(item.data.data.height)},${
                    item.x
                  })`}
                >
                  <circle r="1" fill="#555"></circle>
                  <text
                    dy="5"
                    x={item.children ? -10 : 5}
                    y="-4"
                    font-size="30%"
                    textAnchor={item.children ? "end" : "start"}
                  >
                    {item.children ? null : item.data.data["事業名"]}
                  </text>
                </g>
              );
            })}
          </g>
        ) : (
          <text>loading</text>
        )}
      </svg>
    );
  }
}

render(<App />, document.querySelector("#content"));
