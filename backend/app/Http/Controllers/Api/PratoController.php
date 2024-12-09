<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PratoController extends Controller
{
   public function getAllPratos()
   {
       try {
           return Prato::with(['categoria', 'ingredientes'])
               ->where('removido', false)
               ->get();
       } catch (\Exception $e) {
           Log::error('Erro ao buscar pratos: ' . $e->getMessage());
           return response()->json(['error' => 'Erro ao buscar pratos'], 500);
       }
   }

   public function getPratoById($id)
   {
       try {
           $prato = Prato::with(['categoria', 'ingredientes'])
               ->where('id', $id)
               ->where('removido', false)
               ->first();

           if (!$prato) {
               return response()->json(['error' => 'Prato não encontrado'], 404);
           }

           return response()->json($prato);
       } catch (\Exception $e) {
           Log::error('Erro ao buscar prato: ' . $e->getMessage());
           return response()->json(['error' => 'Erro ao buscar prato'], 500);
       }
   }

   public function insertPrato(Request $request)
{
    try {
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
            foreach($request->ingredientes as $ingrediente) {
                $prato->ingredientes()->attach($ingrediente['ingrediente_id'], [
                    'quantidade' => $ingrediente['quantidade']
                ]);
            }
        }

        return $prato->load(['categoria', 'ingredientes']);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erro ao criar prato: ' . $e->getMessage()
        ], 500);
    }
}

   public function updatePrato(Request $request, $id)
   {
       try {
           $request->validate([
               'nome' => 'required|string|max:255',
               'descricao' => 'required|string',
               'preco' => 'required|numeric|min:0',
               'data_criacao' => 'required|date',
               'categoria_id' => 'required|exists:categorias,id',
               'ingredientes' => 'nullable|array',
               'ingredientes.*' => 'exists:ingredientes,id'
           ]);

           $prato = Prato::findOrFail($id);
           $prato->update($request->except('ingredientes'));

           if ($request->has('ingredientes')) {
               $prato->ingredientes()->sync($request->ingredientes);
           }

           return response()->json($prato->load(['categoria', 'ingredientes']));
       } catch (\Exception $e) {
           Log::error('Erro ao atualizar prato: ' . $e->getMessage());
           return response()->json(['error' => 'Erro ao atualizar prato'], 500);
       }
   }

   public function deletePrato($id)
   {
       try {
           $prato = Prato::findOrFail($id);
           $prato->update(['removido' => true]);
           return response()->json(['message' => 'Prato removido com sucesso']);
       } catch (\Exception $e) {
           Log::error('Erro ao remover prato: ' . $e->getMessage());
           return response()->json(['error' => 'Erro ao remover prato'], 500);
       }
   }
}