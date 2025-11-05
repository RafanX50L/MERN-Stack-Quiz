export interface IUserDashboardService {
  getUserDashboard(userId: string): Promise<any>;
}