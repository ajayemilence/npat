import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  username;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    const user = this.localStorageService.get('user-data');
    console.log(user.admin_first_name + ' ' + user.admin_last_name);
    this.username = user.admin_first_name + ' ' + user.admin_last_name;

  }

}
