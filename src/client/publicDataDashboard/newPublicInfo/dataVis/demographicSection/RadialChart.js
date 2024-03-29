import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";
import "./RadialChart.css";
import { colors } from "../../publicInfoStyles";

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
      innerPercentage,
      outerPercentage,
      strokeWidth,
      dimension,
      outerColor,
      innerColor,
      title
    } = this.props;

    const outerCircumference = 2 * 3.14 * radius;
    const innerCircumference = 2 * 3.14 * (radius - strokeWidth);
    const outerStrokeLength = setStrokeLength
      ? (outerCircumference / 100) * innerPercentage
      : 0;
    const innerStrokeLength = setStrokeLength
      ? (innerCircumference / 100) * outerPercentage
      : 0;
    const titleFontSize = Math.min(radius / 3 - 8, title.length > 10 ? 14 : 16);

    return (
      <div
        className={classNames("radial-chart", className, {
          "no-progress": outerStrokeLength === 0
        })}
        style={{ width: `${dimension}px` }}
      >
        <svg
          viewBox={`0 0 ${dimension} ${dimension}`}
          width={dimension}
          height={dimension}
        >
          <circle
            className="radial-chart-total"
            stroke="#000"
            strokeWidth={2}
            fill="none"
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius - strokeWidth * 1.5 - 1}
          />
          <text
            x="37%"
            y="10%"
            textAnchor="middle"
            fill={outerColor}
            strokeWidth="0.3px"
            dy=".3em"
            fontSize={`${radius / 3 - 10}px`}
            fontWeight="100"
          >
            {innerPercentage}%
          </text>
          <circle
            className="radial-chart-progress"
            stroke={outerColor}
            strokeWidth={strokeWidth + 1}
            strokeDasharray={`${outerStrokeLength},${outerCircumference}`}
            fill="none"
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
          />
          <text
            x="37%"
            y="20%"
            textAnchor="middle"
            fill={innerColor}
            strokeWidth="0.3px"
            dy=".3em"
            fontSize={`${radius / 3 - 10}px`}
          >
            {outerPercentage}%
          </text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            stroke="#000"
            strokeWidth="1px"
            dy=".3em"
            fontSize={titleFontSize}
          >
            {title}
          </text>
          <circle
            className="radial-chart-inner"
            stroke={innerColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${innerStrokeLength},${innerCircumference}`}
            fill="none"
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius - strokeWidth}
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
  dimension: 200,
  outerColor: colors.primaryBrand,
  innerColor: colors.secondaryBrand
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
