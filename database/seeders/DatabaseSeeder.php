<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /** @var array<string, array<string, float>> */
    private const CATALOG = [
        'Coffee' => ['Espresso' => 2.5, 'Americano' => 3.0, 'Latte' => 4.25, 'Cappuccino' => 4.0, 'Mocha' => 4.75, 'Cold Brew' => 4.5],
        'Tea' => ['Green Tea' => 3.0, 'Chai Latte' => 4.25, 'Matcha Latte' => 5.0, 'Earl Grey' => 3.0],
        'Bakery' => ['Butter Croissant' => 3.5, 'Blueberry Muffin' => 3.25, 'Cinnamon Roll' => 4.0, 'Banana Bread' => 3.75, 'Bagel & Cream Cheese' => 4.5],
        'Food' => ['Avocado Toast' => 8.5, 'Turkey Sandwich' => 9.0, 'Caprese Panini' => 9.5, 'Greek Salad' => 8.0],
        'Cold Drinks' => ['Orange Juice' => 3.5, 'Sparkling Water' => 2.0, 'Iced Tea' => 3.25, 'Lemonade' => 3.5],
    ];

    /** Idempotent: safe to run on every deploy. */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'demo@pulsepos.test'],
            ['name' => 'Demo Manager', 'password' => Hash::make('password'), 'email_verified_at' => now()],
        );

        if (Product::doesntExist()) {
            $this->seedCatalog();
        }

        if (Sale::doesntExist()) {
            $this->seedSales($user);
        }
    }

    private function seedCatalog(): void
    {
        foreach (self::CATALOG as $categoryName => $items) {
            $category = Category::create(['name' => $categoryName, 'description' => "$categoryName menu"]);

            foreach ($items as $name => $price) {
                $category->products()->create([
                    'name' => $name,
                    'price' => $price,
                    'stock' => random_int(40, 120),
                ]);
            }
        }

        // A couple of items are nearly out so the low-stock widgets have data.
        Product::whereIn('name', ['Cinnamon Roll', 'Matcha Latte'])->update(['stock' => 3]);
        Product::where('name', 'Banana Bread')->update(['stock' => 0]);
    }

    /** 30 days of plausible traffic, busier on weekends and mornings. */
    private function seedSales(User $user): void
    {
        $products = Product::all();
        $saleId = (int) Sale::max('id');
        $sales = [];
        $items = [];

        for ($day = 29; $day >= 0; $day--) {
            $date = today()->subDays($day);
            $count = random_int(14, 30) + ($date->isWeekend() ? 12 : 0);

            for ($n = 0; $n < $count; $n++) {
                $saleId++;
                $subtotal = 0;

                foreach ($products->random(min(random_int(1, 4), $products->count())) as $product) {
                    $qty = random_int(1, 3);
                    $line = (int) round($product->price * 100) * $qty;
                    $subtotal += $line;
                    $items[] = [
                        'sale_id' => $saleId,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'unit_price' => $product->price,
                        'quantity' => $qty,
                        'subtotal' => $line / 100,
                    ];
                }

                $tax = (int) round($subtotal * config('pos.tax_rate') / 100);
                $total = $subtotal + $tax;
                $cash = random_int(0, 2) === 0;
                $tendered = $cash ? (int) (ceil($total / 500) * 500) : $total;
                $stamp = $date->copy()->setTime(random_int(7, 19), random_int(0, 59));

                $sales[] = [
                    'id' => $saleId,
                    'user_id' => $user->id,
                    'subtotal' => $subtotal / 100,
                    'discount' => 0,
                    'tax' => $tax / 100,
                    'total' => $total / 100,
                    'cash_tendered' => $tendered / 100,
                    'change_amount' => ($tendered - $total) / 100,
                    'payment_method' => $cash ? 'cash' : 'card',
                    'status' => random_int(1, 40) === 1 ? 'voided' : 'completed',
                    'created_at' => $stamp,
                    'updated_at' => $stamp,
                ];
            }
        }

        foreach (array_chunk($sales, 200) as $chunk) {
            DB::table('sales')->insert($chunk);
        }

        foreach (array_chunk($items, 400) as $chunk) {
            DB::table('sales_items')->insert(array_map(
                fn (array $row) => $row + ['created_at' => now(), 'updated_at' => now()],
                $chunk,
            ));
        }

        // Explicit ids bypass the sequence on Postgres; move it past them.
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("SELECT setval(pg_get_serial_sequence('sales', 'id'), (SELECT MAX(id) FROM sales))");
        }
    }
}
