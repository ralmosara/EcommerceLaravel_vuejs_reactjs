<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@punkrecords.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0100',
            'role' => UserRole::ADMIN,
            'email_verified_at' => now(),
        ]);

        // Create regular customers
        $customers = [
            [
                'name' => 'Johnny Ramone',
                'email' => 'johnny@example.com',
                'phone' => '+1-555-0101',
            ],
            [
                'name' => 'Joey Ramone',
                'email' => 'joey@example.com',
                'phone' => '+1-555-0102',
            ],
            [
                'name' => 'Dee Dee Ramone',
                'email' => 'deedee@example.com',
                'phone' => '+1-555-0103',
            ],
            [
                'name' => 'Joe Strummer',
                'email' => 'joe@example.com',
                'phone' => '+1-555-0104',
            ],
            [
                'name' => 'Sid Vicious',
                'email' => 'sid@example.com',
                'phone' => '+1-555-0105',
            ],
            [
                'name' => 'Billie Joe Armstrong',
                'email' => 'billie@example.com',
                'phone' => '+1-555-0106',
            ],
            [
                'name' => 'Tim Armstrong',
                'email' => 'tim@example.com',
                'phone' => '+1-555-0107',
            ],
            [
                'name' => 'Fat Mike',
                'email' => 'mike@example.com',
                'phone' => '+1-555-0108',
            ],
            [
                'name' => 'Jello Biafra',
                'email' => 'jello@example.com',
                'phone' => '+1-555-0109',
            ],
            [
                'name' => 'Henry Rollins',
                'email' => 'henry@example.com',
                'phone' => '+1-555-0110',
            ],
        ];

        foreach ($customers as $customerData) {
            User::create([
                ...$customerData,
                'password' => Hash::make('password'),
                'role' => UserRole::CUSTOMER,
                'email_verified_at' => now(),
            ]);
        }
    }
}
