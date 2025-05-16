"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { encryptFile } from "@/lib/encryptFile"; // see previous messages
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function UploadDialogButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [alias, setAlias] = useState("");
  const [maxViews, setMaxViews] = useState("3");
  const [uploadTarget, setUploadTarget] = useState("server");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const { encrypted, key, iv } = await encryptFile(file);

    const formData = new FormData();
    formData.append("file", encrypted, file.name);
    formData.append("alias", alias || file.name);
    formData.append("maxViews", maxViews);
    formData.append("uploadTarget", uploadTarget);
    formData.append("iv", Buffer.from(iv).toString("base64"));
    formData.append("key", Buffer.from(key).toString("base64"));

    const res = await fetch("/api/protected/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      console.log("File uploaded");
      setOpen(false);
      setFile(null);
      setAlias("");
      setMaxViews("3");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <>
      <input type="file" id="fileInput" hidden onChange={handleFileChange} />

      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => document.getElementById("fileInput").click()}>
          Upload File
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File Metadata</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxViews">Max Views</Label>
              <Input
                id="maxViews"
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="uploadTarget">Upload Target</Label>
              <Select value={uploadTarget} onValueChange={setUploadTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="s3">S3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleUpload} disabled={!file}>
              Encrypt & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
