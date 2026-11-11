<?php
function acao_editar_atividade() {
    global $pdo;
    require_once "autenticacao.php";
    $usuario_id = exigir_autenticacao();

    parse_str(file_get_contents("php://input"), $dados);
    $id = $dados["id"] ?? NULL;
    $titulo = $dados["titulo"] ?? NULL;
    $descricao = $dados["descricao"] ?? NULL;
    $data_conclusao = $dados["data_conclusao"] ?? NULL;
    $status = $dados["status"]?? NULL;

    $stmt = $pdo->prepare("SELECT Id FROM atividades WHERE Id = :id AND Usuario_Id = :usuario_id");
    $stmt->execute([":id" => $id, ":usuario_id" => $usuario_id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["sucesso" => false, "mensagem" => "Atividade não encontrada."]);
        return;
    }

    $stmt = $pdo->prepare("UPDATE atividades SET Titulo = :titulo, Descricao = :descricao, Data_Conclusao = :data_conclusao, Status = :status WHERE Id = :id");
    try {
        $stmt->execute([":titulo" => $titulo, ":descricao" => $descricao, ":data_conclusao" => $data_conclusao, ":status" => $status, ":id" => $id]);
        http_response_code(200);
        echo json_encode(["sucesso" => true, "mensagem" => "Atividade atualizada com sucesso."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao atualizar atividade."]);
    }
}