<?php

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

$login = $dados["login"];
$senha = $dados["senha"];

$sql = "SELECT * FROM usuarios WHERE Login = :login";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":login" => $login
]);

$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Usuário ou senha incorretos."
    ]);

    exit;
}

if (!password_verify($senha, $usuario["Senha"])) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Usuário ou senha incorretos."
    ]);

    exit;
}

echo json_encode([
    "sucesso" => true,
    "mensagem" => "Login realizado com sucesso.",
    "usuario" => [
        "id" => $usuario["Id"],
        "nome" => $usuario["Nome"],
        "sobrenome" => $usuario["Sobrenome"],
        "login" => $usuario["Login"]
    ]
]);