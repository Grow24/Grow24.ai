import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export const exportDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const format = req.query.format as string;

    if (!format || !['docx', 'pdf', 'xlsx'].includes(format)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Format must be "docx", "pdf", or "xlsx"',
        },
      });
    }

    // Fetch document with all data
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      include: {
        template: {
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: {
                fields: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        sections: {
          include: {
            section: {
              include: {
                fields: true,
              },
            },
            fieldValues: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    try {
      if (format === 'docx') {
        const docxBuffer = await generateDocx(document);
        const filename = `${document.title.replace(/[^a-z0-9]/gi, '-')}.docx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(docxBuffer);
      } else if (format === 'pdf') {
        const pdfBytes = await generatePdf(document);
        const filename = `${document.title.replace(/[^a-z0-9]/gi, '-')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(Buffer.from(pdfBytes));
      } else if (format === 'xlsx') {
        const excelBuffer = await generateExcel(document);
        const filename = `${document.title.replace(/[^a-z0-9]/gi, '-')}.xlsx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(excelBuffer);
      }
    } catch (genError: any) {
      console.error('Export generation error:', genError);
      return res.status(500).json({
        error: {
          code: 'EXPORT_GENERATION_ERROR',
          message: 'Failed to generate export file',
          details: genError.message,
        },
      });
    }
  } catch (error: any) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: {
        code: 'EXPORT_ERROR',
        message: 'Failed to export document',
        details: error.message,
      },
    });
  }
};

async function generateDocx(document: any): Promise<Buffer> {
  const children: any[] = [
    new Paragraph({
      text: document.title,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      text: `Template: ${document.template.name} | Level: ${document.level} | Status: ${document.status}`,
      spacing: { after: 400 },
    }),
  ];

  // Add sections
  for (const section of document.template.sections) {
    const sectionInstance = document.sections.find(
      (si: any) => si.templateSectionId === section.id
    );

    children.push(
      new Paragraph({
        text: `${section.order}. ${section.title}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    if (section.description) {
      children.push(
        new Paragraph({
          text: section.description,
          italics: true,
          spacing: { after: 200 },
        })
      );
    }

    // Add field values
    for (const field of section.fields) {
      const fieldValue = sectionInstance?.fieldValues.find(
        (fv: any) => fv.templateFieldId === field.id
      );
      const value = fieldValue?.value || '';

      if (value) {
        // Simple HTML to text conversion (basic)
        const text = value.replace(/<[^>]*>/g, '').trim();
        if (text) {
          children.push(
            new Paragraph({
              text: text,
              spacing: { after: 200 },
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

async function generatePdf(document: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const margin = 50;
  const lineHeight = 20;
  const sectionSpacing = 30;

  // Title
  page.drawText(document.title, {
    x: margin,
    y,
    size: 18,
    font: boldFont,
  });
  y -= 30;

  // Metadata
  page.drawText(
    `Template: ${document.template.name} | Level: ${document.level} | Status: ${document.status}`,
    {
      x: margin,
      y,
      size: 10,
      font,
    }
  );
  y -= sectionSpacing;

  // Sections
  for (const section of document.template.sections) {
    const sectionInstance = document.sections.find(
      (si: any) => si.templateSectionId === section.id
    );

    // Section title
    page.drawText(`${section.order}. ${section.title}`, {
      x: margin,
      y,
      size: 14,
      font: boldFont,
    });
    y -= lineHeight * 1.5;

    if (section.description) {
      page.drawText(section.description, {
        x: margin + 10,
        y,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= lineHeight;
    }

    // Field values
    for (const field of section.fields) {
      const fieldValue = sectionInstance?.fieldValues.find(
        (fv: any) => fv.templateFieldId === field.id
      );
      const value = fieldValue?.value || '';

      if (value) {
        const text = value.replace(/<[^>]*>/g, '').trim();
        if (text) {
          // Simple text wrapping (basic implementation)
          const words = text.split(' ');
          let line = '';
          for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            if (font.widthOfTextAtSize(testLine, 10) > 495) {
              if (line) {
                page.drawText(line, {
                  x: margin + 10,
                  y,
                  size: 10,
                  font,
                });
                y -= lineHeight;
                if (y < 50) {
                  const newPage = pdfDoc.addPage([595, 842]);
                  y = 800;
                }
              }
              line = word;
            } else {
              line = testLine;
            }
          }
          if (line) {
            page.drawText(line, {
              x: margin + 10,
              y,
              size: 10,
              font,
            });
            y -= lineHeight;
          }
        }
      }
    }

    y -= sectionSpacing;
    if (y < 100) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = 800;
    }
  }

  return await pdfDoc.save();
}

async function generateExcel(document: any): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Document');

  // Set column widths
  worksheet.columns = [
    { width: 15 }, // Section/Field column
    { width: 80 }, // Content column
  ];

  // Title row
  worksheet.mergeCells('A1:B1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = document.title;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 30;

  // Metadata row
  worksheet.mergeCells('A2:B2');
  const metaCell = worksheet.getCell('A2');
  metaCell.value = `Template: ${document.template.name} | Level: ${document.level} | Status: ${document.status}`;
  metaCell.font = { size: 10, italic: true };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 20;

  let currentRow = 3;

  // Add sections
  for (const section of document.template.sections) {
    const sectionInstance = document.sections.find(
      (si: any) => si.templateSectionId === section.id
    );

    // Section header
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    const sectionCell = worksheet.getCell(`A${currentRow}`);
    sectionCell.value = `${section.order}. ${section.title}`;
    sectionCell.font = { size: 14, bold: true };
    sectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    sectionCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Section description
    if (section.description) {
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const descCell = worksheet.getCell(`A${currentRow}`);
      descCell.value = section.description;
      descCell.font = { size: 10, italic: true };
      descCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    }

    // Field values
    for (const field of section.fields) {
      const fieldValue = sectionInstance?.fieldValues.find(
        (fv: any) => fv.templateFieldId === field.id
      );
      const value = fieldValue?.value || '';

      if (value) {
        // Simple HTML to text conversion
        const text = value.replace(/<[^>]*>/g, '').trim();
        if (text) {
          const fieldNameCell = worksheet.getCell(`A${currentRow}`);
          fieldNameCell.value = field.label;
          fieldNameCell.font = { size: 11, bold: true };
          fieldNameCell.alignment = { vertical: 'top', horizontal: 'left' };

          const valueCell = worksheet.getCell(`B${currentRow}`);
          valueCell.value = text;
          valueCell.font = { size: 11 };
          valueCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
          
          // Auto-adjust row height for wrapped text
          worksheet.getRow(currentRow).height = Math.max(20, (text.length / 80) * 15);
          currentRow++;
        }
      }
    }

    // Add spacing between sections
    currentRow++;
  }

  // Add borders to all cells with content
  for (let row = 1; row < currentRow; row++) {
    for (let col = 1; col <= 2; col++) {
      const cell = worksheet.getCell(row, col);
      if (cell.value) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export const exportToGoogleDoc = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    // Fetch document with all data
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      include: {
        template: {
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: {
                fields: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        sections: {
          include: {
            section: {
              include: {
                fields: true,
              },
            },
            fieldValues: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    // Generate a Google Docs compatible format
    // For now, return instructions and a placeholder URL
    // In production, this would use Google Docs API to create the document
    const docxBuffer = await generateDocx(document);
    
    // Convert to base64 for potential Google Docs API upload
    const base64Content = docxBuffer.toString('base64');

    res.json({
      url: `https://docs.google.com/document/create?title=${encodeURIComponent(document.title)}`,
      message: 'Document ready for Google Docs export. Click the link to create a new Google Doc. Note: HBMP remains the source of truth. Edits in Google Docs are not synced back.',
      instructions: 'To complete the export: 1) Click the link above, 2) Create a new Google Doc, 3) Upload the exported file or copy content manually.',
    });
  } catch (error: any) {
    console.error('Google Docs export error:', error);
    return res.status(500).json({
      error: {
        code: 'GOOGLE_DOCS_EXPORT_ERROR',
        message: 'Failed to export to Google Docs',
        details: error.message,
      },
    });
  }
};

export const exportToGoogleSheets = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    // Fetch document with all data
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      include: {
        template: {
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: {
                fields: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        sections: {
          include: {
            section: {
              include: {
                fields: true,
              },
            },
            fieldValues: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    // Generate Excel format that can be imported to Google Sheets
    const excelBuffer = await generateExcel(document);
    
    // Convert to base64 for potential Google Sheets API upload
    const base64Content = excelBuffer.toString('base64');

    res.json({
      url: `https://docs.google.com/spreadsheets/create?title=${encodeURIComponent(document.title)}`,
      message: 'Document ready for Google Sheets export. Click the link to create a new Google Sheet. Note: HBMP remains the source of truth. Edits in Google Sheets are not synced back.',
      instructions: 'To complete the export: 1) Click the link above, 2) Create a new Google Sheet, 3) File > Import > Upload and select the exported Excel file, or copy content manually.',
      downloadUrl: `/api/documents/${documentId}/export?format=xlsx`, // Provide direct download link
    });
  } catch (error: any) {
    console.error('Google Sheets export error:', error);
    return res.status(500).json({
      error: {
        code: 'GOOGLE_SHEETS_EXPORT_ERROR',
        message: 'Failed to export to Google Sheets',
        details: error.message,
      },
    });
  }
};

