<?php

namespace App\Http\Requests\Admin;

use App\Models\ProductCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * @return array<string, array<int, ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category_id' => ['required', 'integer', Rule::exists(ProductCategory::class, 'id')],
            'price' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
            'featured' => ['boolean'],
            'is_available' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'featured' => $this->boolean('featured'),
            'is_available' => $this->boolean('is_available'),
            'price' => $this->filled('price') ? $this->price : null,
        ]);
    }
}
