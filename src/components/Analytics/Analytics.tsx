import { useSelector } from "react-redux";
import BarChart from "./BarChart";
import { selectExpenses } from "../../slices/userSlice";
import { useState } from "react";
import { parseDataForChart } from "../../utils/analyticsHelpers";
// import { ExpenseType } from "../../types";

const purchaseTypes = ['dining out', 'grocery', 'household', 'misc', 'mortgage', 'pet', 'rent']

function Analytics() {
        const expenses = useSelector(selectExpenses)
        const data = parseDataForChart(expenses)
        const [expenseChartData, setExpenseChartData] = useState({
                labels: purchaseTypes,
                datasets: [
                        {
                                label: "Purchase Type",
                                data: data,
                                backgroundColor: [
                                        "rgba(75,192,192,1)",
                                        "#ecf0f1",
                                        "#50AF95",
                                        "#f3ba2f",
                                        "#2a71d0",
                                ],
                                borderColor: "black",
                                borderWidth: 2,
                        },
                ],
        })

        return (
                <div style={{ width: 1000 }}>Analytics page
                        <BarChart chartData={expenseChartData} />
                </div>
        );
}

export default Analytics;