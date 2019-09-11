import { uploadMedia } from "./upload-media.js";
import { create } from "../api/create.js";

export async function createPDF(file) {
  let book = { type: "Publication", links: [], json: {} };
  const canvas = document.getElementById("import-pdf-cover-page");
  const fileArray = await fileToArrayBuffer(file);
  const loadingTask = window.pdfjsLib.getDocument({
    data: fileArray,
    cMapUrl: window.CMAP_URL,
    cMapPacked: window.CMAP_PACKED
  });
  const pdf = await loadingTask.promise;
  const infoData = await pdf.getMetadata();
  const info = infoData.info;
  const metadata = infoData.metadata ? infoData.metadata.getAll() : {};
  book.name = metadata["dc:title"] || infoData.info.Title || file.name;
  book.author = []
    .concat(metadata["dc:creator"])
    .concat(info.Author)
    .filter(item => item);
  book.json.pdfInfo = info;
  book.json.pdfMetadata = metadata;
  book.json.totalPages = pdf.numPages;
  const canvasContext = canvas.getContext("2d", { alpha: false });
  const page = await pdf.getPage(1);
  const scale = 1.5;
  const viewport = page.getViewport(scale);
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext,
    viewport
  };
  await page.render(renderContext).promise;
  const coverFile = await canvasToFile(canvas);
  const media = [
    {
      file,
      documentPath: file.name,
      mediaType: file.type,
      json: {}
    },
    {
      file: coverFile,
      documentPath: coverFile.name,
      mediaType: coverFile.type,
      json: {}
    }
  ];
  book.resources = [
    {
      type: "LinkedResource",
      rel: ["alternate"],
      url: file.name,
      encodingFormat: file.type
    },
    {
      type: "LinkedResource",
      rel: ["cover"],
      url: coverFile.name,
      encodingFormat: coverFile.type
    }
  ];
  book.readingOrder = [
    {
      type: "LinkedResource",
      url: file.name,
      encodingFormat: file.type
    }
  ];
  const created = await create(book);
  book.id = created.id;
  const uploaded = await uploadMedia({ book, media });
  return uploaded;
}

function canvasToFile(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        const file = new window.File([blob], "cover.jpeg", {
          type: "image/jpeg"
        });
        resolve(file);
      },
      "image/jpeg",
      0.75
    );
  });
}

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.addEventListener("load", event => {
      const buffer = reader.result;
      resolve(buffer);
    });
    reader.addEventListener("error", event => {
      reject(new Error(`Failed to read ${file.name} as ArrayBuffer`));
    });
    reader.readAsArrayBuffer(file);
  });
}
