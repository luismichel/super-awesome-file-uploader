"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function ShareDialog({ file, onClose }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [maxViews, setMaxViews] = useState("1");

  useEffect(() => {
    if (file) {
      fetch("/api/users") // you'll create this endpoint
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, [file]);

  const handleShare = async () => {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: file.id,
        recipientId: selectedUser,
        maxViews: parseInt(maxViews),
      }),
    });

    if (res.ok) {
      onClose();
    } else {
      alert("Error sharing file");
    }
  };

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {file?.alias || file?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Recipient</Label>
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Max Views</Label>
            <Input
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              min={1}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleShare} disabled={!selectedUser}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
