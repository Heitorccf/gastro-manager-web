<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Prato extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'data_criacao',
        'removido',
        'categoria_id'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function ingredientes()
    {
        return $this->belongsToMany(Ingrediente::class, 'prato_ingrediente')
            ->withPivot('quantidade')
            ->withTimestamps();
    }
}