import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-2',
  standalone: true,
  imports: [NavbarHomeComponent, RouterModule],
  templateUrl: './home-2.component.html',
  styleUrl: './home-2.component.css'
})
export class Home2Component {

}
