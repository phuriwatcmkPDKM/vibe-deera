import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JiraAuthService } from './jira-auth.service';

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: any;
  entityId: string;
  uuid: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: any;
    status: {
      name: string;
      id: string;
      statusCategory: {
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
    priority: {
      name: string;
      id: string;
      iconUrl: string;
    };
    assignee: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      avatarUrls: any;
    } | null;
    reporter: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      avatarUrls: any;
    };
    project: {
      id: string;
      key: string;
      name: string;
    };
    issuetype: {
      id: string;
      name: string;
      iconUrl: string;
    };
    created: string;
    updated: string;
    duedate?: string;
  };
}

export interface JiraSearchResult {
  issues: JiraIssue[];
  startAt: number;
  maxResults: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  constructor(
    private http: HttpClient,
    private authService: JiraAuthService
  ) {}

  getProjects(): Observable<JiraProject[]> {
    // Note: Direct API calls will fail due to CORS. 
    // For demo purposes, returning mock data.
    // In production, you need a backend proxy server.
    return new Observable(observer => {
      console.warn('CORS Limitation: Cannot fetch real projects from frontend. Showing mock data.');
      const mockProjects: JiraProject[] = [
        {
          id: '10001',
          key: 'DEMO',
          name: 'Demo Project',
          projectTypeKey: 'software',
          simplified: true,
          style: 'next-gen',
          isPrivate: false,
          properties: {},
          entityId: 'demo-entity',
          uuid: 'demo-uuid'
        },
        {
          id: '10002',
          key: 'TEST',
          name: 'Test Project',
          projectTypeKey: 'business',
          simplified: false,
          style: 'classic',
          isPrivate: true,
          properties: {},
          entityId: 'test-entity',
          uuid: 'test-uuid'
        }
      ];
      
      setTimeout(() => {
        observer.next(mockProjects);
        observer.complete();
      }, 1000);
    });
  }

  getUserAssignedIssues(maxResults: number = 50): Observable<JiraSearchResult> {
    // Note: Direct API calls will fail due to CORS.
    // For demo purposes, returning mock data.
    return new Observable(observer => {
      console.warn('CORS Limitation: Cannot fetch real issues from frontend. Showing mock data.');
      const currentUser = this.authService.getCurrentUser();
      
      const mockIssues: JiraIssue[] = [
        {
          id: '10001',
          key: 'DEMO-1',
          fields: {
            summary: 'Implement user authentication',
            description: { type: 'doc', content: [] },
            status: {
              name: 'In Progress',
              id: '3',
              statusCategory: {
                id: 4,
                key: 'indeterminate',
                colorName: 'yellow',
                name: 'In Progress'
              }
            },
            priority: {
              name: 'High',
              id: '2',
              iconUrl: 'https://example.com/high.png'
            },
            assignee: currentUser,
            reporter: currentUser!,
            project: {
              id: '10001',
              key: 'DEMO',
              name: 'Demo Project'
            },
            issuetype: {
              id: '10001',
              name: 'Task',
              iconUrl: 'https://example.com/task.png'
            },
            created: new Date(Date.now() - 86400000 * 3).toISOString(),
            updated: new Date(Date.now() - 3600000).toISOString(),
            duedate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
          }
        },
        {
          id: '10002',
          key: 'DEMO-2',
          fields: {
            summary: 'Design dashboard layout',
            description: { type: 'doc', content: [] },
            status: {
              name: 'To Do',
              id: '1',
              statusCategory: {
                id: 2,
                key: 'new',
                colorName: 'blue-gray',
                name: 'To Do'
              }
            },
            priority: {
              name: 'Medium',
              id: '3',
              iconUrl: 'https://example.com/medium.png'
            },
            assignee: currentUser,
            reporter: currentUser!,
            project: {
              id: '10001',
              key: 'DEMO',
              name: 'Demo Project'
            },
            issuetype: {
              id: '10002',
              name: 'Story',
              iconUrl: 'https://example.com/story.png'
            },
            created: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated: new Date(Date.now() - 7200000).toISOString()
          }
        }
      ];

      const result: JiraSearchResult = {
        issues: mockIssues,
        startAt: 0,
        maxResults: maxResults,
        total: mockIssues.length
      };
      
      setTimeout(() => {
        observer.next(result);
        observer.complete();
      }, 1500);
    });
  }

  getUserReportedIssues(maxResults: number = 50): Observable<JiraSearchResult> {
    // Note: Direct API calls will fail due to CORS.
    // For demo purposes, returning mock data.
    return new Observable(observer => {
      console.warn('CORS Limitation: Cannot fetch real reported issues from frontend. Showing mock data.');
      const currentUser = this.authService.getCurrentUser();
      
      const mockIssues: JiraIssue[] = [
        {
          id: '10003',
          key: 'DEMO-3',
          fields: {
            summary: 'Bug in login form validation',
            description: { type: 'doc', content: [] },
            status: {
              name: 'Done',
              id: '6',
              statusCategory: {
                id: 3,
                key: 'done',
                colorName: 'green',
                name: 'Done'
              }
            },
            priority: {
              name: 'High',
              id: '2',
              iconUrl: 'https://example.com/high.png'
            },
            assignee: {
              accountId: 'dev-123',
              displayName: 'John Developer',
              emailAddress: 'john@example.com',
              avatarUrls: { '24x24': 'https://example.com/avatar.png' }
            },
            reporter: currentUser!,
            project: {
              id: '10001',
              key: 'DEMO',
              name: 'Demo Project'
            },
            issuetype: {
              id: '10004',
              name: 'Bug',
              iconUrl: 'https://example.com/bug.png'
            },
            created: new Date(Date.now() - 86400000 * 5).toISOString(),
            updated: new Date(Date.now() - 86400000).toISOString()
          }
        }
      ];

      const result: JiraSearchResult = {
        issues: mockIssues,
        startAt: 0,
        maxResults: maxResults,
        total: mockIssues.length
      };
      
      setTimeout(() => {
        observer.next(result);
        observer.complete();
      }, 1200);
    });
  }

  getProjectIssues(_projectKey: string, _maxResults: number = 50): Observable<JiraSearchResult> {
    console.warn('CORS Limitation: This method requires a backend proxy server.');
    return throwError(() => 'Method not implemented - requires backend proxy');
  }

  searchIssues(_jql: string, _maxResults: number = 50): Observable<JiraSearchResult> {
    console.warn('CORS Limitation: This method requires a backend proxy server.');
    return throwError(() => 'Method not implemented - requires backend proxy');
  }

  getIssue(_issueKey: string): Observable<JiraIssue> {
    console.warn('CORS Limitation: This method requires a backend proxy server.');
    return throwError(() => 'Method not implemented - requires backend proxy');
  }
}