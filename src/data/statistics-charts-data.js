import { chartsConfig } from "@/configs";

const websiteViewsChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Actividades",
      data: [50, 20, 10, 22, 50, 10, 40],
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#F5BFB0",
    plotOptions: {
      bar: {
        columnWidth: "25%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
};

const completedTaskChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Citas",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#EDCA97"],
    
    stroke: {
      lineCap: "round",
      width: 7,
    },
    markers: {
      size: 6,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};

const pieChart = {
  type: "pie",
  height: 220,
  series: [50, 20, 10, 22, 50, 10, 40],
  options: {
    ...chartsConfig,
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    colors: ["#388e3c", "#FF5733", "#C70039", "#900C3F", "#581845", "#1F618D", "#148F77"],
    legend: {
      show: true,
      position: 'bottom',
    },
  },
};


const completedTasksChart = {
  ...completedTaskChart,
  series: [
    {
      name: "Citas",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Actividades Mensuales",
    description: "",
    footer: "Ultima actualizacion",
    chart: websiteViewsChart,
  },
  {
    color: "white",
    title: "Citas Mensuales",
    description: "",
    footer: "Recien actualizado",
    chart: completedTasksChart,
  },
];

export const statisticsChartsDataPay = [
  {
    color: "white",
    title: "Pagos realizados",
    description: "",
    footer: "Ultima actualizacion",
    chart: websiteViewsChart,
  },
  {
    color: "white",
    title: "Reparaciones",
    description: "",
    footer: "Actualizado recientemente",
    chart: pieChart,
  },
  {
    color: "white",
    title: "Deudas",
    description: "",
    footer: "Recien actualizado",
    chart: completedTasksChart,
  },
];

const AllStatistics = [statisticsChartsData, statisticsChartsDataPay];

export default AllStatistics;
