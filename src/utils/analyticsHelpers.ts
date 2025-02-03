import { ExpenseData } from "../types"

export const parseDataForChart = (expenses: ExpenseData[]) => {
        const arr = []
        const data: any = expenses.reduce((acc, curr) => {
                return {
                        ...acc,
                        [curr.type]: acc[curr.type] + curr.quantity,
                }
        }, {
                'dining out': 0,
                grocery: 0,
                household: 0,
                misc: 0,
                mortgage: 0,
                pet: 0,
                rent: 0,
        })
        for (const type in data) {
                arr.push(data[type])
        }
        return arr
}