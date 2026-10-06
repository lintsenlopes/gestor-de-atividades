<?php
function acao_cadastrar_usuario() {
    global $pdo;
    //$dados = json_decode(file_get_contents("php://input"), true);
    $nome = $_POST["nome"];
    $sobrenome = $_POST["sobrenome"];
    $data_nascimento = $_POST["data_nascimento"];
    $login = $_POST["login"];
    $senha = $_POST["senha"];

    if (strlen($senha) < 6 || strlen($senha) > 64){
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "A senha deve ter entre  e 64 caracteres."]);
        return;
    }

    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO usuarios (Nome, Sobrenome, Data_Nascimento, Login, Senha) VALUES (:nome, :sobrenome, :data_nascimento, :login, :senha)");

    try {
        $stmt->execute([":nome" => $nome, ":sobrenome" => $sobrenome, ":data_nascimento" => $data_nascimento, ":login" => $login, ":senha" => $senha_hash]);
        http_response_code(201);
        echo json_encode(["sucesso" => true, "mensagem" => "Usuário cadastrado com sucesso."]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(["sucesso" => false, "mensagem" => "Esse login já está em uso. Escolha outro."]);
        } else {
            http_response_code(400);
            echo json_encode(["sucesso" => false, "mensagem" => "Erro ao cadastrar usuário."]);
        }
    }
}