import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 12,
    marginVertical: 4,
    fontWeight: "bold",
  },
  table: {
    // @ts-ignore
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: 10,
  },
  tableRow: { flexDirection: "row" },
  tableCol: { borderRightWidth: 1, borderBottomWidth: 1, padding: 2 },
  subCol: { flexDirection: "column", flex: 1 },
  checkbox: { textAlign: "center" },
});

interface SPBReportPDFProps {
  data: any[];
  filters: {
    jenis: string;
    status: string;
    order: string;
    startDate: string;
    endDate: string;
  };
}

export const SPBReportPDF = ({ data, filters }: SPBReportPDFProps) => {
  const { jenis, status, order, startDate, endDate } = filters;
  const formatDateTime = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };
  const tglCetak = formatDateTime(new Date());

  const statusReport: string =
    status == "3"
      ? "Belum Direalisasi"
      : status == "2"
      ? "Batal"
      : status == "1"
      ? "Belum Diturunkan"
      : "Belum Diturunkan";
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text>PT. INTI CAKRAWALA CITRA</Text>
          <Text>Jenis SPB: {jenis}</Text>
        </View>
        <View style={styles.header}>
          <Text>INDOGROSIR CIKOKOL</Text>
          <Text>Status: {statusReport}</Text>
        </View>
        <View style={styles.header}>
          <Text></Text>
          <Text>Order By: {order}</Text>
        </View>
        <View style={styles.header}>
          <Text></Text>
          <Text>
            Tgl SPB: {startDate} s/d {endDate}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>SLIP PENURUNAN BARANG</Text>
        <Text style={{ textAlign: "center", marginBottom: 6 }}>
          Tgl Cetak: {tglCetak}
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Head */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: "4%" }]}>No</Text>
            <View style={[styles.tableCol, { width: "30%" }]}>
              <Text style={{ textAlign: "center" }}>Lokasi</Text>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, { flex: 1 }]}>Asal</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>Tujuan</Text>
              </View>
            </View>
            <Text style={[styles.tableCol, { width: "6%" }]}>PRDCD</Text>
            <Text style={[styles.tableCol, { width: "18%" }]}>
              Deskripsi
            </Text>{" "}
            {/* Shrunk */}
            <Text style={[styles.tableCol, { width: "7%" }]}>CTN</Text>
            <Text style={[styles.tableCol, { width: "7%" }]}>PCS</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}>Jenis</Text>
            <Text style={[styles.tableCol, { width: "8%" }]}>Status</Text>
            {/* Now single column */}
          </View>

          {/* Table Body */}
          {data.map((row, i) => {
            return (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.tableCol, { width: "4%" }]}>{i + 1}</Text>

                <View style={[styles.tableCol, { width: "20%" }]}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCol, { flex: 1 }]}>
                      {row.spb_lokasiasal}
                    </Text>
                    <Text style={[styles.tableCol, { flex: 1 }]}>
                      {row.spb_lokasitujuan}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.tableCol, { width: "12%" }]}>
                  {row.spb_prdcd}
                </Text>
                <Text style={[styles.tableCol, { width: "18%" }]}>
                  {row.spb_deskripsi}
                </Text>
                <Text style={[styles.tableCol, { width: "7%" }]}>
                  {row.spb_ctn}
                </Text>
                <Text style={[styles.tableCol, { width: "7%" }]}>
                  {row.spb_pcs}
                </Text>
                <Text style={[styles.tableCol, { width: "10%" }]}>
                  {row.spb_jenis === "Otomatis" ? "Auto" : row.spb_jenis}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    { width: "12%", textAlign: "center" },
                  ]}
                >
                  {row.spb_status === "2"
                    ? "Batal"
                    : row.spb_status === "3"
                    ? "Real"
                    : "Turun"}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
