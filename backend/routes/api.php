<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\PratoController;
use App\Http\Controllers\Api\IngredienteController;

// Rotas públicas
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

// Rotas protegidas
Route::middleware('auth:api')->group(function () {
    // Autenticação
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    // Categorias
    Route::get('categorias', [CategoriaController::class, 'getAllCategorias']);
    Route::get('categorias/{id}', [CategoriaController::class, 'getCategoriaById']);
    Route::post('categorias', [CategoriaController::class, 'insertCategoria']);
    Route::put('categorias/{id}', [CategoriaController::class, 'updateCategoria']);
    Route::delete('categorias/{id}', [CategoriaController::class, 'deleteCategoria']);

    // Pratos
    Route::get('pratos', [PratoController::class, 'getAllPratos']);
    Route::get('pratos/{id}', [PratoController::class, 'getPratoById']);
    Route::post('pratos', [PratoController::class, 'insertPrato']);
    Route::put('pratos/{id}', [PratoController::class, 'updatePrato']);
    Route::delete('pratos/{id}', [PratoController::class, 'deletePrato']);

    // Ingredientes
    Route::get('ingredientes', [IngredienteController::class, 'getAllIngredientes']);
    Route::get('ingredientes/{id}', [IngredienteController::class, 'getIngredienteById']);
    Route::post('ingredientes', [IngredienteController::class, 'insertIngrediente']);
    Route::put('ingredientes/{id}', [IngredienteController::class, 'updateIngrediente']);
    Route::delete('ingredientes/{id}', [IngredienteController::class, 'deleteIngrediente']);
});