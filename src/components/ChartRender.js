import React from "react";
import { PieChart, Pie, Legend } from 'recharts'

export default function ChartRender(props) {
    const dataValues = [
        {typeValue: 'Sozinho', value: props.soloValue, fill:"#7C60DB"},
        {typeValue: 'Dividido', value: props.splitValue / 2, fill:"#FFA499"}
        ]
    const totalValue = props.soloValue + (props.splitValue/2)

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'end' : 'start'} dominantBaseline="central" fontWeight="bold">
                {`R$ ${(percent * totalValue).toFixed(2)}`}
            </text>
        );
    };
    return (
        <div className="charts">
            <p>{props.name}</p>
            <div className="charts--chart">
                <PieChart className="charts--donut" width={250} height={250}>
                    <Pie 
                        data={dataValues} 
                        dataKey="value" 
                        nameKey="name" 
                        outerRadius={100} 
                        innerRadius={60} 
                        fill="#8884d8"
                        labelLine={false} 
                        label={renderCustomizedLabel}
                        />
                </PieChart>
                <div className="charts--total">
                    <h2>{`R$ ${totalValue}`}</h2>
                    <text>Total</text>
                </div>
            </div>
        </div>
    )
}