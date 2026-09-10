<?php

require_once "conexao.php";

$usuario_id = $_GET["usuario_id"];

$sql = "SELECT * FROM atividades WHERE Usuario_Id = :usuario_id";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":usuario_id" => $usuario_id
]);

$atividades = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "sucesso" => true,
    "atividades" => $atividades
]);