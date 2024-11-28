<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pratos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('descricao');
            $table->decimal('preco', 10, 2);
            $table->date('data_criacao');
            $table->boolean('removido')->default(false);
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pratos');
    }
};