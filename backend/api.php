<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexao.php";
require_once "login.php";
require_once "cadastrar.php";
require_once "cadastrar-atividades.php";
require_once "listar-atividades.php";
require_once "editar-atividade.php";
require_once "deletar-atividade.php";
require_once "concluir-atividade.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$rota = $_GET['rota'] ?? '';

if ($metodo === 'POST' && $rota === 'login') {
    acao_login();

} elseif ($metodo === 'POST' && $rota === 'cadastrar') {
    acao_cadastrar_usuario();

} elseif ($metodo === 'GET' && $rota === 'atividades') {
    acao_listar_atividades();

} elseif ($metodo === 'POST' && $rota === 'atividades') {
    acao_criar_atividade();

} elseif ($metodo === 'PUT' && $rota === 'atividades') {
    acao_editar_atividade();

} elseif ($metodo === 'DELETE' && $rota === 'atividades') {
    acao_deletar_atividade();

} elseif ($metodo === 'POST' && $rota === 'concluir') {
    acao_concluir_atividade();

} else {
    http_response_code(404);
    echo json_encode(["sucesso" => false, "mensagem" => "Rota não encontrada."]);
}