import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyBtnTestComponent } from './components/BtnTest/BtnTest';


@Component({
  imports: [RouterOutlet, MyBtnTestComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gmail-sort-ai-agent-frontend');
}
