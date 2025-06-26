"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface OptimalisasiData {
  rownum: number;
  lokasi: string;
  plu: string;
  qty: number;
  exp_date: Date;
  maximal: number;
  prd_frac: number;
}

export default function formOptimalisasi() {
  const [data, setData] = useState<OptimalisasiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columns = [
    "No",
    "Lokasi",
    "PLU",
    "QTY",
    "Exp Date",
    "Max Palet",
    "FRAC",
  ];

  const fetchOptimalisasiData = async () => {
    try {
      const res = await axios.get<OptimalisasiData[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/optimalisasi`
      );
      setData(res.data);
    } catch (error) {
      alert("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkeletonRows = () => {
    const dummyRows = Array.from({ length: 40 });
    return dummyRows.map((_, index) => (
      <tr key={index} className="animate-pulse">
        {columns.map((col) => (
          <td key={col} className="border px-2 py-1">
            <div className="h-4 bg-gray-400 rounded px-2 py-1"></div>
          </td>
        ))}
      </tr>
    ));
  };

  useEffect(() => {
    fetchOptimalisasiData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true)
    await fetchOptimalisasiData();
    setIsRefreshing(false);
  };

  return (
    <div>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr>
              {columns.map((item) => (
                <th key={item} className="border px-2 py-1">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-cyan-100">
            {isLoading
              ? renderSkeletonRows()
              : data.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-cyan-100" : "bg-white"}
                  >
                    <td className="border  text-center">{row.rownum}</td>
                    <td className="border  text-center">{row.lokasi}</td>
                    <td className="border  text-center">{row.plu}</td>
                    <td className="border  text-center">{row.qty}</td>
                    <td className="border  text-center">
                      {new Date(row.exp_date)
                        .toLocaleDateString("id-ID")
                        .replace(/\//g, "-")}
                    </td>
                    <td className="border  text-center">{row.maximal}</td>
                    <td className="border  text-center">{row.prd_frac}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-0 flex justify-center w-full bg-white py-1 z-50">
        {isRefreshing ? (
          <button
            className=" my-1 cursor-not-allowed px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
            disabled
          >
            Refresh...
          </button>
        ) : (
          <button
            onClick={handleRefresh}
            className=" my-1 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
