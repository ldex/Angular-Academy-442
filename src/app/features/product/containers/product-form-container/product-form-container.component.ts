import {
  Component,
  Input,
  OnInit,
  Signal,
  computed,
  inject,
  input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductFormComponent } from "../../components/product-form/product-form.component";
import { ProductService } from "../../../../services/product.service";
import { Product } from "../../../../models/product.model";
import { ProductStore } from "../../../../store/product.store";

@Component({
  selector: "app-product-form-container",
  imports: [CommonModule, ProductFormComponent],
  template: `
    @if (loading()) {
      <div class="loading"></div>
    } @else {
      <app-product-form
        [product]="product()"
        [isSubmitting]="isSubmitting"
        (save)="onSave($event)"
        (cancel)="onCancel()"
      >
      </app-product-form>
    }
  `,
})
export class ProductFormContainerComponent implements OnInit {
  private router = inject(Router);
 // private productService = inject(ProductService);

 private store = inject(ProductStore)

  product: Signal<Product | null> = this.store.selectedProduct;
  loading: Signal<boolean> = this.store.loading;
  isSubmitting = false;
  private productId: number | null = null;

  readonly id = input<number>()

  ngOnInit() {
    this.productId = this.id() ?? null;

    this.store.clearSelectedProduct();

    // Only fetch if we are in edit mode (productId is set)
    if(this.productId) {
      this.store.loadProduct(this.productId)
    }
  }

  onSave(formData: Partial<Product>): void {
    if (!this.validateFormData(formData)) {
      return;
    }

    this.isSubmitting = true;

    if (this.productId) {
      this.store.updateProduct({id: this.productId, product: formData})
    } else {
      const newProduct = {
        title: formData.title!,
        price: formData.price!,
        description: formData.description!,
        category: formData.category!,
        image: formData.image!,
        rating: { rate: 0, count: 0 },
      };

      this.store.createProduct(newProduct)
    }
  }

  onCancel(): void {
    this.router.navigate(["/products"]);
  }

  private validateFormData(formData: Partial<Product>): boolean {
    const requiredFields = [
      "title",
      "price",
      "description",
      "category",
      "image",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return false;
    }

    return true;
  }
}
