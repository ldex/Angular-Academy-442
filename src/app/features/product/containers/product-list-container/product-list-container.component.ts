import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService, CartService } from '@app/services';
import { ProductStore } from '@app/store';

@Component({
  selector: 'app-product-list-container',
  imports: [CommonModule, ProductListComponent],
  template: `
    <app-product-list
      [products]="products()"
      [error]="error()"
      [loading]="loading()"
      [isAuthenticated]="isAuthenticated()"
      (addToCart)="onAddToCart($event)"
      (refresh)="onRefresh()">
    </app-product-list>
  `
})
export class ProductListContainerComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private store = inject(ProductStore);

  authState = toSignal(this.authService.getAuthState());
  isAuthenticated = computed(() => this.authState()?.isAuthenticated ?? false);

  products = this.store.products;
  loading = this.store.loading;
  error = this.store.error;

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  onRefresh(): void {
    this.store.refreshCache();
  }
}