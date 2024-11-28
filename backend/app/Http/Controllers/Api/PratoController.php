<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prato;
use Illuminate\Http\Request;

class PratoController extends Controller
{
    public function getAllPratos()
    {
        return Prato::with(['categoria', 'ingredientes'])
            ->where('removido', false)
            ->get();
    }

    public function getPratoById($id)
    {
        return Prato::with(['categoria', 'ingredientes'])
            ->where('id', $id)
            ->where('removido', false)
            ->first();
    }

    public function insertPrato(Request $request)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'preco' => 'required|numeric',
            'data_criacao' => 'required|date',
            'categoria_id' => 'required|exists:categorias,id',
            'ingredientes' => 'array'
        ]);

        $prato = Prato::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'preco' => $request->preco,
            'data_criacao' => $request->data_criacao,
            'categoria_id' => $request->categoria_id,
            'removido' => false
        ]);

        if ($request->has('ingredientes')) {
            $prato->ingredientes()->attach($request->ingredientes);
        }

        return $prato->load(['categoria', 'ingredientes']);
    }

    public function updatePrato(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'preco' => 'required|numeric',
            'data_criacao' => 'required|date',
            'categoria_id' => 'required|exists:categorias,id',
            'ingredientes' => 'array'
        ]);

        $prato = Prato::findOrFail($id);
        $prato->update($request->except('ingredientes'));

        if ($request->has('ingredientes')) {
            $prato->ingredientes()->sync($request->ingredientes);
        }

        return $prato->load(['categoria', 'ingredientes']);
    }

    public function deletePrato($id)
    {
        $prato = Prato::findOrFail($id);
        $prato->update(['removido' => true]);
        return response()->json(['message' => 'Prato removido com sucesso']);
    }
}