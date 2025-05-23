-- CreateTable
CREATE TABLE `Lote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Boleto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_sacado` VARCHAR(255) NOT NULL,
    `id_lote` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `linha_digitavel` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Boleto` ADD CONSTRAINT `Boleto_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `Lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
