-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'manajemen',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deactivatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_supplier` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `telepon` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aktif',

    UNIQUE INDEX `Supplier_nama_supplier_key`(`nama_supplier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_barang` VARCHAR(191) NOT NULL,
    `spesifikasi` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NULL,
    `kondisi` VARCHAR(191) NOT NULL,
    `jumlah_stok` INTEGER NOT NULL DEFAULT 0,
    `min_stok` INTEGER NOT NULL DEFAULT 5,
    `sumber_dana` VARCHAR(191) NULL,
    `rak` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aktif',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BarangMasuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_masuk` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jumlah` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `supplier_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BarangKeluar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_keluar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jumlah` INTEGER NOT NULL,
    `penerima` VARCHAR(191) NULL,
    `tipe` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
    `order_id` INTEGER NULL,
    `item_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_pesanan` VARCHAR(191) NOT NULL,
    `nama_pemesan` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `picker_id` INTEGER NULL,

    UNIQUE INDEX `Order_nomor_pesanan_key`(`nomor_pesanan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BarangMasuk` ADD CONSTRAINT `BarangMasuk_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarangMasuk` ADD CONSTRAINT `BarangMasuk_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarangKeluar` ADD CONSTRAINT `BarangKeluar_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarangKeluar` ADD CONSTRAINT `BarangKeluar_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_picker_id_fkey` FOREIGN KEY (`picker_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
