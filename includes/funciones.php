<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

function esUltimo( String $actual,string $proximo ): bool{
    if($actual !== $proximo){
        return true;
    }
    return false;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

// Función que revisa que el usuario este autenticado
function isAuth() : void {
    // Isset verifica que este definida o creada la variable
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }
}

function isAdmin() : void {
    if(!isset($_SESSION['admin'])){
        header('Location: /');
    }
}