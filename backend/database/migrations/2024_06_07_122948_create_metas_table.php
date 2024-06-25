<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('metas', function (Blueprint $table) {
            $table->id();
            // non lo metto onDelete('cascade') im modo che man mano nel tempo mi riempiono il database di mete da poter suggerire ai prossimi viaggi tramite dropdown/option
            $table->foreignId('travel_id')->constrained()->onDelete('cascade');
            $table->string('name_location');
            $table->float('lat');
            $table->float('lon');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metas');
    }
};
