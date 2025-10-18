-- CreateTable
CREATE TABLE `OriginalListing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asin` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `bullets` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OriginalListing_asin_idx`(`asin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OptimizedListing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalId` INTEGER NOT NULL,
    `asin` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `bullets` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `keywords` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OptimizedListing_originalId_key`(`originalId`),
    INDEX `OptimizedListing_asin_idx`(`asin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OptimizedListing` ADD CONSTRAINT `OptimizedListing_originalId_fkey` FOREIGN KEY (`originalId`) REFERENCES `OriginalListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
