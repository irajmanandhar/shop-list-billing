<?php

return [
    'store_name' => env('POS_STORE_NAME', 'PulsePOS Demo Store'),
    'tax_rate' => (float) env('POS_TAX_RATE', 8),
    'low_stock' => (int) env('POS_LOW_STOCK', 5),
    // Use an S3-compatible disk (e.g. R2) on hosts with ephemeral storage like Vercel.
    'image_disk' => env('POS_IMAGE_DISK', 'public'),
    'demo' => (bool) env('POS_DEMO', false),
];
