import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js/auto";
Chart.register(...registerables);

function BarChart({ chartData }) {

        return (
                <Bar data={chartData} />
        );
}

export default BarChart;