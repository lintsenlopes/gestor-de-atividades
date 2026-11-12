-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/11/2026 às 01:00
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `gestor_de_atividades`
--
CREATE DATABASE IF NOT EXISTS `gestor_de_atividades` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gestor_de_atividades`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `atividades`
--

CREATE TABLE `atividades` (
  `Id` int(11) NOT NULL,
  `Usuario_Id` int(11) NOT NULL,
  `Titulo` varchar(150) NOT NULL,
  `Descricao` text NOT NULL,
  `Data_Criacao` datetime NOT NULL,
  `Data_Conclusao` datetime NOT NULL,
  `Status` enum('Em aberto','concluída') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `atividades`
--

INSERT INTO `atividades` (`Id`, `Usuario_Id`, `Titulo`, `Descricao`, `Data_Criacao`, `Data_Conclusao`, `Status`) VALUES
(6, 6, 'Teste para concluir', 'Atividade so para testar o endpoint de concluir', '2026-09-15 21:58:16', '2026-09-30 00:00:00', 'concluída'),
(9, 11, 'Prova de Engenharia de Software', 'URGENTE', '2026-11-11 20:43:31', '2026-11-08 00:00:00', 'Em aberto'),
(10, 11, 'Arrumar LinkedIn', '.', '2026-11-11 20:44:33', '2026-11-27 00:00:00', 'Em aberto'),
(11, 11, 'Prova Ingles', 'dia 11/11', '2026-11-11 20:44:57', '2026-11-11 00:00:00', 'concluída');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Sobrenome` varchar(100) NOT NULL,
  `Data_Nascimento` date NOT NULL,
  `Login` varchar(50) NOT NULL,
  `Senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`Id`, `Nome`, `Sobrenome`, `Data_Nascimento`, `Login`, `Senha`) VALUES
(6, 'Teste', 'Login', '2000-01-01', 'testelogin', '$2y$10$u5meuFqopPntPXqKhGaZieHnG0NOHC8z9lky5pIlIQqAnSQ48vDSy'),
(7, 'Teste', 'Dois', '2000-01-01', 'testelogin2', '$2y$10$Y9gNkhiqGjt2OK.P72rdNeDm.XP6zHilMOhuj0b5lfK23Gx2IPazS'),
(8, 'Lintsen', 'Lopes', '2000-10-10', 'lintsen', '$2y$10$y9WejGQHRsDVu.G.99R1/uO/7egOBU6yEoBaOIgZ3JXeIgn28OoDK'),
(9, 'Luís', 'Felipe', '2000-10-10', 'lfelipe', '$2y$10$ePA0DJosXc2cDmpPLukmaOEEpafSgCM.J9quCqpv1.tWlPFpU5hca'),
(10, 'Daniel', 'Lopes', '2020-10-16', 'danielcarlos', '$2y$10$NLtTDKhpDv/BEOhbODtuj.B3tRqorsstLba2j3nGIOSE2TnaAIRFu'),
(11, 'Ana Clara', 'Diniz', '2007-05-25', 'anaclaradiniz', '$2y$10$3GHbEsS1CeJOyfT.nQioMuW0hVgwe8JF4dvxADzNZ0I086.B5jXrG');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `atividades`
--
ALTER TABLE `atividades`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Usuario_Id` (`Usuario_Id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `login` (`Login`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `atividades`
--
ALTER TABLE `atividades`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `atividades`
--
ALTER TABLE `atividades`
  ADD CONSTRAINT `atividades_ibfk_1` FOREIGN KEY (`Usuario_Id`) REFERENCES `usuarios` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
