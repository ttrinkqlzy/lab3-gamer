const mix = require('laravel-mix');

mix.js('resources/js/main.js', 'public/js')
   .sass('resources/scss/main.scss', 'public/css')
   .copyDirectory('resources/images', 'public/images');
   