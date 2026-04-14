import { Injectable, inject, signal } from "@angular/core";
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthService } from "./auth";

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
  updatedAt?: unknown;
  createdBy?: string;
}

export interface Movement {
  id?: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: Timestamp;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private auth = inject(AuthService);
  products = signal<Product[]>([]);
  movements = signal<Movement[]>([]);

  constructor() {
    this.initProducts();
    this.initMovements();
  }

  private initProducts() {
    const q = query(collection(db, 'products'), orderBy('name'));
    onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      this.products.set(items);
    });
  }

  private initMovements() {
    const q = query(collection(db, 'movements'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Movement));
      this.movements.set(items);
    });
  }

  async addProduct(product: Omit<Product, 'id'>) {
    const user = this.auth.user();
    if (!user) return;
    
    await addDoc(collection(db, 'products'), {
      ...product,
      createdBy: user.uid,
      updatedAt: serverTimestamp()
    });
  }

  async updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp()
    });
  }

  async registerMovement(productId: string, productName: string, type: 'IN' | 'OUT', quantity: number, reason: string) {
    const user = this.auth.user();
    if (!user) return;

    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    const newStock = type === 'IN' ? product.stock + quantity : product.stock - quantity;
    if (newStock < 0) throw new Error('Estoque insuficiente');

    // Add movement
    await addDoc(collection(db, 'movements'), {
      productId,
      productName,
      type,
      quantity,
      reason,
      timestamp: serverTimestamp(),
      userId: user.uid
    });

    // Update product stock
    await this.updateProduct(productId, { stock: newStock });
  }
}
