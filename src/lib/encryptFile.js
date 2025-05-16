export async function encryptFile(file) {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const plainBuffer = await file.arrayBuffer();
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plainBuffer,
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);

  return {
    encrypted: new Blob([encryptedBuffer]),
    key: exportedKey,
    iv,
  };
}
