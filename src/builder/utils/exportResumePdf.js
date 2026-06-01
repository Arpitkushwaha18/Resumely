import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

function createFilename(fullName) {
  const safeName = fullName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return safeName ? `${safeName}_Resume.pdf` : "resume.pdf";
}

function createPage(source) {
  const page = source.cloneNode(false);
  Object.assign(page.style, {
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    minHeight: `${A4_HEIGHT_PX}px`,
    aspectRatio: "auto",
    overflow: "hidden",
    boxShadow: "none",
    background: "#ffffff",
  });
  return page;
}

function createExportPages(source, stage) {
  const blocks = Array.from(source.children).map((child) => child.cloneNode(true));
  const pages = [];
  let page = createPage(source);
  stage.appendChild(page);
  pages.push(page);

  blocks.forEach((block) => {
    page.appendChild(block);

    if (page.scrollHeight <= A4_HEIGHT_PX) return;

    page.removeChild(block);
    if (page.children.length > 0) {
      page = createPage(source);
      stage.appendChild(page);
      pages.push(page);
      page.appendChild(block);
    } else {
      page.appendChild(block);
    }

    if (page.scrollHeight > A4_HEIGHT_PX) {
      page.style.height = "auto";
      page.style.overflow = "visible";
      page = createPage(source);
      stage.appendChild(page);
      pages.push(page);
    }
  });

  if (pages.at(-1)?.children.length === 0 && pages.length > 1) {
    pages.at(-1).remove();
    pages.pop();
  }

  return pages;
}

function addCanvasPages(pdf, canvas, isFirstPdfPage) {
  const sliceHeight = Math.round((canvas.width * A4_HEIGHT_MM) / A4_WIDTH_MM);
  let offset = 0;
  let first = isFirstPdfPage;

  while (offset < canvas.height) {
    if (!first) pdf.addPage("a4", "portrait");
    first = false;

    const currentSliceHeight = Math.min(sliceHeight, canvas.height - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = currentSliceHeight;
    slice.getContext("2d").drawImage(canvas, 0, offset, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight);

    const imageHeight = (currentSliceHeight * A4_WIDTH_MM) / canvas.width;
    pdf.addImage(slice.toDataURL("image/png"), "PNG", 0, 0, A4_WIDTH_MM, imageHeight, undefined, "FAST");
    offset += currentSliceHeight;
  }

  return first;
}

export async function exportResumePdf(source, fullName) {
  if (!source) throw new Error("Resume preview is not ready yet.");

  const stage = document.createElement("div");
  Object.assign(stage.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${A4_WIDTH_PX}px`,
    background: "#ffffff",
    zIndex: "-1",
  });
  document.body.appendChild(stage);

  try {
    const pages = createExportPages(source, stage);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    let isFirstPdfPage = true;

    for (const page of pages) {
      const canvas = await html2canvas(page, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: A4_WIDTH_PX,
      });
      isFirstPdfPage = addCanvasPages(pdf, canvas, isFirstPdfPage);
    }

    pdf.save(createFilename(fullName));
  } finally {
    stage.remove();
  }
}
