<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Prato extends Model
{
   protected $table = 'pratos';

   protected $fillable = [
       'nome',
       'descricao',
       'preco',
       'data_criacao',
       'removido',
       'categoria_id'
   ];

   protected $casts = [
       'preco' => 'decimal:2',
       'data_criacao' => 'date',
       'removido' => 'boolean'
   ];

   protected $with = ['categoria', 'ingredientes'];

   public function categoria(): BelongsTo
   {
       return $this->belongsTo(Categoria::class);
   }

   public function ingredientes(): BelongsToMany
   {
       return $this->belongsToMany(Ingrediente::class, 'prato_ingrediente')
           ->withPivot('quantidade')
           ->withTimestamps();
   }

   public function scopeAtivos($query)
   {
       return $query->where('removido', false);
   }
}