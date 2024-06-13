import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common'; // Inject document object

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  setTheme(theme: string) {
    this.document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
