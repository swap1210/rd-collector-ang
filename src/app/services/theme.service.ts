import { Inject, Injectable, effect, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common'; // Inject document object

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode = signal(false);
  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      this.document.body.classList.toggle('dark-theme', this.darkMode());
    });
  }
}
