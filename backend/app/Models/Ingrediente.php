<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Ingrediente extends Model
{
    protected $table = 'ingredientes';
    
    protected $fillable = [
        'nome',
        'descricao',
        'preco_unitario',
        'data_validade',
        'removido'
    ];

    public function pratos()
    {
        return $this->belongsToMany(Prato::class, 'prato_ingrediente')
            ->withPivot('quantidade')
            ->withTimestamps();
    }
}