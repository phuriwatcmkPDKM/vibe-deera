import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JiraAuthService, JiraUser } from '../services/jira-auth.service';
import { JiraApiService, JiraProject, JiraIssue } from '../services/jira-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: JiraUser | null = null;
  projects: JiraProject[] = [];
  assignedIssues: JiraIssue[] = [];
  reportedIssues: JiraIssue[] = [];
  
  isLoadingProjects = false;
  isLoadingAssigned = false;
  isLoadingReported = false;
  
  projectsError = '';
  assignedError = '';
  reportedError = '';

  selectedTab: 'projects' | 'assigned' | 'reported' = 'assigned';

  constructor(
    private authService: JiraAuthService,
    private jiraApiService: JiraApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  loadData() {
    this.loadProjects();
    this.loadAssignedIssues();
    this.loadReportedIssues();
  }

  loadProjects() {
    this.isLoadingProjects = true;
    this.projectsError = '';
    
    this.jiraApiService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoadingProjects = false;
      },
      error: (error) => {
        this.projectsError = error;
        this.isLoadingProjects = false;
      }
    });
  }

  loadAssignedIssues() {
    this.isLoadingAssigned = true;
    this.assignedError = '';
    
    this.jiraApiService.getUserAssignedIssues(20).subscribe({
      next: (result) => {
        this.assignedIssues = result.issues;
        this.isLoadingAssigned = false;
      },
      error: (error) => {
        this.assignedError = error;
        this.isLoadingAssigned = false;
      }
    });
  }

  loadReportedIssues() {
    this.isLoadingReported = true;
    this.reportedError = '';
    
    this.jiraApiService.getUserReportedIssues(20).subscribe({
      next: (result) => {
        this.reportedIssues = result.issues;
        this.isLoadingReported = false;
      },
      error: (error) => {
        this.reportedError = error;
        this.isLoadingReported = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  selectTab(tab: 'projects' | 'assigned' | 'reported') {
    this.selectedTab = tab;
  }

  getStatusColor(statusCategory: string): string {
    switch (statusCategory.toLowerCase()) {
      case 'new':
      case 'indeterminate':
        return '#42526E';
      case 'done':
        return '#00875A';
      default:
        return '#0052CC';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'highest':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      case 'lowest':
        return '🔵';
      default:
        return '⚪';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}