<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message')->nullable();
            $table->timestamp('send_at')->useCurrent();
        });

        // Aggiungi la colonna MEDIUMBLOB
        Schema::table('messages', function (Blueprint $table) {
            DB::statement('ALTER TABLE messages ADD file MEDIUMBLOB NULL'); //in futuro potrebbero essere sia vocali che immagini o video
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
