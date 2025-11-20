import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataStorageService } from '../../core/services/data-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mvs-admin-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './mvs-admin-verification.component.html',
  styleUrls: ['./mvs-admin-verification.component.css']
})
export class MvsAdminVerificationComponent implements OnInit {
  regId: string = '';
  verificationResult: any = null;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private dataService: DataStorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Verify user has MVS_ADMIN role
    const role = localStorage.getItem('role');
    if (role !== 'MVS_ADMIN') {
      this.router.navigate(['/application-list']);
    }
  }

  checkStatus(): void {
    if (!this.regId.trim()) {
      this.snackBar.open('Please enter a Registration ID', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.verificationResult = null;

    this.dataService.getAssignedOfficerDetails(this.regId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.response) {
          // Handle both string and object responses
          if (typeof response.response === 'string') {
            this.verificationResult = { status: response.response };
          } else if (typeof response.response === 'object') {
            this.verificationResult = response.response;
          }
          this.snackBar.open('Status retrieved successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        } else {
          this.error = 'No data found for the given Registration ID';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Failed to retrieve status. Please check the Registration ID and try again.';
        this.snackBar.open(this.error, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  clearSearch(): void {
    this.regId = '';
    this.verificationResult = null;
    this.error = '';
  }

  formatKey(key: unknown): string {
    if (typeof key === 'string') {
      return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    }
    return String(key);
  }
}
