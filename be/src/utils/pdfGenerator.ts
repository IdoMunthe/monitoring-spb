import PDFDocument from 'pdfkit';
import PDFTable from 'pdfkit-table';
import { start } from 'repl';

interface SPBReportItem {
  spb_recordid: string;
  spb_lokasiasal: string;
  spb_lokasitujuan: string;
  spb_prdcd: string;
  spb_deskripsi: string;
  spb_jenis: string;
  spb_ctn: number;
  spb_pcs: number;
}

export const generateSPBReportPDF = async (
  data: SPBReportItem[],
  meta: {
    jenis: string;
    status: string;
    order: string;
    startDate: string;
    endDate: string;
  },
): Promise<Buffer> => {
  const { jenis, status, order, startDate, endDate } = meta;

  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  const now = new Date();
  const tglCetak = now.toLocaleString('id-ID');
  doc
    .fontSize(10)
    .text('PT. INTI CAKRAWALA CITRA', { continued: true })
    .text(`Jenis SPB : ${jenis}`, { align: 'right' })
    .text('INDOGROSIR CIKOKOL', { continued: true })
    .text(`Status : ${status}`, { align: 'right' });

  doc
    .text(`Order By : ${order}`, { align: 'right' })
    .text(`Tgl SPB : ${startDate} s/d ${endDate}`, { align: 'right' });

  doc
    .moveDown(1)
    .fontSize(14)
    .text('SLIP PENURUNAN BARANG', { align: 'center', underline: true });

  doc
    .fontSize(10)
    .text(`Tgl Cetak : ${tglCetak}`, { align: 'center' })

  doc.moveDown(); // add spacing before the table

  const chunks: any[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {
    // this event is handled inside the promise below
  });

  const table = {
    columnStyles: [30, 80, 80, 60, '*', 30, 30, 50, 40],
    data: [
      [
        'No',
        'Lokasi Asal',
        'Lokasi Tujuan',
        'PRDCD',
        'Deskripsi',
        'CTN',
        'PCS',
        'Jenis',
        'Status',
      ],
      ...data.map((item, index) => [
        String(index + 1),
        item.spb_lokasiasal ?? '',
        item.spb_lokasitujuan ?? '',
        item.spb_prdcd ?? '',
        item.spb_deskripsi ?? '',
        String(item.spb_ctn ?? '0'),
        String(item.spb_pcs ?? '0'),
        item.spb_jenis ?? '',
        item.spb_recordid == '3'
          ? 'Real'
          : item.spb_recordid == '2'
            ? 'Batal'
            : item.spb_recordid == '1'
              ? 'Turun'
              : 'Turun',
      ]),
    ],
  };

  // Wrap it in a Promise so we can await the buffer
  return new Promise((resolve, reject) => {
    doc.on('error', reject);
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });

    doc.table(table);
    doc.end();
  });
};
