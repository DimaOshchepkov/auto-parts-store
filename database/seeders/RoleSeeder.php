<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{

    public function run(): void
    {
        Role::updateOrCreate(['name' => 'user'], ['label' => 'Пользователь']);
        Role::updateOrCreate(['name' => 'admin'], ['label' => 'Администратор']);
    }
}
