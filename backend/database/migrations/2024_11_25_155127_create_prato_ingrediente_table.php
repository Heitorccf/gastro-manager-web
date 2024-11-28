<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('prato_ingrediente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prato_id')->constrained('pratos');
            $table->foreignId('ingrediente_id')->constrained('ingredientes');
            $table->decimal('quantidade', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prato_ingrediente');
    }
};