const downloadBlob = async (url, filename) => {
  try {
    // Handle signed URLs from Cloudinary
    const res = await fetch(url, {
      mode: "cors",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);

    const contentType = res.headers.get("content-type");
    const blob = await res.blob();

    // Create object URL
    const objectUrl = URL.createObjectURL(blob);

    // For PDFs, open in new tab if it's a preview request
    if (contentType?.includes("pdf") && !filename) {
      window.open(objectUrl, "_blank");
      return;
    }

    // For download
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 100);
  } catch (err) {
    console.error("Download failed:", err);
    // If download fails, try opening in new tab as fallback
    window.open(url, "_blank");
  }
};
export default downloadBlob;
