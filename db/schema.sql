SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `mydb` ;
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET latin1 ;
SHOW WARNINGS;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `votes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `votes` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `votes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `electionId` INT(11) NOT NULL,
  `candidateId` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_UNIQUE` ON `votes` (`id` ASC);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `candidates`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `candidates` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `age` INT(11) NULL DEFAULT NULL,
  `political_party` VARCHAR(45) NULL DEFAULT NULL,
  `pic_name` VARCHAR(45) NULL DEFAULT NULL,
  `electionId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `elections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `elections` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `elections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL DEFAULT NULL,
  `statusId` INT(11) NULL DEFAULT NULL,
  `initialDate` VARCHAR(45) NULL DEFAULT NULL,
  `endDate` VARCHAR(45) NULL DEFAULT NULL,
  `url_friendly` VARCHAR(45) NULL DEFAULT NULL,
  `winner` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `electionStatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `electionStatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `electionStatus` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `userTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `userTypes` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `userTypes` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `usersHistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usersHistory` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `usersHistory` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userId` INT(11) NULL DEFAULT NULL,
  `electionId` INT(11) NULL DEFAULT NULL,
  `createAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `registration` INT(45) NULL DEFAULT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `course` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `type` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_UNIQUE` ON `users` (`id` ASC);

SHOW WARNINGS;
CREATE UNIQUE INDEX `cpf_UNIQUE` ON `users` (`cpf` ASC);

SHOW WARNINGS;
CREATE UNIQUE INDEX `email_UNIQUE` ON `users` (`email` ASC);

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `userTypes` VALUES (1,'administrador'),(2,'eleitor');
INSERT INTO `users` VALUES (1,'Usuario','user@ufba.br',213103033,'1646332985','BSI','f39b5519a03f920638de6e1c0e27476e6687bdbf8c5d648907fb81875d4e022da1f06e744156de1975acc57095f84cc31631b1feedab5620193f916b6577a826',2),(2,'Admin','admin@ufba.br',NULL,'16465632985',NULL,'f39b5519a03f920638de6e1c0e27476e6687bdbf8c5d648907fb81875d4e022da1f06e744156de1975acc57095f84cc31631b1feedab5620193f916b6577a826',1),(4,'Paulo Henrique','ph@ufba.br',NULL,'8591811551','BSI','f39b5519a03f920638de6e1c0e27476e6687bdbf8c5d648907fb81875d4e022da1f06e744156de1975acc57095f84cc31631b1feedab5620193f916b6577a826',2);

