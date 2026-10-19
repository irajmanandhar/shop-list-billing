<?php

// Vercel entrypoint: the filesystem is read-only except /tmp.
foreach (['views', 'cache', 'sessions', 'logs'] as $dir) {
    is_dir("/tmp/storage/$dir") || mkdir("/tmp/storage/$dir", 0755, true);
}

require __DIR__.'/../public/index.php';
