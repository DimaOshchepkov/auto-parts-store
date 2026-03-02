<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Hidden::make('_slug_touched')
                    ->default(false)
                    ->dehydrated(false),

                TextInput::make('name')
                    ->required()
                    ->live(debounce: 300)
                    ->afterStateUpdated(function ($state, callable $set, callable $get, $record) {

                        // если редактирование и slug уже существует в БД — не трогаем
                        if ($record && $record->slug) {
                            return;
                        }

                        // если пользователь уже менял slug вручную — не трогаем
                        if ($get('_slug_touched')) {
                            return;
                        }

                        $set('slug', Str::slug($state));
                    }),

                TextInput::make('slug')
                    ->required()
                    ->live(debounce: 300)
                    ->afterStateUpdated(function ($state, callable $set) {
                        $set('_slug_touched', true);
                    })
                    ->unique(ignoreRecord: true),
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('cost_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('stock_quantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
                SpatieMediaLibraryFileUpload::make('images')
                    ->collection('images')
                    ->openable()
                    ->multiple()
                    ->reorderable()
                    ->image()
                    ->conversion('thumb_webp')
                    ->customProperties(fn (callable $get) => [
                        'alt' => (string) ($get('name') ?? ''),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
