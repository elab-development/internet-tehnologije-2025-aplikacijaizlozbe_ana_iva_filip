"use client"; 
import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Kategorija", "Broj izložbi"],
  ["Ulična fotografija", 1],
  ["Portreti", 1],
  ["Priroda", 1],
  ["Ostalo", 2],
];

export const options = {
  title: "Zastupljenost umetničkih pravaca",
  is3D: true,
  backgroundColor: "transparent",
  colors: ["#2D5A27", "#4C9A2A", "#76BA1B", "#ACDF87"],
  pieHole: 0.4,
  legend: {
    position: "right",
    textStyle: { color: "#333", fontSize: 14 }
  },
  chartArea: { width: "100%", height: "80%" }
};

export default function StatistikaIzlozbi() {
  return (
    <div className="w-full p-4">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
}