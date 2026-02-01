<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artists', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique()->nullable();
            $table->string('name');
            $table->text('bio')->nullable();
            $table->integer('formed_year')->nullable();
            $table->string('origin', 100)->nullable();
            $table->json('links')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->fullText(['name', 'bio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artists');
    }
};
