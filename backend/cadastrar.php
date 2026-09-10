<?php

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

$nome = $dados["nome"];
$sobrenome = $dados["sobrenome"];
$data_nascimento = $dados["data_nascimento"];
$login = $dados["login"];
$senha = $dados["senha"];

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios
        (Nome, Sobrenome, Data_Nascimento, Login, Senha)
        VALUES
        (:nome, :sobrenome, :data_nascimento, :login, :senha)";

$stmt = $pdo->prepare($sql);

try {

    $stmt->execute([
        ":nome" => $nome,
        ":sobrenome" => $sobrenome,
        ":data_nascimento" => $data_nascimento,
        ":login" => $login,
        ":senha" => $senha_hash
    ]);

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Usuário cadastrado com sucesso."
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar usuário."
    ]);
}