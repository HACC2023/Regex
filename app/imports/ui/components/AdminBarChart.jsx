// BarChartComponent.js
import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Frequency',
        data: data.map(d => d.value),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

BarChartComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default BarChartComponent;
