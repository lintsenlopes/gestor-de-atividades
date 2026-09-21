<?php
function acao_listar_atividades() {
    global $pdo;
    require_once "autenticacao.php";
    $usuario_id = exigir_autenticacao();
    $stmt = $pdo-> prepare("SELECT * FROM atividades WHERE Usuario_Id = :usuario_id ORDER BY Data_Conclusao ASC");
    $stmt-> execute([":usuario_id" => $usuario_id]);
    $atividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode(["sucesso" => true, "atividades" => $atividades]);
}