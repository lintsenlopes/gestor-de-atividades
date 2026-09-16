<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexao.php";
require_once "autenticacao.php";                                      


$dados = json_decode(file_get_contents("php://input"), true);

$usuario_id = exigir_autenticacao();
$id = $dados["id"];
$titulo = $dados["titulo"];
$descricao = $dados["descricao"];
$data_conclusao = $dados["data_conclusao"];
$status = $dados["status"];

$stmt = $pdo->prepare("SELECT Id FROM atividades WHERE Id = :id AND Usuario_Id = :usuario_id");
$stmt->execute([":id" => $id, ":usuario_id" => $usuario_id]);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Atividade não encontrada."
    ]);
    exit;
}

$sql = "UPDATE atividades
        SET Titulo = :titulo,
            Descricao = :descricao,
            Data_Conclusao = :data_conclusao,
            Status = :status
        WHERE Id = :id";

$stmt = $pdo->prepare($sql);

try {

    $stmt->execute([
        ":titulo" => $titulo,
        ":descricao" => $descricao,
        ":data_conclusao" => $data_conclusao,
        ":status" => $status,
        ":id" => $id
    ]);

    http_response_code(200);
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Atividade atualizada com sucesso."
    ]);

} catch (PDOException $e) {

    http_response_code(400);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar atividade."
    ]);
}