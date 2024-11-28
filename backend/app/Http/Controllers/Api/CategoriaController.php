<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function getAllCategorias()
    {
        return Categoria::where('removido', false)->get();
    }

    public function getCategoriaById($id)
    {
        return Categoria::where('id', $id)
            ->where('removido', false)
            ->first();
    }

    public function insertCategoria(Request $request)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'margem_lucro' => 'required|numeric',
            'data_criacao' => 'required|date'
        ]);

        return Categoria::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'margem_lucro' => $request->margem_lucro,
            'data_criacao' => $request->data_criacao,
            'removido' => false
        ]);
    }

    public function updateCategoria(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'margem_lucro' => 'required|numeric',
            'data_criacao' => 'required|date'
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());
        return $categoria;
    }

    public function deleteCategoria($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update(['removido' => true]);
        return response()->json(['message' => 'Categoria removida com sucesso']);
    }
}