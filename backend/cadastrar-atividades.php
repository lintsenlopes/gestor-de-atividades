<?php
function acao_criar_atividade() {
    global $pdo;
    require_once "autenticacao.php";
    $usuario_id = exigir_autenticacao();
    $titulo = $_POST["titulo"] ?? null;
    $descricao = $_POST["descricao"] ?? null;
    $data_conclusao = $_POST["data_conclusao"] ?? null;

    if (!$titulo || !$data_conclusao){
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Título e data de conclusão são obrigatórios."]);
        return;
    }

    $data_valida = DateTime::createFromFormat("Y-m-d", $data_conclusao);
    if (!$data_valida){
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Data de conclusão inválida. Use o formato AAAA-MM-DD."]);
        return;
    }

    $stmt = $pdo->prepare("INSERT INTO atividades (Usuario_Id, Titulo, Descricao, Data_Criacao, Data_Conclusao, Status) VALUES (:usuario_id, :titulo, :descricao, NOW(), :data_conclusao, 'Em aberto')");

    try {
        $stmt->execute([":usuario_id" => $usuario_id, ":titulo" => $titulo, ":descricao" => $descricao, ":data_conclusao" => $data_conclusao]);
        http_response_code(201);
        echo json_encode(["sucesso" => true, "mensagem" => "Atividade cadastrada com sucesso."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao cadastrar atividade."]);
    }
}