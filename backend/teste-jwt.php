<?php
require_once "jwt.php";

$token = gerar_token(1);
echo "Token gerado: " . $token . "\n\n";

$resultado = validar_token($token);
echo "Validação: ";
print_r($resultado);

$token_falso = substr_replace($token, "X", 10, 1);
print_r(validar_token($token_falso));