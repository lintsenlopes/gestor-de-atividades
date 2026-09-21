<?php
function acao_concluir_atividade() {
    global $pdo;
    require_once "autenticacao.php";
    $dados = json_decode(file_get_contents("php://input"), true);
    $usuario_id = exigir_autenticacao();
    $id = $dados["id"];

    $stmt = $pdo->prepare("SELECT Id FROM atividades WHERE Id = :id AND Usuario_Id = :usuario_id");
    $stmt->execute([":id" => $id, ":usuario_id" => $usuario_id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["sucesso" => false, "mensagem" => "Atividade não encontrada."]);
        return;
    }

    $stmt = $pdo->prepare("UPDATE atividades SET Status = :status WHERE Id = :id");
    try {
        $stmt->execute([":status" => "Concluída", ":id" => $id]);
        http_response_code(200);
        echo json_encode(["sucesso" => true, "mensagem" => "Atividade concluída com sucesso."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao atualizar atividade."]);
    }
}