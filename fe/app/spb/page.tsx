"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "../../app/globals.css";
import { SPBReportPDF } from "@/components/SPBReportPDF";
import { PDFViewer } from "@react-pdf/renderer";

export type RawSPB = {
  spb_id: string;
  spb_lokasiasal: string;
  spb_lokasitujuan: string;
  spb_prdcd: string;
  spb_deskripsi: string;
  spb_qty: number;
  spb_minusctn: number;
  spb_minuspcs: number;
  spb_recordid: string;
  spb_jenis: string;
  spb_kodespi: string;
};

type RackData = {
  spb_id: string;
  lokasiAsal: string;
  lokasiTujuan: string;
  plu: string;
  description: string;
  qty: number;
  minusCtn: number;
  minusPcs: number;
  status: string;

  // Add raw fields JUST for coloring logic:
  spb_jenis: string;
  spb_kodespi: string;
  spb_recordid: string;
};

export default function FormUtama() {
  const today = new Date().toISOString().split("T")[0];

  const [rackCode, setRackCode] = useState("ALL");
  const [rackType, setRackType] = useState("ALL");
  const [data, setData] = useState<RackData[]>([]);
  const [rackCodes, setRackCodes] = useState<string[]>([]);
  const [rackTypes, setRackTypes] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAreYouSureBatalSPB, setShowAreYouSureBatalSPB] = useState(false);
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvalidLoginModal, setShowInvalidLoginModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [startDate, setstartDate] = useState(today);
  const [endDate, setendDate] = useState(today);
  const [lokasi, setLokasi] = useState("ALL");
  const [jenis, setJenis] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [order, setOrder] = useState("Waktu Antrian");
  const [asc, setAsc] = useState("ASC");
  const [pdfData, setPdfData] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [pdfFilters, setPdfFilters] = useState({
    jenis: "",
    status: "",
    order: "",
    startDate: "",
    endDate: "",
  });

  const columns = [
    { key: "lokasiAsal", label: "Lokasi Asal", width: "w-[100px]" },
    { key: "lokasiTujuan", label: "Lokasi Tujuan", width: "w-[100px]" },
    { key: "plu", label: "PLU", width: "w-[80px]" },
    { key: "description", label: "Description", width: "w-[200px]" },
    { key: "qty", label: "Qty (PCS)", width: "w-[80px]" },
    { key: "minusCtn", label: "Minus (CTN)", width: "w-[100px]" },
    { key: "minusPcs", label: "Minus (PCS)", width: "w-[100px]" },
    { key: "status", label: "Status", width: "w-[120px]" },
  ];

  useEffect(() => {
    setRackCodes([
      "ALL",
      "R",
      "F",
      "O",
      "E",
      "K",
      "P",
      "T",
      "X",
      "A",
      "G",
      "D",
      "Q",
      "U",
    ]);
    setRackTypes(["ALL", "B", "I", "P", "S", "C", "F"]);
  }, []);

  const getLabelForCode = (code: string) => {
    const labels: Record<string, string> = {
      ALL: "ALL",
      R: "R - REGULER",
      F: "F - FLOOR",
      O: "O - COUNTER RUPA-RUPA",
      E: "E - COUNTER ELECTRONIC",
      K: "K - COUNTER COSMETIC",
      P: "P - COUNTER PERISHABLE",
      T: "T - COUNTER ROKOK",
      X: "X - OTHER INCOME",
      A: "A - ATAS",
      G: "G - GUDANG",
      D: "D - DPD",
      Q: "Q - COUNTER DPD",
      U: "U - GAS",
    };

    return labels[code] || code;
  };

  const getLabelForType = (type: string) => {
    const labels: Record<string, string> = {
      ALL: "ALL",
      B: "B - BEAM",
      I: "I - INNER",
      P: "P - PALLET",
      S: "S - STORAGE",
      C: "C - COOLER",
      F: "F - FREEZER",
    };

    return labels[type] || type;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        kodeRak: rackCode,
        tipeRak: rackType,
      };

      const res = await axios.get<RawSPB[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/spb`,
        {
          params,
        }
      );

      const transformed: RackData[] = res.data.map((item) => ({
        lokasiAsal: item.spb_lokasiasal,
        lokasiTujuan: item.spb_lokasitujuan,
        plu: item.spb_prdcd,
        description: item.spb_deskripsi,
        qty: item.spb_qty,
        minusCtn: item.spb_minusctn,
        minusPcs: item.spb_minuspcs,
        status:
          item.spb_recordid === "3" ? "Belum Direalisasi" : "Belum Diturunkan",

        // for coloring logic:
        spb_jenis: item.spb_jenis,
        spb_kodespi: item.spb_kodespi,
        spb_recordid: item.spb_recordid,
        spb_id: item.spb_id,
      }));

      setData(transformed);
    } catch (error) {
      console.log("Failed to fetch SPB Data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rackCode, rackType]);

  const handleColumnClick = (colKey: string) => {
    if (sortColumn != colKey) {
      setSortColumn(colKey);
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

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aVal = a[sortColumn as keyof RackData];
    const bVal = b[sortColumn as keyof RackData];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleBatal = () => {
    if (selectedRowIndex === null) {
      setShowNoSelectionModal(true);
      setTimeout(() => {
        setShowNoSelectionModal(false);
      }, 2000);
      return;
    }

    setShowAreYouSureBatalSPB(true);
  };

  const getRowColor = (row: RackData): string => {
    const isAuto = row.spb_jenis?.toUpperCase().includes("OTOMATIS");
    const isRecord3 = row.spb_recordid === "3";
    const isIGR = !!row.spb_kodespi;
    const lokasiStartsDG =
      row.lokasiTujuan?.startsWith("D") || row.lokasiTujuan?.startsWith("G");

    if (!isAuto) {
      return isRecord3 ? "manual-red" : "manual-orange";
    }

    if (!isIGR) {
      if (lokasiStartsDG) {
        return isRecord3 ? "auto-gudang-dark" : "auto-gudang-light";
      } else {
        return isRecord3 ? "auto-toko-dark" : "auto-toko-light";
      }
    }

    return isRecord3 ? "auto-igr-dark" : "auto-igr-light";
  };

  const renderSkeletonRows = () => {
    const dummyRows = Array.from({ length: 30 });
    return dummyRows.map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="animate-pulse">
        {columns.map((col) => (
          <td key={col.key} className="px-2 py-2 border-b border-r">
            <div className="h-4 bg-gray-400 rounded"></div>
          </td>
        ))}
      </tr>
    ));
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDelete = async () => {
    try {
      const selectedRow = data[selectedRowIndex!];

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cancel`, {
        recordId: selectedRow.spb_id,
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

      setShowApprovalModal(false);
      fetchData();
    } catch (error: any) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      }
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
      const { status, userLevel } = authRes.data;

      if (status !== "valid") {
        setShowInvalidLoginModal(true);
        setTimeout(() => {
          setShowInvalidLoginModal(false);
        }, 3000);
        return;
      }

      if (userLevel >= 2) {
        alert("User tidak memiliki izin untuk menghapus data");
        return;
      }

      handleDelete();
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

  const handlePrint = async () => {
    try {
      if (startDate > endDate) {
        alert("Tanggal Awal tidak boleh lebih besar dari Tanggal Akhir");
        return;
      }
      setLoadingPreview(true);
      setDownloading(true);
      console.log("is loading");

      const formatToDDMMYYYY = (dateStr: string) => {
        const d = new Date(dateStr);
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      };

      const params = new URLSearchParams({
        startDate: formatToDDMMYYYY(startDate),
        endDate: formatToDDMMYYYY(endDate),
        lokasi,
        jenis,
        status,
        order,
        asc,
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/report/spb?${params.toString()}`
      );
      if (!res.ok)
        throw new Error("Gagal mengambil pdf dari server. Coba lagi!");

      const blob = await res.blob();

      // ⏬ Optional: download directly
      const pdfUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `laporan_spb ${startDate} s.d ${endDate}.pdf`;
      a.click();
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      console.error("Gagal memuat data laporan:", err);
      alert("Terjadi kesalahan saat memuat data.");
    } finally {
      setDownloading(false);
      setLoadingPreview(false); // 🟢 stop loading
    }
  };

  // make background unscrollable
  useEffect(() => {
    const hasModalOpen =
      showPreview ||
      showReportModal ||
      showSuccessModal ||
      showApprovalModal ||
      showAreYouSureBatalSPB ||
      showInvalidLoginModal ||
      showNoSelectionModal;

    const body = document.body;

    if (hasModalOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      body.style.overflow = "";
      body.style.paddingRight = "";
    }

    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [
    showPreview,
    showReportModal,
    showSuccessModal,
    showApprovalModal,
    showAreYouSureBatalSPB,
    showInvalidLoginModal,
    showNoSelectionModal,
  ]);

  return (
    <div className="px-2 cursor-default">
      {/* Filter Controls */}
      <div className="flex items-center justify-center space-x-4 my-4">
        <label>
          <span className="font-semibold">Kode Rak:</span>
          <select
            className="ml-2 border rounded px-2 cursor-pointer"
            value={rackCode}
            onChange={(e) => setRackCode(e.target.value)}
          >
            {rackCodes.map((code) => (
              <option key={code} value={code}>
                {getLabelForCode(code)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="font-semibold">Tipe Rak:</span>
          <select
            className="ml-2 border rounded px-2 cursor-pointer"
            value={rackType}
            onChange={(e) => setRackType(e.target.value)}
          >
            {rackTypes.map((type) => (
              <option key={type} value={type}>
                {getLabelForType(type)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-x-2">
          <button
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`${
              autoRefresh ? "bg-green-600" : "bg-gray-500"
            } hover:bg-opacity-80 text-sm font-medium px-3 py-1 rounded cursor-pointer text-white`}
          >
            {autoRefresh ? "Refresh On " : "Refresh Off"}
          </button>

          <button
            onClick={handleReport}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-1 rounded cursor-pointer"
          >
            Report
          </button>
          <button
            onClick={handleBatal}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-2 py-1 text-center text-sm border-r cursor-pointer ${
                    col.width ?? ""
                  } ${sortColumn === col.key ? "bg-gray-400" : ""}`}
                  onClick={() => handleColumnClick(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key && (
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
          <tbody className="bg-blue-200">
            {loading ? (
              renderSkeletonRows()
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="text-2xl h-screen flex items-center justify-center">
                    Tidak ada data
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${getRowColor(row)} ${
                    selectedRowIndex === idx ? "!bg-red-400" : ""
                  }`}
                  onClick={() =>
                    setSelectedRowIndex((prev) => (prev === idx ? null : idx))
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className=" px-2 py-1 text-sm border-b truncate cursor-pointer border-r"
                    >
                      {row[col.key as keyof RackData]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <footer className="sticky bottom-0 flex gap-x-1 py-2 bg-white">
        <div className="bg-[#FFA07A] px-2 font-semibold rounded-sm">Manual</div>
        <div className="bg-[#ADD8E6] px-2 font-semibold rounded-sm">
          Gudang Otomatis
        </div>
        <div className="bg-[#90EE90] px-2 font-semibold rounded-sm">
          Toko Otomatis
        </div>
        <div className="bg-[#b8860b] px-2 font-semibold rounded-sm">
          Stock Point IGR
        </div>
      </footer>

      {/* MODALS */}
      {showAreYouSureBatalSPB && selectedRowIndex !== null && (
        <div className="fixed inset-0  bg-gray-600/25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg font-bold mb-4">Konfirmasi</h2>
            <p className="mb-4">
              Apakah anda yakin ingin membatalkan SPB untuk PLU{" "}
              <span className="font-semibold">
                {data[selectedRowIndex].plu}
              </span>{" "}
              di lokasi{" "}
              <span className="font-semibold">
                {data[selectedRowIndex].lokasiTujuan}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAreYouSureBatalSPB(false); // close confirmation
                  setShowApprovalModal(true); // ✅ show approval modal
                }}
                className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
              >
                Ya, Batalkan
              </button>
              <button
                onClick={() => setShowAreYouSureBatalSPB(false)} // ❌ No
                className="px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-600/25 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-2xl">Approval Required</h2>
            <div className="text-lg mb-6">
              Minimal Level <b>Supervisor</b>
            </div>
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
                  setUsername("");
                  setPassword("");
                }}
                className="px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoSelectionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600/25"
          onClick={() => setShowNoSelectionModal(false)} // 🖱️ Click anywhere to close
        >
          <div
            className="bg-white p-4 py-8 rounded shadow-lg text-center"
            onClick={(e) => e.stopPropagation()} // ❌ prevent modal from closing when clicking inside
          >
            <p className="text-xl font-semibold text-gray-700 ">
              Pilih SPB yang ingin dibatalkan terlebih dahulu!
            </p>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-2xl font-semibold text-green-600">
              Data berhasil dibatalkan
              <span className="block">✅</span>
            </p>
          </div>
        </div>
      )}

      {showInvalidLoginModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="text-red-600 font-semibold mb-2 text-2xl">
              Username atau password salah <span className="block">❌</span>
            </p>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Laporan SPB</h2>

            <div className="space-y-4 text-sm">
              {/* Lokasi */}
              <div>
                <label className="block font-medium mb-1">Lokasi</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                >
                  <option value="ALL">Semua</option>
                  <option value="Toko">Toko</option>
                  <option value="Gudang">Gudang</option>
                </select>
              </div>

              {/* Jenis */}
              <div>
                <label className="block font-medium mb-1">Jenis SPB</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                >
                  <option value="ALL">Semua</option>
                  <option value="OTOMATIS">Otomatis</option>
                  <option value="MANUAL">Manual</option>
                  <option value="TAC">TAC</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium mb-1">Status</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ALL">Semua</option>
                  <option value="NULL">Belum Diturunkan</option>
                  <option value="3">Belum Direalisasi</option>
                  <option value="2">Batal</option>
                </select>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block font-medium mb-1">Tanggal SPB</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={startDate}
                    onChange={(e) => setstartDate(e.target.value)}
                  />
                  <span className="text-gray-500">s/d</span>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={endDate}
                    onChange={(e) => setendDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Order By */}
              <div>
                <label className="block font-medium mb-1">
                  Urut Berdasarkan
                </label>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 w-1/2"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  >
                    <option value="Waktu Antrian">Waktu Antrian</option>
                    <option value="Lokasi Tujuan">Lokasi Tujuan</option>
                    <option value="Lokasi Asal">Lokasi Asal</option>
                  </select>
                  <span className="text-white">s/d</span>
                  <select
                    className="border rounded px-2 py-1 w-1/2"
                    value={asc}
                    onChange={(e) => setAsc(e.target.value)}
                  >
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                disabled={downloading}
                className={`${
                  downloading
                    ? "bg-gray-400 cursor-progress"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded cursor-pointer`}
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0  z-50 flex justify-center items-center">
          <div className="bg-white p-4 w-[80vw] h-[95vh] rounded shadow-lg relative">
            <div className="flex justify-end mb-2">
              <button
                className="text-red-500 font-bold"
                onClick={() => setShowPreview(false)}
              >
                ✖
              </button>
            </div>

            {loadingPreview ? (
              <div className="flex items-center justify-center h-full bg-red-500 z-51">
                <div className="animate-pulse w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-black text-lg">
                    Loading PDF Preview...
                  </span>
                </div>
              </div>
            ) : (
              <PDFViewer width="100%" height="100%">
                <SPBReportPDF data={pdfData} filters={pdfFilters} />
              </PDFViewer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
