<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PratoIngrediente extends Model
{
    protected $table = 'prato_ingrediente';
    
    protected $fillable = [
        'prato_id',
        'ingrediente_id',
        'quantidade'
    ];

    public function prato()
    {
        return $this->belongsTo(Prato::class);
    }

    public function ingrediente()
    {
        return $this->belongsTo(Ingrediente::class);
    }
}