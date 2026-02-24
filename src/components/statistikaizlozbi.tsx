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