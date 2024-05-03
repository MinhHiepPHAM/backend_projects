import React from "react";
import { format } from "d3-format";
import {
    discontinuousTimeScaleProviderBuilder,
    Chart,
    ChartCanvas,
    CandlestickSeries,
    OHLCTooltip,
    XAxis,
    YAxis,
    EdgeIndicator,
    ZoomButtons,
    BarSeries,
    HoverTooltip,
} from "react-financial-charts";

export const CandleChart = ({stockData, period}) => {
    const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d) => new Date(d[period === '1d'?'Datetime':'Date'])
    );
    
    const height = 600;
    const width = 750;
    const margin = { left: 0, right: 55, top: 0, bottom: 50 };

    const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
        stockData
    );
    const pricesDisplayFormat = format(".2f");
    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(0)
    // console.log('stock data: ', stockData, min, max)
    // console.log('data: ', stockData)
    const xExtents = [min, max];

    const gridHeight = height - margin.top - margin.bottom;

    const chartHeight = gridHeight;

    const candleChartExtents = (data) => {
        return [data.high, data.low];
    };

    const yEdgeIndicator = (data) => {
        return data.close;
    };

    const openCloseColor = (data) => {
        return data.close > data.open ? "#26a69a" : "#ef5350";
    };

    return (
        <div style={{paddingBottom:'40px'}}>
            <ChartCanvas
                height={height}
                ratio={1}
                width={width}
                margin={margin}
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Data"
                xScale={xScale}
                xAccessor={xAccessor}
                xExtents={xExtents}
            >

                <Chart id={1} height={chartHeight} yExtents={candleChartExtents}>
                    <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb"/>
                    <YAxis showGridLines gridLinesStrokeStyle="#e0e3eb" tickFormat={pricesDisplayFormat} />
                    {/* X-axis label */}
                    {/* <text x={width / 2} y={height-20} textAnchor="middle" fontSize="18" fill="#2f3235">Time</text> */}
                    
                    <CandlestickSeries/>
                    <EdgeIndicator
                        itemType="last"
                        rectWidth={margin.right}
                        fill={openCloseColor}
                        lineStroke={openCloseColor}
                        displayFormat={pricesDisplayFormat}
                        yAccessor={yEdgeIndicator}
                    />

                    <ZoomButtons />
                    <OHLCTooltip origin={[16, 30]}/>
                </Chart>
            </ChartCanvas>
        </div>
    );
};


export const VolumeChart = ({stockData, period}) => {
    const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d) => new Date(d[period ==='1d'?'Datetime':'Date'])
    );
    
    const height = 600;
    const width = 750;
    const margin = { left: 10, right: 80, top: 10, bottom: 50 };

    const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
        stockData
    );

    console.log(xAccessor, displayXAccessor)

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(0)
    const xExtents = [min, max];

    // const gridHeight = height - margin.top - margin.bottom;

    // const chartHeight = gridHeight;

    const volumeExtents = (d) => {
        return d.volume;
    };

    const openCloseColor = (d) => {
        return d.close > d.open ? "#26a69a" : "#ef5350";
    };
    console.log(data)

    return (
        <div style={{paddingBottom:'40px'}}>
            <ChartCanvas
                height={height}
                ratio={1}
                width={width}
                margin={margin}
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Volume"
                xScale={xScale}
                xAccessor={xAccessor}
                xExtents={xExtents}
            >

                <Chart id={1} yExtents={(d)=>d.volume}>
                    <XAxis gridLinesStrokeStyle="#e0e3eb"/>
                    <YAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
                    
                    {/* <text x={width / 2} y={height-20} textAnchor="middle" fontSize="18" fill="#2f3235">Time</text> */}
                    
                    <BarSeries yAccessor={volumeExtents} />
                    {/* <HoverTooltip yAccessor={volumeExtents}/> */}
                    <EdgeIndicator
                        itemType="last"
                        rectWidth={margin.right}
                        fill={openCloseColor}
                        lineStroke={openCloseColor}
                        yAccessor={volumeExtents}
                    />

                    <ZoomButtons />
                </Chart>
            </ChartCanvas>
        </div>
    );
};
