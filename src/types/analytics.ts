/** Adjust these to match your existing RTK Query generated types if present. */
export interface DailyViewPoint {
  /** ISO date string, e.g. "2025-06-21" */
  date: string;
  views: number;
}

export interface TopPage {
  page_path: string;
  views: number;
}

export interface AnalyticsSummary {
  total_views: number;
  unique_visitors: number;
  total_sessions: number;
  today_views: number;
  today_visitors: number;
  daily_views: DailyViewPoint[];
  top_pages: TopPage[];
}