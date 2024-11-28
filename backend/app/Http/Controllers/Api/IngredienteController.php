<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingrediente;
use Illuminate\Http\Request;

class IngredienteController extends Controller
{
    public function getAllIngredientes()
    {
        return Ingrediente::where('removido', false)->get();
    }

    public function getIngredienteById($id)
    {
        return Ingrediente::where('id', $id)
            ->where('removido', false)
            ->first();
    }

    public function insertIngrediente(Request $request)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'preco_unitario' => 'required|numeric',
            'data_validade' => 'required|date'
        ]);

        return Ingrediente::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'preco_unitario' => $request->preco_unitario,
            'data_validade' => $request->data_validade,
            'removido' => false
        ]);
    }

    public function updateIngrediente(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'preco_unitario' => 'required|numeric',
            'data_validade' => 'required|date'
        ]);

        $ingrediente = Ingrediente::findOrFail($id);
        $ingrediente->update($request->all());
        return $ingrediente;
    }

    public function deleteIngrediente($id)
    {
        $ingrediente = Ingrediente::findOrFail($id);
        $ingrediente->update(['removido' => true]);
        return response()->json(['message' => 'Ingrediente removido com sucesso']);
    }
}