export async function decryptAndDownload(fileId, filename, mimeType) {
  try {
    const res = await fetch("/api/protected/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Download failed");
      return;
    }

    const keyB64 = res.headers.get("X-Encryption-Key");
    const ivB64 = res.headers.get("X-Encryption-IV");
    const encryptedBuffer = await res.arrayBuffer();

    const key = await crypto.subtle.importKey(
      "raw",
      Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0)),
      "AES-GCM",
      false,
      ["decrypt"],
    );

    const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBuffer,
    );

    const blob = new Blob([decryptedBuffer], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Decryption failed:", e);
    alert("Unable to decrypt file");
  }
}
