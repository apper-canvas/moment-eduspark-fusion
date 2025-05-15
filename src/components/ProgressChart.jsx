import { useState } from 'react';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';

const ProgressChart = ({ type, data, title, height = 350 }) => {
  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
      colors: ['#4F46E5', '#06B6D4', '#F97316'],
      tooltip: {
        enabled: true,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
      title: {
        text: title,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a'
        }
      }
    };

    if (type === 'radial') {
      return {
        ...baseOptions,
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                fontSize: '22px',
                fontWeight: '600',
                formatter: function(val) {
                  return val + '%';
                }
              },
              total: {
                show: true,
                label: 'Completion',
                formatter: function() {
                  return data[0] + '%';
                }
              }
            },
            track: {
              background: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
            }
          }
        },
        labels: ['Completion'],
      };
    }

    if (type === 'bar') {
      return {
        ...baseOptions,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: data.categories,
        },
        yaxis: {
          title: {
            text: data.yTitle || '',
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + (data.tooltipSuffix || '');
            }
          }
        }
      };
    }

    if (type === 'line') {
      return {
        ...baseOptions,
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        xaxis: {
          categories: data.categories,
          labels: {
            formatter: function(value) {
              return format(new Date(value), 'MMM d');
            }
          }
        },
        yaxis: {
          title: {
            text: data.yTitle || '',
          },
        },
        markers: {
          size: 4,
          strokeWidth: 0,
        },
        grid: {
          borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
        }
      };
    }

    return baseOptions;
  };

  const getChartSeries = () => {
    if (type === 'radial') {
      return [data[0]];
    }
    
    return data.series;
  };

  return (
    <div className="card h-full">
      <Chart
        options={getChartOptions()}
        series={getChartSeries()}
        type={type === 'radial' ? 'radialBar' : type}
        height={height}
        width="100%"
      />
    </div>
  );
};

export default ProgressChart;