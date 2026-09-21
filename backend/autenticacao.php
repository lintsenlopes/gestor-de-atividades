<?php

require_once "jwt.php";

function exigir_autenticacao() {

    $cabecalhos = getallheaders();
    $autorizacao = $cabecalhos["Authorization"] ?? $cabecalhos["authorization"] ?? null;

    if (!$autorizacao || !str_starts_with($autorizacao, "Bearer ")) {
        http_response_code(401);
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Token não enviado."
        ]);
        exit;
    }

    $token = substr($autorizacao, 7);

    $dados_token = validar_token($token);

    if ($dados_token === false) {
        http_response_code(401);
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Token inválido ou expirado. Faça login novamente."
        ]);
        exit;
    }

    return $dados_token["usuario_id"];
}