<?php

define("CHAVE_SECRETA", "minha_senha_secreta");

function base64url_encode($dados) {
    $codificado = base64_encode($dados);
    $codificado = strtr($codificado, "+/", "-_");
    return $codificado;
}

function base64url_decode($dados) {
    return base64_decode(strtr($dados, "-_", "+/"));
}

function gerar_token($usuario_id, $horas_validade = 8) {

    $cabecalho = base64url_encode(json_encode([
        "alg" => "HS256",
        "typ" => "JWT",
    ]));

    $dados = base64url_encode(json_encode([
        "usuario_id" => $usuario_id, 
        "exp" => time() + ($horas_validade * 3600),
    ]));

    $assinatura = base64url_encode(
        hash_hmac("sha256","$cabecalho.$dados", CHAVE_SECRETA, true)
    );
    return "$cabecalho.$dados.$assinatura";
}
    
function validar_token($token) {

    $partes = explode(".", $token);

    if (count($partes) !== 3){
        return false;
    }
    [$cabecalho, $dados, $assinatura_recebida] = $partes;

    $assinatura_esperada = base64url_encode(
        hash_hmac("sha256","$cabecalho.$dados", CHAVE_SECRETA, true)
    );

    if (!hash_equals($assinatura_esperada, $assinatura_recebida)){
        return false;
    }

    $dados_decodificados = json_decode(base64url_decode($dados), true);

    if (!isset($dados_decodificados["exp"]) || $dados_decodificados["exp"] < time ()){
        return false;
    }   
    return $dados_decodificados;
}
?>
