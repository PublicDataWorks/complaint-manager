import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";
import "./RadialChart.css";
const DEFAULT_COLOR = "#040404";
class RadialChart extends Component {
  state = {};
  componentDidMount() {
    // For initial animation
    setTimeout(() => {
      this.setState({ setStrokeLength: true });
    });
  }
  render() {
    const { setStrokeLength } = this.state;
    const {
      className,
      radius,
      progress,
      progress2,
      strokeWidth,
      dimension,
      color,
      color2,
      title
    } = this.props;

    const circleRadius = Math.min(radius, 85);
    const circumference = 2 * 3.14 * circleRadius;
    const circumference2 = 2 * 3.14 * (circleRadius - 10);
    const strokeLength = setStrokeLength ? (circumference / 100) * progress : 0;
    const strokeLength2 = setStrokeLength
      ? (circumference2 / 100) * progress2
      : 0;
    return (
      <div
        className={classNames("radial-chart", className, {
          "no-progress": strokeLength === 0
        })}
      >
        <svg viewBox="0 0 180 180" width={dimension} height={dimension}>
          <circle
            className="radial-chart-total"
            stroke="#000"
            strokeWidth={1}
            fill="none"
            cx="90"
            cy="90"
            r={circleRadius - 15}
          />
          <circle
            className="radial-chart-progress"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeLength},${circumference}`}
            fill="none"
            cx="90"
            cy="90"
            r={circleRadius}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            stroke="#000"
            strokeWidth="1px"
            dy=".3em"
          >
            {title}
          </text>
          <circle
            className="radial-chart-inner"
            stroke={color2}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeLength2},${circumference2}`}
            fill="none"
            cx="90"
            cy="90"
            r={circleRadius - 10}
          />
        </svg>
      </div>
    );
  }
}
RadialChart.defaultProps = {
  radius: 80,
  progress: 100,
  strokeWidth: 10,
  dimension: 180,
  color: DEFAULT_COLOR
};
RadialChart.propTypes = {
  className: PropTypes.string,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
  progress: PropTypes.number,
  dimension: PropTypes.number
};
export default RadialChart;
