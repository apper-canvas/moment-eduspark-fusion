import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';

const ProgressChart = ({ progressData }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (!progressData || !progressData.length) {
      // Set empty chart if no data
      setChartSeries([{
        name: 'Minutes Studied',
        data: []
      }]);
      return;
    }

    // Process the data
    // Sort by date, descending
    const sortedData = [...progressData].sort((a, b) => 
      new Date(a.activityDate) - new Date(b.activityDate)
    );

    // Extract dates and minutes studied
    const dates = sortedData.map(item => 
      format(new Date(item.activityDate), 'MMM dd')
    );
    
    const minutes = sortedData.map(item => item.minutesStudied || 0);

    setChartOptions({
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        },
        background: 'transparent',
        fontFamily: 'Inter, sans-serif'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: dates,
        labels: {
          style: {
            colors: '#94a3b8'
          }
        }
      },
      colors: ['#4F46E5'],
      tooltip: {
        theme: 'dark'
      }
    });

    setChartSeries([{
      name: 'Minutes Studied',
      data: minutes
    }]);
  }, [progressData]);

  return <Chart options={chartOptions} series={chartSeries} type="area" height={350} />;
};

export default ProgressChart;