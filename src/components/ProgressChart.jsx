import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

const ProgressChart = ({ type, data, title }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const { categories, series: dataSeries, yTitle, tooltipSuffix } = data || {};
    
    // For radial chart (single value), we handle it differently
    if (type === 'radial') {
      setChartType('radialBar');
      setSeries(Array.isArray(data) ? data : [0]);
      
      setOptions({
        chart: {
          type: 'radialBar',
          height: 280,
          toolbar: {
            show: false
          }
        },
        colors: ['#4F46E5'],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 15,
              size: '70%'
            },
            track: {
              background: '#e2e8f0',
              strokeWidth: '97%',
              margin: 5,
              dropShadow: {
                enabled: false
              }
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                color: '#4F46E5',
                fontSize: '30px',
                fontWeight: 'bold',
                formatter: function(val) {
                  return val + '%';
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#06B6D4'],
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: []
      });
    } 
    // Line chart
    else if (type === 'line') {
      setChartType('line');
      setSeries(dataSeries || []);
      
      setOptions({
        chart: {
          height: 280,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.05
          },
          toolbar: {
            show: false
          },
          fontFamily: 'Inter, sans-serif'
        },
        colors: ['#4F46E5', '#06B6D4', '#F97316'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        grid: {
          borderColor: '#e2e8f0',
          row: {
            colors: ['#f8fafc', 'transparent'],
            opacity: 0.1
          }
        },
        markers: {
          size: 4
        },
        xaxis: {
          categories: categories || [],
          labels: {
            style: {
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        yaxis: {
          title: {
            text: yTitle || '',
            style: {
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + (tooltipSuffix || '');
            }
          }
        },
        theme: {
          mode: 'light'
        }
      });
    }
  }, [type, data]);

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {Object.keys(options).length > 0 && <Chart options={options} series={series} type={chartType} height={280} />}
    </motion.div>
  );
};

export default ProgressChart;