"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type SLPData = {
  no: string;
  lokasi: string;
  plu: string;
  qtyinctn: string;
  qtyinpcs: string;
  exp_date: string;
  tgl: string;
  slp_id: string;
  id_receiving: string;
};

export default function formMonitoringSLP() {
  const [data, setData] = useState<SLPData[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [reportDate, setReportDate] = useState(today);
  const [reportStatus, setReportStatus] = useState("All");
  const [reportOrderBy, setReportOrderBy] = useState("SLP ID");
  const [reportDirection, setReportDirection] = useState<"ASC" | "DESC">("ASC");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidLoginModal, setShowInvalidLoginModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInputOTPModal, setShowInputOTPModal] = useState(false);
  const [showOTPSuccessfullyCreated, setShowOTPSuccessfullyCreated] =
    useState(false);
  const [OTP, setOTP] = useState("");

  const fetchSLPData = async () => {
    try {
      if (!isRefreshing) setIsLoading(true); // only for initial load
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/slp`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching SLP list:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false); // clear both loading states
    }
  };

  useEffect(() => {
    fetchSLPData();
  }, []);

  useEffect(() => {
    if (sortColumn && sortDirection) {
      const isNumeric = ["qtyinctn", "qtyinpcs"].includes(sortColumn);
      const isDate = ["tgl", "exp_date"].includes(sortColumn);

      const parseDate = (str: string) => {
        const [dd, mm, yyyy] = str.split("-");
        return new Date(`${yyyy}-${mm}-${dd}`); // ⚠️ ISO format
      };

      const sorted = [...data].sort((a, b) => {
        const valA = a[sortColumn as keyof SLPData];
        const valB = b[sortColumn as keyof SLPData];

        if (isNumeric) {
          return sortDirection === "asc"
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA);
        }

        if (isDate) {
          return sortDirection === "asc"
            ? parseDate(valA as string).getTime() -
                parseDate(valB as string).getTime()
            : parseDate(valB as string).getTime() -
                parseDate(valA as string).getTime();
        }

        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });

      setData(sorted);
    }

    if (!sortDirection) {
      fetchSLPData();
    }
  }, [sortColumn, sortDirection]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSLPData();
    setIsRefreshing(false);
  };

  const handleColumnClick = (col: string) => {
    if (sortColumn !== col) {
      setSortColumn(col);
      setSortDirection("asc");
    } else {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortColumn(null);
      }
    }
  };

  const handlePrint = async () => {
    try {
      const formatToDDMMYYYY = (dateStr: string) => {
        const d = new Date(dateStr);
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      };

      const params = {
        tanggal: formatToDDMMYYYY(reportDate),
        status: reportStatus,
        order: reportOrderBy,
        asc: reportDirection,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/report/slp`,
        {
          params,
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `laporan_slp ${params.tanggal}.pdf`;
      a.click();
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Download error", error);
      alert("Terjadi kesalahan saat mengunduh PDF");
    }
  };

  const handleApproval = async () => {
    try {
      const authRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/approval`,
        {
          username,
          password,
        }
      );
      console.log(authRes);
      setShowInputOTPModal(true);
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Terjadi kesalahan saat proses approval");
      }
    }
  };

  const handleOTP = async () => {
    try {
      if (!OTP) {
        alert("OTP tidak boleh kosong!");
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/otp`, {
        code: OTP,
        username: username,
      });
      setShowOTPSuccessfullyCreated(true);
      setShowApprovalModal(false);
      setTimeout(() => {
        setShowOTPSuccessfullyCreated(false);
      }, 1500);
      setOTP("");
      setUsername("")
      setPassword("")
    } catch (error) {
      console.log("error:", error);
    } finally {
      setShowInputOTPModal(false);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen flex justify-between flex-col gap-4">
      {/* Table */}
      <div className="overflow-auto border rounded shadow-md">
        <table className="min-w-full text-xs border border-gray-300">
          <thead className="bg-gray-200 text-left">
            <tr>
              {[
                "no",
                "lokasi",
                "plu",
                "qtyinctn",
                "qtyinpcs",
                "exp_date",
                "tgl",
                "slp_id",
                "id_receiving",
              ].map((header) => (
                <th
                  key={header}
                  onClick={() => handleColumnClick(header)}
                  className={`px-2 py-1 border cursor-pointer select-none ${
                    sortColumn === header ? "bg-blue-100" : ""
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {header}
                    {sortColumn === header && (
                      <span>
                        {sortDirection === "asc"
                          ? "▲"
                          : sortDirection === "desc"
                          ? "▼"
                          : ""}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? // Skeleton rows: let's show 5 dummy rows
                [...Array(10)].map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={rowIdx % 2 === 0 ? "bg-white" : "bg-red-100"}
                  >
                    {[
                      "no",
                      "lokasi",
                      "plu",
                      "qtyinctn",
                      "qtyinpcs",
                      "exp_date",
                      "tgl",
                      "slp_id",
                      "id_receiving",
                    ].map((col, colIdx) => (
                      <td key={colIdx} className="border px-2 py-1">
                        <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-red-100"}
                  >
                    <td className="border px-2 py-1">{row.no}</td>
                    <td className="border px-2 py-1">{row.lokasi}</td>
                    <td className="border px-2 py-1">{row.plu}</td>
                    <td className="border px-2 py-1">{row.qtyinctn}</td>
                    <td className="border px-2 py-1">{row.qtyinpcs}</td>
                    <td className="border px-2 py-1">{row.exp_date}</td>
                    <td className="border px-2 py-1">{row.tgl}</td>
                    <td className="border px-2 py-1">{row.slp_id}</td>
                    <td className="border px-2 py-1">{row.id_receiving}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-4 sticky bottom-0">
        {isRefreshing ? (
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 cursor-not-allowed"
            disabled
          >
            Refresh...
          </button>
        ) : (
          <button
            onClick={handleRefresh}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Refresh
          </button>
        )}
        <button
          onClick={() => setShowReportModal(true)}
          className="cursor-pointer px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
        >
          Report
        </button>
        <button
          className="cursor-pointer px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
          onClick={() => setShowApprovalModal(true)}
        >
          Set OTP
        </button>
      </div>
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600/25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Cetak SLP</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tgl SLP:</label>
              <input
                type="date"
                className="w-full border px-2 py-1 rounded text-sm"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Status:</label>
              <select
                className="w-full border px-2 py-1 rounded text-sm"
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value)}
              >
                <option>ALL</option>
                <option>Belum Direalisasi</option>
                <option>Batal</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Order By:
              </label>
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 border px-2 py-1 rounded text-sm"
                  value={reportOrderBy}
                  onChange={(e) => setReportOrderBy(e.target.value)}
                >
                  <option>SLP ID</option>
                  <option>Lokasi</option>
                  <option>PLU</option>
                </select>
                <select
                  className="w-[80px] border px-2 py-1 rounded text-sm"
                  value={reportDirection}
                  onChange={(e) =>
                    setReportDirection(e.target.value as "ASC" | "DESC")
                  }
                >
                  <option>ASC</option>
                  <option>DESC</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-600/25 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-2xl mb-4">Approval Required</h2>
            <input
              className="border p-2 w-full text-sm mb-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border p-2 w-full text-sm mb-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleApproval}
                className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setUsername("")
                  setPassword("")
                }}
                className="px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showInputOTPModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md flex flex-col gap-y-2">
            <p>Masukkan kode OTP yang diingikan:</p>
            <input
              type="text"
              placeholder=" masukkan OTP"
              className="border rounded"
              value={OTP}
              onChange={(e) => {
                setOTP(e.target.value);
              }}
            />
            <div className="flex gap-x-2">
              <button
                className="bg-blue-500 rounded hover:bg-blue-600 px-2 py-1 text-white cursor-pointer"
                onClick={handleOTP}
              >
                OK
              </button>
              <button
                className="bg-gray-500 rounded hover:bg-gray-600 px-2 py-1 text-white cursor-pointer"
                onClick={() => {
                  setShowInputOTPModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showOTPSuccessfullyCreated && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="text-green-600 font-semibold mb-2 text-2xl">
              OTP Berhasil dibuat!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
