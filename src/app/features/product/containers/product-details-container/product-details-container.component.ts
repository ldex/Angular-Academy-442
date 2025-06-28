import { Component, inject, Signal, computed, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { Product } from '../../../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '@app/store';
import { AuthService, CartService } from '@app/services';

@Component({
  selector: 'app-product-details-container',
  imports: [CommonModule, ProductDetailsComponent],
  template: `
    <app-product-details
      [product]="product()"
      [error]="error()"
      [loading]="loading()"
      [isAuthenticated]="isAuthenticated()"
      (addToCart)="onAddToCart($event)"
      (delete)="onDelete($event)">
    </app-product-details>
  `
})
export class ProductDetailsContainerComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private store = inject(ProductStore);

  product: Signal<Product | null> = this.store.selectedProduct;
  error: Signal<string | null> = this.store.error;
  loading: Signal<boolean> = this.store.loading;

  authState = toSignal(this.authService.getAuthState());
  isAuthenticated = computed(() => this.authState()?.isAuthenticated ?? false);

  id = input.required<number>()

  ngOnInit() {
    this.store.loadProduct(this.id())
  }

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  onDelete(productId: number): void {
      this.store.deleteProduct(productId)
  }
}