/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { BRANCH_COMPARISON } from "src/lib/visualization/constants";

export interface AnalysisData {
  daily: AnalysisBasisData | null;
  weekly: AggregatedAnalysisBasisData | null;
  overall: AggregatedAnalysisBasisData | null;
  show_analysis: boolean;
  errors: AnalysisErrorGroup | null;
  metadata?: Metadata;
  other_metrics?: { [group: string]: { [metric: string]: string } };
}

interface AnalysisWindow {
  [segment: string]: AnalysisPoint[] | null;
  all: AnalysisPoint[] | null;
}
interface AggregatedAnalysisWindow {
  [segment: string]: {
    [branch: string]: BranchDescription;
  };
  all: {
    [branch: string]: BranchDescription;
  };
}

export type AnalysisBases = keyof AggregatedAnalysisBasisData;
interface AggregatedAnalysisBasisData {
  enrollments: AggregatedAnalysisWindow;
  exposures?: AggregatedAnalysisWindow;
}
interface AnalysisBasisData {
  enrollments: AnalysisWindow;
  exposures?: AnalysisWindow;
}

export type AnalysisDataOverall = AggregatedAnalysisWindow;
export type AnalysisDataWeekly = AggregatedAnalysisWindow;

/**
 * Contains the analysis errors grouped by metric name, with any errors
 * not specific to a metric put in the "experiment" array.
 */
export interface AnalysisErrorGroup extends Record<string, AnalysisError[]> {
  experiment: AnalysisError[];
}

export interface AnalysisError {
  metric: string | null;
  message: string | null;
  filename: string | null;
  exception: string | null;
  func_name: string | null;
  log_level: string | null;
  statistic: string | null;
  timestamp: string | null;
  experiment: string | null;
  exception_type: string | null;
  analysis_basis: string | null;
  segment: string | null;
}

export interface Metadata {
  metrics: { [metric: string]: MetadataPoint };
  outcomes: { [outcome: string]: MetadataPoint };
  external_config?: MetadataExternalConfig | null;
  analysis_start_time?: string;
}

export interface MetadataExternalConfig {
  start_date: string | null;
  end_date: string | null;
  enrollment_period: number | null;
  reference_branch: string | null;
  skip: boolean;
  url: string;
}

export interface MetadataPoint {
  description: string;
  friendly_name: string;
  bigger_is_better: boolean;
}

export interface AnalysisPoint {
  metric: string;
  statistic: string;
  parameter?: string;
  branch: string;
  comparison?: string;
  ci_width?: number;
  point: number;
  lower?: number;
  upper?: number;
  window_index?: number;
}

export interface FormattedAnalysisPoint {
  point?: number;
  lower?: number;
  upper?: number;
  count?: number;
  branch?: string;
  window_index?: number;
}

export interface BranchDescription {
  is_control: boolean;
  branch_data: {
    [group: string]: {
      [metric: string]: {
        [index: string]: any;
        absolute: {
          first: FormattedAnalysisPoint;
          all: FormattedAnalysisPoint[];
        };
        difference: {
          first: FormattedAnalysisPoint;
          all: FormattedAnalysisPoint[];
        };
        relative_uplift: {
          first: FormattedAnalysisPoint;
          all: FormattedAnalysisPoint[];
        };
        percent?: number;
        significance?: { [window: string]: { [window_index: string]: string } };
      };
    };
  };
}

type BranchComparison = typeof BRANCH_COMPARISON;
type BranchComparisons = keyof BranchComparison;
export type BranchComparisonValues = BranchComparison[BranchComparisons];
