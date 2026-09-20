DROP SCHEMA IF EXISTS `portal_de_projetos`;

CREATE SCHEMA IF NOT EXISTS `portal_de_projetos` DEFAULT CHARACTER SET utf8mb4;
USE `portal_de_projetos`;

DROP TABLE IF EXISTS `Usuario`;
DROP TABLE IF EXISTS `Projeto`;
DROP TABLE IF EXISTS `Categoria`;
DROP TABLE IF EXISTS `Comentario`;
DROP TABLE IF EXISTS `Avaliacao`;
DROP TABLE IF EXISTS `Tecnologia`;

CREATE TABLE IF NOT EXISTS `Usuario`(
    `idUsuario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nomeUsuario` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,

    PRIMARY KEY(`idUsuario`),
    UNIQUE INDEX `nomeUsuario_UNIQUE` (`nomeUsuario` ASC),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Categoria`(
    `idCategoria` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nomeCategoria` VARCHAR(64) NOT NULL,

    PRIMARY KEY(`idCategoria`),
    UNIQUE INDEX `nomeCategoria_UNIQUE` (`nomeCategoria` ASC)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Projeto`(
    `idProjeto` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `idUsuario` INT UNSIGNED NOT NULL,
    `idCategoria` INT UNSIGNED NOT NULL,
    `titulo` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `dataCriacao` DATE NOT NULL,
    `imagem` VARCHAR(255) NULL, 
    `linkGitHub` VARCHAR(255) NULL,

    PRIMARY KEY(`idProjeto`),
    INDEX `fk_Projeto_Usuario_idx` (`idUsuario`),
    FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`),
    INDEX `fk_Projeto_Categoria_idx` (`idCategoria`),
    FOREIGN KEY (`idCategoria`) REFERENCES `Categoria` (`idCategoria`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Comentario`(
    `idComentario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `idProjeto` INT UNSIGNED NOT NULL,
    `idUsuario` INT UNSIGNED NOT NULL,
    `texto` VARCHAR(500) NOT NULL,
    `dataComentario` DATE NOT NULL,

    PRIMARY KEY(`idComentario`),
    INDEX `fk_Comentario_Projeto_idx` (`idProjeto`),
    FOREIGN KEY (`idProjeto`) REFERENCES `Projeto` (`idProjeto`),
    INDEX `fk_Comentario_Usuario_idx` (`idUsuario`),
    FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Avaliacao`(
    `idAvaliacao` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `idProjeto` INT UNSIGNED NOT NULL,
    `idUsuario` INT UNSIGNED NOT NULL,
    `nota` INT UNSIGNED NOT NULL CHECK (`nota` BETWEEN 1 AND 5),

    PRIMARY KEY(`idAvaliacao`),
    INDEX `fk_Avaliacao_Projeto_idx` (`idProjeto`),
    FOREIGN KEY (`idProjeto`) REFERENCES `Projeto` (`idProjeto`),
    INDEX `fk_Avaliacao_Usuario_idx` (`idUsuario`),
    FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE = InnoDB;