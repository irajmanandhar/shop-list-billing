<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('user_id');
            $table->decimal('discount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('tax', 10, 2)->default(0)->after('discount');
            $table->string('payment_method')->default('cash')->after('change_amount');
            $table->timestamp('voided_at')->nullable();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropColumn(['subtotal', 'discount', 'tax', 'payment_method', 'voided_at']);
        });
    }
};
