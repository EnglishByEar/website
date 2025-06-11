"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

interface ChartProps {
  data: any
  options: any
}

export function BarChart({ data, options }: ChartProps) {
  const { theme } = useTheme()
  const [chartOptions, setChartOptions] = useState(options)

  useEffect(() => {
    const isDark = theme === "dark"
    setChartOptions({
      ...options,
      plugins: {
        legend: {
          labels: {
            color: isDark ? "white" : "black",
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: isDark ? "white" : "black",
          },
          grid: {
            color: isDark ? "#666" : "#ccc",
          },
        },
        x: {
          ticks: {
            color: isDark ? "white" : "black",
          },
          grid: {
            color: isDark ? "#666" : "#ccc",
          },
        },
      },
    })
  }, [theme, options])

  return <Bar data={data} options={chartOptions} />
}

export function LineChart({ data, options }: ChartProps) {
  const { theme } = useTheme()
  const [chartOptions, setChartOptions] = useState(options)

  useEffect(() => {
    const isDark = theme === "dark"
    setChartOptions({
      ...options,
      plugins: {
        legend: {
          labels: {
            color: isDark ? "white" : "black",
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: isDark ? "white" : "black",
          },
          grid: {
            color: isDark ? "#666" : "#ccc",
          },
        },
        x: {
          ticks: {
            color: isDark ? "white" : "black",
          },
          grid: {
            color: isDark ? "#666" : "#ccc",
          },
        },
      },
    })
  }, [theme, options])

  return <Line data={data} options={chartOptions} />
}
