<?php
function acao_login() {
    global $pdo;
    require_once "jwt.php";
    $login = $_POST["login"] ?? null;
    $senha = $_POST["senha"] ?? null;

    if (!$login || !$senha) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Informe login e senha."]);
        return;
    }

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE Login = :login");
    $stmt->execute([":login" => $login]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($senha, $usuario["Senha"])) {
        http_response_code(401);
        echo json_encode(["sucesso" => false, "mensagem" => "Usuário ou senha incorretos."]);
        return;
    }

    $token = gerar_token($usuario["Id"]);
    http_response_code(200);
    echo json_encode([
        "sucesso" => true, "mensagem" => "Login realizado com sucesso.", "token" => $token,
        "usuario" => ["id" => $usuario["Id"], "nome" => $usuario["Nome"], "sobrenome" => $usuario["Sobrenome"], "login" => $usuario["Login"]]
    ]);
}