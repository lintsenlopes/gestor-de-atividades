-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/09/2026 às 21:32
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
(1, 1, 'Entregar trabalho php', 'Finalizar e entregar o trabalho do seminário', '2026-09-07 21:13:47', '2026-09-11 18:00:00', 'Em aberto'),
(2, 1, 'Estudar banco de dados', 'Revisar MySQL e relacionamentos entre tabelas', '2026-09-01 16:19:43', '2026-09-05 16:19:43', 'Em aberto'),
(3, 4, 'Estudar PHP e MySQL', 'Revisar conceitos de PHP para o seminário', '2026-09-08 21:21:35', '2026-09-15 16:21:35', 'Em aberto');

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
(1, 'Luisa', 'Leite', '2000-10-27', 'luisa', 'teste123'),
(4, 'Thais', 'Bettin', '1997-11-11', 'thaisbettin', 'teste123');

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
