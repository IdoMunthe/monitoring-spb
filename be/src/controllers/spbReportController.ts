import { Request, Response } from 'express';
import { getSPBReport } from '../services/spbReportService';
import { generateSPBReportPDF } from '../utils/pdfGenerator';

export const handlePrintSPBReport = async (req: Request, res: Response) => {
  const {
    startDate,
    endDate,
    lokasi = '',
    jenis = '',
    status = '',
    order = '',
    sort = 'ASC',
  } = req.query;

  try {
    const report = await getSPBReport(
      String(startDate),
      String(endDate),
      String(lokasi),
      String(jenis),
      String(status),
      String(order),
      String(sort),
    );

    const pdfBuffer = await generateSPBReportPDF(report, {
      jenis: String(jenis),
      status: String(status),
      order: String(order),
      startDate: String(startDate),
      endDate: String(endDate),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=spb_report.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Failed to generate SPB PDF:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
