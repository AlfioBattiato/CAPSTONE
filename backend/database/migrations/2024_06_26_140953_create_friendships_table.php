<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('friendships', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('requester_id');
            $table->unsignedBigInteger('addressee_id');
            // enum permette di avere tanti tipi fissi di valore
            $table->enum('status', ['pending', 'accepted'])->default('pending');
            $table->timestamps();

            // colleghiamo il requester_id a uno degli user_id esterni
            $table->foreign('requester_id')->references('id')->on('users')->onDelete('cascade');
            // facciamo lo stesso con l'addressee_id
            $table->foreign('addressee_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['requester_id', 'addressee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('friendships');
    }
};
