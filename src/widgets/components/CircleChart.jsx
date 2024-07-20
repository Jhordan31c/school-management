import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';

const data = [
  { name: 'Segment A', value: 22, color: '#8884d8' },
  { name: 'Segment B', value: 18, color: '#a4de6c' },
  { name: 'Segment C', value: 41, color: '#d084d8' },
  { name: 'Segment D', value: 18, color: '#82ca9d' },
];

const data2 = [
    { name: 'Segment A', value: 22, color: '#3498db' }, // Azul claro
    { name: 'Segment B', value: 18, color: '#2ecc71' }, // Verde claro
    { name: 'Segment C', value: 41, color: '#e74c3c' }, // Rojo claro
    { name: 'Segment D', value: 18, color: '#f1c40f' }, // Amarillo claro
  ];
  

export const DonutChart = () => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          cornerRadius={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label
            value="Aulas"
            position="center"
            className="text-lg font-semibold"
            fill="#333"
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const DonutChart2 = () => {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data2}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            cornerRadius={5}
          >
            {data2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <Label
              value="Citas"
              position="center"
              className="text-lg font-semibold"
              fill="#333"
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };


const AllCharts = {DonutChart, DonutChart2};


export default AllCharts;
