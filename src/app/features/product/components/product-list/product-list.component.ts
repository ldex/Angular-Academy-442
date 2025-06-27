import { Component, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {

  readonly products = input.required<Product[]>();
  readonly error = input.required<string | null>();
  readonly loading = input(false);
  readonly isAuthenticated = input(false);
  readonly addToCart = output<number>();
  readonly refresh = output<void>();

  selectedCategory = model('');
  searchQuery = model('');
  sortBy = model('name');

  categories = computed(() =>
    [...new Set(this.products().map(p => p.category))]
  );

  filteredProducts = computed(() => {
    let filtered = [...this.products()];

    // Apply search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategory()) {
      filtered = filtered.filter(product =>
        product.category === this.selectedCategory()
      );
    }

    // Apply sorting
    switch (this.sortBy()) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default: // name
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  });

  onAddToCart(productId: number): void {
    this.addToCart.emit(productId);
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}