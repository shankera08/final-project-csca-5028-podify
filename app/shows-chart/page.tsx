"use client";

import { ICategoryShowDuration } from "@/app/types/podcast";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./page.module.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const ShowsChart = () => {
  const [chartData, setChartData] = useState<
    { category: string; duration: number }[]
  >([]);

  useLayoutEffect(() => {
    fetch(`${appUrl}/api/queries/data-analyzer/category-show-duration`)
      .then((res) => res.json())
      .then(({ categoryShowDuration }) => {
        const data = categoryShowDuration?.map((ca: ICategoryShowDuration) => ({
          category: ca.name,
          duration: ca.total_duration,
        }));
        if (data) {
          setChartData(data);
        }
      });
  }, []);
  return (
    <>
      <Link href="/">
        <div className={styles.clickhere}>
          <h3>Back to Podcasts</h3>
        </div>
      </Link>
      <br></br>
      <h2>Chart displays the total content hours available by Category</h2>
      <br></br>
      <BarChart data={chartData} width={1000} height={500}>
        <XAxis dataKey="category" />
        <YAxis dataKey="duration" />
        <Legend
          payload={[
            {
              value: "content duration in hours",
              type: "square",
              color: "#33e3ff",
            },
          ]}
        />
        <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="category" fill="#33e3ff" />
        <Bar dataKey="duration" fill="#33e3ff" />
      </BarChart>
    </>
  );
};

export default ShowsChart;
