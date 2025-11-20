-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'manajemen',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_supplier" TEXT NOT NULL,
    "alamat" TEXT,
    "telepon" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif'
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_barang" TEXT NOT NULL,
    "spesifikasi" TEXT,
    "lokasi" TEXT,
    "kondisi" TEXT NOT NULL,
    "jumlah_stok" INTEGER NOT NULL DEFAULT 0,
    "min_stok" INTEGER NOT NULL DEFAULT 5,
    "sumber_dana" TEXT,
    "rak" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif'
);

-- CreateTable
CREATE TABLE "BarangMasuk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal_masuk" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    CONSTRAINT "BarangMasuk_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BarangMasuk_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BarangKeluar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal_keluar" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah" INTEGER NOT NULL,
    "penerima" TEXT,
    "tipe" TEXT NOT NULL DEFAULT 'GENERAL',
    "order_id" INTEGER,
    "item_id" INTEGER NOT NULL,
    CONSTRAINT "BarangKeluar_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BarangKeluar_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomor_pesanan" TEXT NOT NULL,
    "nama_pemesan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "picker_id" INTEGER,
    CONSTRAINT "Order_picker_id_fkey" FOREIGN KEY ("picker_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jumlah" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_nama_supplier_key" ON "Supplier"("nama_supplier");

-- CreateIndex
CREATE UNIQUE INDEX "Order_nomor_pesanan_key" ON "Order"("nomor_pesanan");
