import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

/**
 * @param {{
 *   total: number,
 *   trendPercentage: number,
 *   isPositive: boolean,
 *   chartData: Array<{date: string, dayName: string, amount: number}>
 * }} props
 */
export const SpendingTrendGraph = ({ total, trendPercentage, isPositive, chartData, currencyCode = 'INR' }) => {
  const formattedTotal = formatCurrency(total, currencyCode);

  const data = {
    labels: chartData.map(d => d.dayName),
    datasets: [
      {
        fill: true,
        data: chartData.map(d => d.amount),
        borderColor: '#00e6cb', // primary color
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(0, 230, 203, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 230, 203, 0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#00e6cb',
        pointBorderColor: '#00e6cb',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y, currencyCode);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
    layout: {
      padding: { top: 10, bottom: 0, left: 10, right: 10 }
    }
  };

  return (
    <Card variant="emerald">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Weekly Activity</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight">{formattedTotal}</p>
            <span className={`text-[11px] font-bold ${isPositive ? 'text-emerald-500' : 'text-destructive'}`}>
              {isPositive ? '↓' : '↑'} {trendPercentage}%
            </span>
          </div>
        </div>
        <button className="text-[10px] text-primary font-bold px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 uppercase tracking-widest">
          Details
        </button>
      </div>

      <div className="w-full h-32 relative">
        <Line options={options} data={data} />
        <div className="flex justify-between mt-4 px-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          {chartData.map((d, index) => (
            <span key={index}>{d.dayName}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};
