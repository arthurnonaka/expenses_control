import React from "react";
import { PieChart, Pie, Legend } from 'recharts'

export default function ChartRender(props) {
    const outerRadius_ = 70
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
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central" 
                fontWeight="bold"
                fontSize="small">
                    {percent>0?`${(percent * totalValue).toFixed(0)}`:""}
            </text>
        );
    };
    return (
        <div className="charts">
            <h3>{props.name}</h3>
            <div className="charts--chart">
                <PieChart className="charts--donut" width={175} height={outerRadius_*2+10}>
                    <Pie 
                        data={dataValues} 
                        dataKey="value" 
                        nameKey="name" 
                        outerRadius={outerRadius_} 
                        innerRadius={40} 
                        fill="#8884d8"
                        labelLine={false} 
                        label={renderCustomizedLabel}
                        />
                </PieChart>
                <div className="charts--total">
                    <h3>{`R$${totalValue}`}</h3>
                    <text>Total</text>
                </div>
            </div>
        </div>
    )
}