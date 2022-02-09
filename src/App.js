import { isValidElement, useState } from 'react';
import './App.css';
import Chart from './Chart/Chart';
import { getCalibrationData, getRandomData, getStaticData } from './data';


const data = getRandomData(100, new Date());
//const data = getCalibrationData();


const logScaleVisibleLabels = [1, 2, 10, 20, 100, 200];
const logScaleVisibleTicks =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900]

function logScaleLabelHandler(val) {
    if (logScaleVisibleLabels.includes(val)) return val;
    if (logScaleVisibleTicks.includes(val)) return '';
    return null;
}


function App() {

    const [hovered, setHovered] = useState(-1);    

    const selected = (hovered > -1) ? data[hovered] : null;

    return (
        <div className="App">
            <Chart 
                data={data}
                xAxis={{
                    min: 0,
                    max: data.length,
                    scale: 'linear',
                    title: 'Prevalence',
                    field: 'id', 
                    steps: 20,
                    reversed: false
                }}
                yAxis={{
                    min: 0,
                    max: 1000,
                    scale: 'log',
                    title: 'Identifiers',
                    field: 'value',
                    reversed: true,
                    steps: 1000,
                    labelCallback: logScaleLabelHandler
                }}
                zAxis={{
                    min: 0,
                    max: 5,
                    field: 'z'
                }}
                width='1000px'
                height='400px'
                selectedIndex={hovered}
                onItemHover={i => setHovered(i)}
                onItemClicked={(i, item) => alert(item.value)}
            />
            <p style={{margin: '30px'}}>{selected && selected.id + ', ' + selected.value + ', ' + selected.z}</p>
        </div>
    );
}

export default App;
