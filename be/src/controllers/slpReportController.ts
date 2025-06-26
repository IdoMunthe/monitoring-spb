import { Request, Response } from 'express';
import { getSPBReport } from '../services/spbReportService';
import {
  generateSLPReportPDF,
  generateSPBReportPDF,
} from '../utils/pdfGenerator';
import { getSLPReport } from '../services/slpReportService';

export const handlePrintSLPReport = async (req: Request, res: Response) => {
  const { tanggal, status, order, asc } = req.query;

  try {
    const report = await getSLPReport(
      String(tanggal),
      String(status),
      String(order),
      String(asc),
    );

    const pdf = await generateSLPReportPDF(report, {
      tanggal: String(tanggal),
      status: String(status),
      order: String(order),
      asc: String(asc),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=spb_report.pdf');
    res.send(pdf);
  } catch (err) {
    console.error('Failed to generate SPB PDF:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
