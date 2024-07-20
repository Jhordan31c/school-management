import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ seriesData, categories }) => {
  const options = {
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false
      }
    },
    title: {
      text: 'Notas del Alumno',
      align: 'center',
      style: {
        fontSize: '16px',
        color: '#333'
      }
    },
    stroke: {
      width: 1,
      colors: ['transparent']
    },
    fill: {
      colors: ['#FBA948']
    },
    markers: {
      size: 4,
      colors: ['#FF8B5C', '#FF4560', '#775DD0'],
      strokeColor: 'transparent',
      strokeWidth: 2
    },
    xaxis: {
      categories: categories || [],
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#ffffff',
          connectorColors: '#ffffff',
          fill: {
            colors: ['#E3E3E3']
          }
        }
      }
    },
    colors: ['#FF4560', '#00E396', '#008FFB']
  };

  const series = [{
    name: 'Notas',
    data: seriesData || []
  }];

  return (
    <div className="flex justify-center items-center">
      <div id="chart">
        <ReactApexChart options={options} series={series} type="radar" height={350} />
      </div>
    </div>
  );
};

export default ApexChart;