const PDFDocument = require("pdfkit");

/**
 * generate80G(donation, orgInfo) -> Promise<Buffer>
 * Creates a simple 80G certificate PDF and returns it as a Buffer.
 * donation: Mongoose donation document (uses donorName, email, phone, amount, transactionId, receiptNumber, verifiedAt/createdAt)
 * orgInfo: { name, address, signatoryName }
 */
function generate80G(donation = {}, orgInfo = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];

      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const orgName = orgInfo.name || process.env.ORG_NAME || "Vridh Ashram";
      const orgAddress =
        orgInfo.address || process.env.ORG_ADDRESS || "Jammu, India";
      const signatory =
        orgInfo.signatoryName ||
        process.env.ORG_SIGNATORY ||
        "Vridh Ashram Representative";

      // Header
      doc.fontSize(18).text(orgName, { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(10).text(orgAddress, { align: "center" });
      doc.moveDown(0.8);

      doc
        .fontSize(14)
        .text("80G Tax Exemption Certificate", {
          align: "center",
          underline: true,
        });
      doc.moveDown(1);

      // Certificate meta
      doc
        .fontSize(11)
        .text(`Receipt Number: ${donation.receiptNumber || "N/A"}`);
      const certDate = donation.verifiedAt || donation.createdAt || new Date();
      doc.text(`Date: ${new Date(certDate).toLocaleDateString()}`);
      doc.moveDown(0.6);

      // Donor details
      doc.fontSize(12).text(`Donor Name: ${donation.donorName || "N/A"}`);
      doc.text(`Donor Email: ${donation.email || "N/A"}`);
      doc.text(`Donor Phone: ${donation.phone || "N/A"}`);
      doc.moveDown(0.4);
      doc.text(
        `Donation Amount (INR): ₹${
          donation.amount != null ? donation.amount : "N/A"
        }`
      );
      doc.text(`Transaction ID: ${donation.transactionId || "N/A"}`);
      doc.moveDown(0.8);

      // Body text
      const body = `This is to certify that the donation mentioned above has been received by ${orgName} and is eligible for deduction under Section 80G of the Income Tax Act, 1961, subject to the provisions of the said Act.`;
      doc.fontSize(11).text(body, { align: "justify" });
      doc.moveDown(2);

      // Signatory block
      doc.text(`For ${orgName}`, { align: "right" });
      doc.moveDown(2);
      doc.text(signatory, { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generate80G;
