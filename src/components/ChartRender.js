import React from "react";
import { PieChart, Pie } from 'recharts'

export default function ChartRender(props) {
    const dataValues = [
        {typeValue: 'Sozinho', value: props.soloValue, fill:"#7C60DB"},
        {typeValue: 'Dividido', value: props.splitValue / 2, fill:"#FFA499"}
        ]
    return (
        <div className="charts">
            <p>{props.name}</p>
            <PieChart width={400} height={400}>
                <Pie data={dataValues} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" />
            </PieChart>
        </div>
    )
}