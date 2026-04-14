import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { User as FirebaseUser, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

// import { auth, db } from '../firebase';


export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  user = signal<UserProfile | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await this.getUserProfile(fbUser);
        this.user.set(profile);
      } else {
        this.user.set(null);
      }
      this.loading.set(false);
    });
  }

  private async getUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const docRef = doc(db, 'users', fbUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        photoURL: fbUser.photoURL || '',
        role: 'user'
      };
      await setDoc(docRef, newProfile);
      return newProfile;
    }
  }

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error', error);
    }
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/login']);
  }
}
