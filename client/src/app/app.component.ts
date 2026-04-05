import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  isHomePage = true;
  trackingId = '';
  trackingError = '';
  currentYear = new Date().getFullYear();

  // Stats Logic
  stats = [
    { label: 'Parcels Moved', target: 4, current: 0, suffix: ' Bn+' },
    { label: 'Active Clients', target: 48, current: 0, suffix: 'K+' },
    { label: 'Network Cover', target: 99.5, current: 0, suffix: '%' },
    { label: 'Support Sync', target: 24, current: 0, suffix: '/7' }
  ];

  @ViewChild('statsSection') statsSection!: ElementRef;
  observer: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateHomeFlag(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.updateHomeFlag(e.urlAfterRedirects || e.url);
    });
  }

  private updateHomeFlag(url: string) {
    this.isHomePage = (url === '/' || url === '' || url.includes('index.html'));
  }

  // Number Counting Logic
  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.startCounting();
        this.observer.disconnect(); // Only animate once
      }
    }, { threshold: 0.5 });

    if (this.statsSection) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  startCounting() {
    this.stats.forEach(stat => {
      let start = 0;
      const end = stat.target;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          stat.current = end;
          clearInterval(timer);
        } else {
          stat.current = start;
        }
      }, 16);
    });
  }

  // Auth & Nav Methods
  get IsLoggin() { return this.authService.getLoginStatus; }
  get roleName() { return this.authService.getRole; }
  goLogin() { this.router.navigateByUrl('/login'); }
  goRegister() { this.router.navigateByUrl('/registration'); }
  goDashboard() { this.router.navigateByUrl('/dashboard'); }
  logout() { this.authService.logout(); this.router.navigateByUrl('/login'); }
  trackShipment() { /* your existing track logic */ }
}