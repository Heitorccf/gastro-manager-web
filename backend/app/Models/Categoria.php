<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'margem_lucro',
        'data_criacao',
        'removido'
    ];

    public function pratos()
    {
        return $this->hasMany(Prato::class);
    }
}