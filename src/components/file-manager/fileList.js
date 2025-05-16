"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import ShareDialog from "@/components/file-manager/shareDialog";
import { decryptAndDownload } from "@/lib/decryptFile";

export default function FileList({ myFiles = [], sharedFiles = [] }) {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <>
      <Tabs defaultValue="uploads" className="w-full space-y-4">
        <TabsList className="w-full justify-center">
          <TabsTrigger value="uploads">My Uploads</TabsTrigger>
          <TabsTrigger value="shared">Shared With Me</TabsTrigger>
        </TabsList>

        <TabsContent value="uploads">
          {myFiles.length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t uploaded any files yet.
            </p>
          ) : (
            <div className="space-y-4">
              {myFiles.map((file) => (
                <Card key={file.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {file.alias ?? file.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>File name:</strong> {file.name}
                    </p>
                    <p>
                      <strong>MIME type:</strong> {file.mimeType}
                    </p>
                    <p>
                      <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <p>
                      <strong>Encrypted path:</strong> {file.encryptedPath}
                    </p>
                    <p>
                      <strong>Created at:</strong>{" "}
                      {new Date(file.createdAt).toLocaleString()}
                    </p>
                    {file.sharedWith?.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-foreground">
                          Shared with:
                        </p>
                        <ul className="list-disc list-inside">
                          {file.sharedWith.map((share, index) => (
                            <li key={index}>
                              {share.recipient.email} — {share.views}/
                              {share.maxViews} views
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(file)}
                    >
                      Share
                    </Button>
                    <Button
                      onClick={() =>
                        decryptAndDownload(file.id, file.name, file.mimeType)
                      }
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared">
          {sharedFiles.length === 0 ? (
            <p className="text-muted-foreground">
              No files shared with you yet.
            </p>
          ) : (
            <div className="space-y-4">
              {sharedFiles.map((share) => (
                <Card key={share.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {share.file.alias ?? share.file.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>File name:</strong> {share.file.name}
                    </p>
                    <p>
                      <strong>MIME type:</strong> {share.file.mimeType}
                    </p>
                    <p>
                      <strong>Size:</strong>{" "}
                      {(share.file.size / 1024).toFixed(2)} KB
                    </p>
                    <p>
                      <strong>Encrypted path:</strong>{" "}
                      {share.file.encryptedPath}
                    </p>
                    <p>
                      <strong>Shared by:</strong>{" "}
                      {share.file.owner?.email ?? "Unknown"}
                    </p>
                    <p>
                      <strong>Views:</strong> {share.views} / {share.maxViews}
                    </p>
                    <Button
                      onClick={() =>
                        decryptAndDownload(
                          share.file.id,
                          share.file.name,
                          share.file.mimeType,
                        )
                      }
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ShareDialog file={selectedFile} onClose={() => setSelectedFile(null)} />
    </>
  );
}
