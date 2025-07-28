import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <a routerLink="/features/book/list" class="home-link">Return to Home</a>
      </div>
    </div>
  `,
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
