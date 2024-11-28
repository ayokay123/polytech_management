"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { Riple } from "react-loading-indicators";

const data = [
  { name: "Group A", value: 92, fill: "#C3EBFA" },
  { name: "Group B", value: 8, fill: "#FAE27C" },
];

type Prediction = {
  studentId: string;
  predictedPerformance: number;
};

const Performance = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("/api/predict");
        const data = await response.json();
        console.log("here");
        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []); // Empty dependency array to fetch data on mount

  console.log(predictions);

  // Modify the data based on the prediction
  if (predictions.length !== 0) {
    const prediction = predictions.find((p) => p.studentId === userId);
    if (prediction) {
      data[0].value = prediction.predictedPerformance;
      data[1].value = 10 - prediction.predictedPerformance;
    }
  }

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      {loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <Riple color="#32cd32" size="medium" text="" textColor="" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                fill="#8884d8"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-3xl font-bold">{data[0].value.toFixed(1)}</h1>
            <p className="text-xs text-gray-300">of 10 max LTS</p>
          </div>
          <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
            Performance Measure
          </h2>
        </>
      )}
    </div>
  );
};

export default Performance;
