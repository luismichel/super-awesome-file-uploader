# 📁 Super Awesome File Uploader

A secure file upload and sharing application built with **Next.js 15**, **Prisma + SQLite**, and **NextAuth**. Files are encrypted on the client, shared securely with other users, and can be limited to a max number of views — after which they're deleted from disk and the database.

---

## 🚀 Features

- 🔐 **Client-side AES-GCM encryption**
- 🧑‍🤝‍🧑 Share files with other users
- ⏳ View limit enforcement with auto-delete
- 🗂 Authenticated file listing (own + shared)
- 🧠 Server-side download tracking & decryption
- 🧱 Built with **Next.js App Router**, **NextAuth**, **Prisma**, and **ShadCN UI**

---

## 🛠 Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/) + SQLite
- [NextAuth.js](https://next-auth.js.org/) with Credentials + JWT
- [ShadCN/UI](https://ui.shadcn.dev/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (for AES-GCM encryption)

---

## ⚙️ Prerequisites

- Node.js ≥ 18
- NPM or Yarn
- SQLite (bundled — no need to install)

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/super-awesome-file-uploader.git
cd super-awesome-file-uploader
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🧬 Prisma: Setup Database

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Run Migrations

```bash
npx prisma migrate dev --name init
```

This will create the `dev.db` SQLite file and apply your schema.

---

## 🌱 Seed the Database

The app provides a seed script to create mock users and files:

```bash
npx prisma db seed
```

You’ll get:

| Email           | Password   | Role  |
|-----------------|------------|--------|
| `admin@test.com`| `admin123` | admin  |
| `user@test.com` | `user123`  | user   |
| `dev@test.com`  | `dev123`   | user   |

---

## 🧪 Running the App

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to login and start uploading.

---

## 📝 Features in Detail

### 🔐 Encryption

- Files are encrypted **before upload** using **AES-GCM (256-bit)**.
- Keys and IVs are generated per file.
- Key/IV are stored securely in the DB and never exposed in plaintext outside protected endpoints.

### 📤 Upload

- Upload via a fixed-position floating button.
- Metadata dialog prompts for:
  - Alias
  - Max views
  - Upload target (local/S3 — stubbed)

### 👥 Sharing

- Files can be shared with other users.
- Set per-recipient `maxViews`.
- Shared files show in the “Shared With Me” tab.

### ⏳ Download

- Only available if:
  - You’re the file owner
  - Or a valid recipient with views remaining
- Download goes through a secure `/api/download` route:
  - Validates access
  - Increments view count
  - Deletes file after `views >= maxViews`
- File is decrypted in the browser and saved

---

## 🔄 Resetting the DB (for dev)

```bash
rm prisma/dev.db
npx prisma migrate dev --name reset
npx prisma db seed
```

---

## 📂 Folder Structure Highlights

```bash
├── prisma/              # Prisma schema and seeds
├── public/uploads/      # Encrypted files stored here
├── src/
│   ├── app/             # Next.js app directory
│   │   └── api/         # Auth, upload, download routes
│   ├── components/      # UI + file-manager (tabs, dialogs, lists)
│   ├── lib/             # prisma.js, encryptFile.js, auth.js
```

---

## ✅ TODO / Future Ideas

- Add optional password-based encryption (PBKDF2)
- Enable file expiration date
- Add audit logs for downloads
- Add S3 support via upload adapter

---

## 🤝 License

MIT — use it, fork it, encrypt everything 💥

---

## 👨‍💻 Maintainer

Built by [@luismichel](https://github.com/luismichel)
