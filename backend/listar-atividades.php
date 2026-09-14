<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexao.php";
require_once "autenticacao.php";

$usuario_id = exigir_autenticacao();

$sql = "SELECT * FROM atividades WHERE Usuario_Id = :usuario_id";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":usuario_id" => $usuario_id
]);

$atividades = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode([
    "sucesso" => true,
    "atividades" => $atividades
]);