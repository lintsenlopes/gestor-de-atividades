<?php

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

$usuario_id = $dados["usuario_id"];
$titulo = $dados["titulo"];
$descricao = $dados["descricao"];
$data_conclusao = $dados["data_conclusao"];

$sql = "INSERT INTO atividades
        (Usuario_Id, Titulo, Descricao, Data_Criacao, Data_Conclusao, Status)
        VALUES
        (:usuario_id, :titulo, :descricao, NOW(), :data_conclusao, 'Em aberto')";

$stmt = $pdo->prepare($sql);

try {

    $stmt->execute([
        ":usuario_id" => $usuario_id,
        ":titulo" => $titulo,
        ":descricao" => $descricao,
        ":data_conclusao" => $data_conclusao
    ]);

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Atividade cadastrada com sucesso."
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar atividade."
    ]);
}