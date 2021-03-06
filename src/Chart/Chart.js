import React, { Fragment } from 'react';
import './Chart.css'

const defaultAxisOptions = {
    min: 0,
    max: 250,
    steps: 10,
    scale: 'linear',        // linear, log
    title: 'Axis',
    field: null,
    reversed: false,
    labelCallback: null
};

const defaultProps = {
    data: null, 
    xAxis: null,
    yAxis: null, 
    zAxis: null, 
    width: 1000, 
    height: 400,
    selectedIndex: -1,
    onItemClicked: null, 
    onItemHover: null
}


const Chart = (p) => {

    const xAxis = { ...defaultAxisOptions, ...p.xAxis };
    const yAxis = { ...defaultAxisOptions, ...p.yAxis };
    const zAxis = { ...defaultAxisOptions, ...p.zAxis };
    
    p = {...defaultProps, ...p};

    const maxZ = 20;
    const vw = 1000;
    const vh = 400;
    const left = 50;
    const right = 20;
    const top = 100;
    const bottom = 50;
    const axisStroke = 'white'

    const logClamp = (value) => {
        return (value <= 0) ? 1 : value;
    }

    const scale = (scaleMin, scaleMax, value, axis, start, end, total) => {
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
            result = (axis === xAxis) ? total - end - result : total - start - result;
        }
        else {
            result += (axis === yAxis) ? end : start;
        }


        return result;
    }

    const getX = (value) => {
        return scale(left, vw - right, value, xAxis, left, right, vw);
    }

    const getY = (value) => {
        return scale(bottom, vh - top, value, yAxis, top, bottom, vh);
    }

    const getZ = (value) => {
        return scale(0, maxZ, value, zAxis, 0, 0, maxZ);
    }

    const getDataField = (obj, fieldName) => {
        return obj[fieldName];
    }

    const getXAxis = () => {
        return (
            <>
                <line x1={left} y1={bottom} x2={vw - right} y2={bottom} stroke={axisStroke} />
                {getAxisDivisionPoints(xAxis, getX).map((scaled, i) => {
                    return (
                        <Fragment key={i}>
                            <line x1={scaled.pos} x2={scaled.pos} y1={bottom} y2={bottom - 5} stroke={axisStroke} />
                            <text className='Axis' textAnchor="middle" x={scaled.pos} y={vh - bottom + 20}>{scaled.value}</text>
                        </Fragment>
                    )
                })}
            </>
        )
    }

    const getYAxis = () => {
        return (
            <>
                <line x1={left} y1={bottom} x2={left} y2={vh - top} stroke={axisStroke} />
                {getAxisDivisionPoints(yAxis, getY).map((scaled, i) => {
                    const yPos = vh - scaled.pos + 3;        // Text is reversed twice to address the coordinate change in svg.
                    if (scaled.value === null) return null;
                    return (
                        <Fragment key={i}>
                            <line x1={left - 5} x2={left} y1={scaled.pos} y2={scaled.pos} stroke={axisStroke} />
                            <text className='Axis' textAnchor="end" x={left - 10} y={yPos}>{scaled.value}</text>
                        </Fragment>
                    )
                })}
            </>
        )
    }

    const getAxisDivisionPoints = (axis, positionGetter) => {
        const result = [];
        const step = (axis.max - axis.min) / axis.steps;

        for (let i = axis.min; i <= axis.max; i += step) {
            let value = i;
            if (axis.labelCallback) value = axis.labelCallback(i);
            result.push({value, pos: positionGetter(i) });
        }

        return result;
    }

    const debugBoxes = () => {
        return (
            <>
                <rect x={0} y={0} width={vw} height={vh - 1} stroke='red' fill='none' />
                <rect x={left} y={bottom} width={vw - left - right} height={vh - top - bottom} stroke='orange' fill='none' />
            </>
        )
    }

    const invokeEvent = (eventHandler, index, item) => {
        if (!eventHandler) return;
        eventHandler(index, item);
    }

    return (
        <svg
            viewBox={"0 0 " + vw + " " + vh} xmlns="http://www.w3.org/2000/svg"
            width={p.width} height={p.height}
            style={{
                transformOrigin: '50% 50%',
                transform: 'scale(1,-1)'
            }}
        >
            <defs>
                <clipPath id="chartArea">
                    <rect x={left} y={bottom} width={vw - left - right} height={vh - bottom} />
                </clipPath>
            </defs>
            {getXAxis()}
            {getYAxis()}
            {/* {debugBoxes()} */}
            <g clipPath="url(#chartArea)">
                {p.data && p.data.map((item, i) => {
                    const isSelected = p.selectedIndex === i;
                    const cx = getX(getDataField(item, xAxis.field));
                    const cy = getY(getDataField(item, yAxis.field));
                    const cz = getZ(getDataField(item, zAxis.field));
                    return (
                        <Fragment key={i}>
                            {isSelected && <line x1={cx} x2={cx} y1={bottom} y2={vh - top} stroke='orange' />}
                            <circle 
                                cx={cx}
                                cy={cy}
                                r={cz || maxZ}
                                fill={isSelected ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}
                                onClick={() => invokeEvent(p.onItemClicked, i, item)}
                                onMouseEnter={() => invokeEvent(p.onItemHover, i, item)}
                                onMouseLeave={() => invokeEvent(p.onItemHover, -1, null)}
                            />
                            
                        </Fragment>
                    )
                })}
            </g>
        </svg>
    )
}

export default Chart;