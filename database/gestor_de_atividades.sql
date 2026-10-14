-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14/10/2026 às 23:22
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
(3, 4, 'Estudar PHP e MySQL', 'Revisar conceitos de PHP para o seminário', '2026-09-08 21:21:35', '2026-09-15 16:21:35', 'Em aberto'),
(5, 4, 'Fazer apresentação', 'Preparar os slides do seminário', '2026-09-08 17:12:17', '2026-09-10 18:00:00', 'Em aberto'),
(6, 4, 'Fazer apresentação', 'Preparar os slides do seminário', '2026-09-08 19:21:16', '2026-09-10 18:00:00', 'Em aberto'),
(7, 4, 'Fazer apresentação', 'Preparar os slides do seminário', '2026-09-08 19:21:43', '2026-09-10 18:00:00', 'Em aberto'),
(8, 1, 'Preparar apresentação', 'Montar os slides para a apresentação do seminário.', '2026-09-20 10:00:00', '2026-10-05 18:00:00', 'Em aberto'),
(9, 1, 'Revisar código PHP', 'Revisar os arquivos PHP e verificar possíveis erros na aplicação.', '2026-09-18 14:30:00', '2026-09-22 18:00:00', 'concluída'),
(10, 1, 'Enviar documentação', 'Organizar e enviar a documentação final do projeto.', '2026-09-21 09:00:00', '2026-09-23 18:00:00', 'Em aberto'),
(11, 4, 'Estudar AJAX', 'Revisar requisições GET e POST e comunicação entre frontend e backend.', '2026-09-20 13:00:00', '2026-10-01 18:00:00', 'Em aberto'),
(12, 4, 'Testar login', 'Verificar login correto, senha incorreta e usuário inexistente.', '2026-09-21 15:00:00', '2026-09-23 18:00:00', 'concluída'),
(13, 4, 'Corrigir atividade atrasada', 'Verificar uma atividade que passou da data de conclusão e definir uma nova data.', '2026-09-22 11:00:00', '2026-09-23 18:00:00', 'Em aberto'),
(14, 8, 'Criar formulário de cadastro', 'Desenvolver formulário para cadastro de novos usuários.', '2026-09-23 08:00:00', '2026-09-30 18:00:00', 'Em aberto'),
(15, 8, 'Testar banco de dados', 'Verificar se os registros estão sendo inseridos e consultados corretamente.', '2026-09-22 10:00:00', '2026-09-25 18:00:00', 'Em aberto'),
(16, 8, 'Configurar ambiente', 'Configurar XAMPP e preparar o ambiente para desenvolvimento.', '2026-09-15 09:00:00', '2026-09-18 18:00:00', 'concluída'),
(17, 9, 'Implementar exclusão', 'Implementar a funcionalidade de exclusão de atividades.', '2026-09-23 09:30:00', '2026-10-03 18:00:00', 'Em aberto'),
(18, 9, 'Implementar edição', 'Implementar a funcionalidade para editar título, descrição e data de conclusão.', '2026-09-22 14:00:00', '2026-09-28 18:00:00', 'Em aberto'),
(19, 10, 'Finalizar documentação', 'Finalizar a documentação das funcionalidades do sistema.', '2026-09-10 10:00:00', '2026-09-19 18:00:00', 'concluída'),
(21, 21, 'TESTE DE INTEGRAÇÃO 1', 'teste CRUD', '2026-10-14 18:20:20', '2026-11-15 00:00:00', 'Em aberto');

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
(1, 'Luisa', 'Leite', '2000-10-27', 'luisa', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(4, 'Thais', 'Bettin', '1997-11-11', 'thaisbettin', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(6, 'Maria', 'Teste', '2000-05-10', 'mariateste', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(8, 'Mariana', 'Souza', '1999-04-12', 'mariana.souza', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(9, 'Gabriel', 'Mendes', '2001-08-25', 'gabriel.mendes', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(10, 'Beatriz', 'Ramos', '1998-12-03', 'beatriz.ramos', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(11, 'Lucas', 'Martins', '2000-06-19', 'lucas.martins', '$2y$10$E3GqzL/tcSd6nXN9iXGuYeSR9eAUvPb0B.KMiMRA0w8m5MWQqjk8i'),
(21, 'Charlie', 'Bolseiro', '2016-03-14', 'charlie', '$2y$10$ky6W49eUcYB94xFbeWIeJOx4wKj5BajZWSoKnEMVMQXZnhiLNAFsa');

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
