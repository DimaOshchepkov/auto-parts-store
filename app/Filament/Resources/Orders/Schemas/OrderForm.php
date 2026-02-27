<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Select::make('customer_id')
                    ->relationship('customer')
                    ->searchable()
                    ->preload()
                    ->getOptionLabelFromRecordUsing(
                        fn($record) =>
                        "{$record->name} — {$record->phone}"
                    )
                    ->required(),
                Select::make('status')
                    ->options([
                        'new' => 'New',
                        'paid' => 'Paid',
                        'shipped' => 'Shipped',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->default('new')
                    ->required(),
                TextInput::make('total_amount')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('payment_status')
                    ->required()
                    ->default('unpaid'),
                Textarea::make('shipping_address')
                    ->columnSpanFull(),
            ]);
    }
}
