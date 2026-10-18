'use client';

import React, { useState } from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';

export function PublicHealthWorkspace() {
  const { districtCoverage, setDistrictCoverage, setRole } = usePrototype();
  const [syndromeMode, setSyndromeMode] = useState<'respiratory' | 'fever'>('respiratory');

  // Calculate confidence based on coverage
  const confidence = districtCoverage >= 75 ? 'Medium-High' : districtCoverage >= 50 ? 'Medium-Low' : 'Low';
  const confidenceTone: 'teal' | 'amber' | 'red' = districtCoverage >= 75 ? 'teal' : districtCoverage >= 50 ? 'amber' : 'red';

  // Synthetic trend bars
  const respiratoryTrend = [28, 31, 29, 36, 41, 47, 58, 69, 74, 82, 89, 94];
  const baseline = 34;

  return (
    <div className="p-ph-app">
      <PageHead
        eyebrow="POPULATION HEALTH INTELLIGENCE · VADODARA DISTRICT"
        title="See the pattern. Never the person."
        copy="Privacy-preserving aggregate signals detect emerging health trends without exposing patient identities or centralizing medical records."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">District: Vadodara (Synthetic)</span>
            <span className="p-pill">Protocol: Prio/VDAF-Style Aggregation</span>
            <button className="primary small" onClick={() => setRole('aggregation-lab')}>
              <ProtoIcon name="lock" /> Open Aggregation Cryptography Lab →
            </button>
          </div>
        }
      />

      {/* METRIC GRID */}
      <div className="p-grid stats">
        <ProtoMetric
          label="SYNDROMIC SIGNAL"
          value="Respiratory Syndrome ↑"
          subvalue="Unusual cluster across 10 outpatient facilities"
          tone="amber"
        />

        <ProtoMetric
          label="REPORTING COMPLETENESS"
          value={`${districtCoverage}% Facilities`}
          subvalue="Interactive slider below updates confidence"
          tone={confidenceTone}
        />

        <ProtoMetric
          label="STATISTICAL CONFIDENCE"
          value={confidence}
          subvalue={`Based on ${districtCoverage}% data completeness`}
          tone={confidenceTone}
        />

        <ProtoMetric
          label="EPIDEMIOLOGICAL STATUS"
          value="Investigation Recommended"
          subvalue="Alert dispatched to District Surveillance Officer"
          tone="amber"
        />
      </div>

      {/* CHART & COVERAGE INTERACTIVE EXPERIMENT */}
      <div className="p-grid two">
        <ProtoPanel
          title="Vadodara District · 12-Day Syndromic Signal vs Baseline"
          subtitle="Unique patient counts per facility aggregated via secure computation. Not visit counts."
          badge={<ProtoStatus tone="amber">CLUSTER DETECTED</ProtoStatus>}
        >
          <div className="p-ph-chart-container">
            <div className="p-ph-chart-bars">
              {respiratoryTrend.map((val, idx) => (
                <div key={idx} className="p-ph-bar-col">
                  <div
                    className="p-ph-bar-fill"
                    style={{ height: `${val}%` }}
                    title={`Day ${idx + 1}: Index ${val} (Observed)`}
                  />
                  <span className="p-ph-bar-label">D{idx + 1}</span>
                </div>
              ))}
              <div
                className="p-ph-baseline-line"
                style={{ bottom: `${baseline}%` }}
                title="Historical Baseline"
              >
                <span>Baseline ({baseline})</span>
              </div>
            </div>
          </div>

          <div className="p-ph-chart-legend">
            <div className="legend-item">
              <span className="legend-color observed" />
              <span>Observed Aggregate Signal</span>
            </div>
            <div className="legend-item">
              <span className="legend-color baseline" />
              <span>Historical District Baseline</span>
            </div>
          </div>
        </ProtoPanel>

        {/* COVERAGE SLIDER & CONSTITUTIONAL PRINCIPLES */}
        <ProtoPanel
          title="Interactive Coverage & Uncertainty Lab"
          subtitle="Test how missing facility data impacts public health interpretation."
        >
          <div className="p-coverage-slider-box">
            <div className="p-slider-head">
              <b>Simulate District Reporting Coverage:</b>
              <span className="p-coverage-val">{districtCoverage}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={districtCoverage}
              onChange={e => setDistrictCoverage(Number(e.target.value))}
              className="p-range-slider"
            />
            <div className="p-slider-markers">
              <span>20% (Severe gaps)</span>
              <span>62% (Moderate reporting)</span>
              <span>81% (Current baseline)</span>
              <span>100% (Complete)</span>
            </div>
          </div>

          <div className="p-uncertainty-callout">
            <ProtoIcon name="alert" />
            <div>
              <b>CONSTITUTIONAL RULE: No Data ≠ No Disease.</b>
              <p>
                When facilities do not report during a window, JeevanRekha does NOT invent zero cases.
                Coverage decreases and confidence lowers. A poorly digitized rural district must never appear deceptively healthy.
              </p>
            </div>
          </div>

          <div className="p-ai-rule-callout">
            <ProtoIcon name="shield" />
            <div>
              <b>AI NEVER DECLARES AN OUTBREAK AUTONOMOUSLY.</b>
              <p>
                Statistical anomalies surface: <em>&ldquo;Unusual increase. Investigation recommended.&rdquo;</em>
                Human epidemiologists from IDSP/IHIP and Rapid Response Teams investigate ground clinical realities before declaring epidemics.
              </p>
            </div>
          </div>
        </ProtoPanel>
      </div>
    </div>
  );
}
