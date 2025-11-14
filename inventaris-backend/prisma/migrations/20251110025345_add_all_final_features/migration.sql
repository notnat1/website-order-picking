-- AlterTable
ALTER TABLE `barangkeluar` ADD COLUMN `order_id` INTEGER NULL,
    ADD COLUMN `tipe` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
    MODIFY `penerima` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `item` ADD COLUMN `min_stok` INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `picker_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Aktif';

-- AddForeignKey
ALTER TABLE `BarangKeluar` ADD CONSTRAINT `BarangKeluar_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_picker_id_fkey` FOREIGN KEY (`picker_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
