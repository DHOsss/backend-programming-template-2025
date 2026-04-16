# Backend Programming - Sistem Gacha

Project backend untuk quiz mata kuliah Back End Programming semester 2. Dibuat pakai Express.js dan MongoDB. Fitur utamanya adalah sistem gacha (undian berhadiah) dimana user bisa main gacha maksimal 5 kali per hari.

## Fitur

- CRUD user (daftar, lihat, update, hapus, ganti password)
- CRUD buku
- Sistem gacha dengan batas 5 kali per hari
- Pemilihan hadiah secara acak dengan sistem weighted random
- Daftar hadiah beserta sisa kuota
- Daftar pemenang dengan nama yang disamarkan
- Riwayat gacha per user
- Password di-hash pakai bcrypt

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- bcrypt
- Pino (logger)
- Nodemon (dev)

## Struktur Folder

```
src/
├── api/
│   ├── routes.js
│   └── components/
│       ├── books/
│       │   ├── books-controller.js
│       │   ├── books-repository.js
│       │   ├── books-route.js
│       │   └── books-service.js
│       ├── users/
│       │   ├── users-controller.js
│       │   ├── users-repository.js
│       │   ├── users-route.js
│       │   └── users-service.js
│       └── gacha/
│           ├── gacha-controller.js
│           ├── gacha-repository.js
│           ├── gacha-route.js
│           └── gacha-service.js
├── core/
│   ├── config.js
│   ├── errors.js
│   ├── logger.js
│   └── server.js
├── models/
│   ├── index.js
│   ├── books-schema.js
│   ├── users-schema.js
│   ├── prizes-schema.js
│   └── gacha-history-schema.js
├── utils/
│   └── password.js
└── index.js
```

## Cara Menjalankan

1. Clone repo ini

2. Install dependencies
```bash
npm install
```

3. Buat file `.env` di root folder, isi seperti ini:
```
PORT=5005
DB_CONNECTION=mongodb://127.0.0.1:27017
DB_NAME=demo-db
```
Kalau pakai MongoDB Atlas, ganti `DB_CONNECTION` dengan connection string dari Atlas.

4. Jalankan server
```bash
npm run dev
```

Server akan jalan di `http://localhost:5005`

## Daftar Endpoint

### Users

| Method | Endpoint | Body | Keterangan |
|--------|----------|------|------------|
| GET | /api/users | - | Lihat semua user |
| GET | /api/users/:id | - | Lihat detail user |
| POST | /api/users | `email`, `password` | Daftar user baru |
| PUT | /api/users/:id | `email`, `full_name` | Update data user |
| PUT | /api/users/:id/change-password | `old_password`, `new_password`, `confirm_new_password` | Ganti password |
| DELETE | /api/users/:id | - | Hapus user |

### Gacha

| Method | Endpoint | Body | Keterangan |
|--------|----------|------|------------|
| POST | /api/gacha | `email`, `password` | Main gacha (max 5x/hari) |
| GET | /api/gacha/history | `email`, `password` | Lihat riwayat gacha |
| GET | /api/gacha/prizes | - | Lihat daftar hadiah dan sisa kuota |
| GET | /api/gacha/winners | - | Lihat daftar pemenang |

### Books

| Method | Endpoint | Body | Keterangan |
|--------|----------|------|------------|
| GET | /api/books | - | Lihat semua buku |
| POST | /api/books | `title` | Tambah buku baru |

## Contoh Request

### Daftar User
```
POST http://localhost:5005/api/users
Content-Type: application/json

{
  "email": "aldho@gmail.com",
  "password": "12345678"
}
```

### Main Gacha
```
POST http://localhost:5005/api/gacha
Content-Type: application/json

{
  "email": "aldho@gmail.com",
  "password": "12345678"
}
```

### Contoh Response Gacha (Menang)
```json
{
  "statusCode": 200,
  "message": "Selamat! Anda memenangkan Voucher Rp100.000!",
  "data": {
    "result": "win",
    "prize": "Voucher Rp100.000",
    "attemptsToday": 1,
    "attemptsRemaining": 4
  }
}
```

### Contoh Response Gacha (Kalah)
```json
{
  "statusCode": 200,
  "message": "Maaf, Anda tidak memenangkan hadiah kali ini.",
  "data": {
    "result": "lose",
    "prize": null,
    "attemptsToday": 2,
    "attemptsRemaining": 3
  }
}
```

## Daftar Hadiah

Data hadiah otomatis di-seed waktu server pertama kali jalan.

| Hadiah | Kuota |
|--------|-------|
| Emas 10 gram | 1 |
| Smartphone X | 5 |
| Smartwatch Y | 10 |
| Voucher Rp100.000 | 100 |
| Pulsa Rp50.000 | 500 |

Peluang menang sekitar 30%. Hadiah yang kuotanya lebih banyak punya kemungkinan lebih besar untuk didapat (weighted random).

## Catatan

- Password minimal 8 karakter
- Email harus unik, tidak boleh duplikat
- Gacha dibatasi maksimal 5 kali per hari per user
- Nama pemenang otomatis disamarkan sebagian di endpoint `/api/gacha/winners`
- Server pakai nodemon jadi otomatis restart kalau ada perubahan file
