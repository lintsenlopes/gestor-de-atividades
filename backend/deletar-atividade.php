<?php
function acao_deletar_atividade() {
    global $pdo;
    require_once "autenticacao.php";
    $usuario_id = exigir_autenticacao();
    $id = $_GET["id"];

    $stmt = $pdo->prepare("SELECT Id FROM atividades WHERE Id = :id AND Usuario_Id = :usuario_id");
    $stmt->execute([":id" => $id, ":usuario_id" => $usuario_id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["sucesso" => false, "mensagem" => "Atividade não encontrada."]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM atividades WHERE Id = :id");
    try {
        $stmt->execute([":id" => $id]);
        http_response_code(200);
        echo json_encode(["sucesso" => true, "mensagem" => "Atividade removida com sucesso."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao deletar a atividade."]);
    }
}