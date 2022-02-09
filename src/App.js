import { useState } from 'react';
import './App.css';
import Chart from './Chart/Chart';
import { getCalibrationData, getRandomData, getStaticData } from './data';


const data = getRandomData(100, new Date());
//const data = getCalibrationData();


function App() {

    const [hovered, setHovered] = useState(-1);    

    const selected = (hovered > -1) ? data[hovered] : null;

    return (
        <div className="App">
            <Chart 
                data={data}
                xAxis={{
                    min: 1,
                    max: data.length,
                    scale: 'linear',
                    title: 'Prevalence',
                    field: 'id'
                }}
                yAxis={{
                    min: 0,
                    max: 1000,
                    scale: 'log',
                    title: 'Identifiers',
                    field: 'value',
                    reversed: true
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
