import React, { Fragment } from 'react';

const defaultAxisData = {
    min: 0,
    max: 250,
    steps: 10,
    scale: 'linear',        // linear, log
    title: 'Axis',
    field: null,
    reversed: false,
    values: null
};



const Chart = ({ data, xAxis, yAxis, zAxis, width, height, onItemHover, onItemClicked, selectedIndex }) => {

    xAxis = { ...defaultAxisData, ...xAxis };
    yAxis = { ...defaultAxisData, ...yAxis };
    zAxis = { ...defaultAxisData, ...zAxis };

    const maxZ = 20;
    const vw = 1000;
    const vh = 400;
    const left = 40;
    const right = 20;
    const top = 100;
    const bottom = 50;
    const axisStroke = 'white'

    const logClamp = (value) => {
        return (value <= 0) ? 1 : value;
    }

    const scale = (scaleMin, scaleMax, value, axis, start, total) => {
        let result = 0;

        
        if (axis.scale === 'log') {
            // logarithmic
            const logMax = Math.log10(logClamp(axis.max));
            const logMin = Math.log10(logClamp(axis.min));
            const logValue = Math.log10(logClamp(value));
            result = (logValue / (logMax - logMin)) * (scaleMax - scaleMin);
        }
        else {
            // linear
            result = (value / (axis.max - axis.min)) * (scaleMax - scaleMin);
        }

        if (axis.reversed) {
            result = total - start - result;
        }
        else {
            result += start;
        }


        return result;
    }

    const getX = (value) => {
        return scale(left, vw - right, value, xAxis, left, vw);
    }

    const getY = (value) => {
        return scale(bottom, vh - top, value, yAxis, top, vh);
    }

    const getZ = (value) => {
        return scale(0, maxZ, value, zAxis, 0, maxZ);
    }

    const getDataField = (obj, fieldName) => {
        return obj[fieldName];
    }

    const getXAxis = () => {
        return (
            <>
                <line x1={left} y1={bottom} x2={vw - right} y2={bottom} stroke={axisStroke} />
            </>
        )
    }

    const getYAxis = () => {
        return (
            <>
                <line x1={left} y1={bottom} x2={left} y2={vh - top} stroke={axisStroke} />
                
            </>
        )
    }

    const debugBoxes = () => {
        return (
            <>
                <rect x={0} y={0} width={vw} height={vh - 1} stroke='red' fill='none' />
                <rect x={left} y={bottom} width={vw - left - right} height={vh - top - bottom} stroke='orange' fill='none' />
            </>
        )
    }

    return (
        <svg
            viewBox={"0 0 " + vw + " " + vh} xmlns="http://www.w3.org/2000/svg"
            width={width} height={height}
            style={{
                transformOrigin: '50% 50%',
                transform: 'scale(1,-1)'
            }}
        >
            <defs>
                <clipPath id="chartView">
                    <rect x={left} y={bottom} width={vw - left - right} height={vh - bottom} />
                </clipPath>
            </defs>
            {getXAxis()}
            {getYAxis()}
            {/* {debugBoxes()} */}
            {data.map((item, i) => {
                const isSelected = selectedIndex === i;
                const cx = getX(getDataField(item, xAxis.field));
                const cy = getY(getDataField(item, yAxis.field));
                const cz = getZ(getDataField(item, zAxis.field));
                return (
                    <Fragment key={i}>
                        <circle 
                            cx={cx}
                            cy={cy}
                            r={cz || maxZ}
                            fill={isSelected ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)'}
                            clipPath="url(#chartView)"
                            onClick={() => onItemClicked(i, item)}
                            onMouseEnter={() => onItemHover(i, item)}
                            onMouseLeave={() => onItemHover(-1, null)}
                        />
                        {isSelected && <line x1={cx} x2={cx} y1={bottom} y2={vh - (top / 2) } stroke='orange' />}
                    </Fragment>
                )
            })}
        </svg>
    )
}





export default Chart;