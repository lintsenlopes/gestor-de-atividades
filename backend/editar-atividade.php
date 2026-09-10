<?php

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

$id = $dados["id"];
$titulo = $dados["titulo"];
$descricao = $dados["descricao"];
$data_conclusao = $dados["data_conclusao"];
$status = $dados["status"];

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

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Atividade atualizada com sucesso."
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar atividade."
    ]);
}