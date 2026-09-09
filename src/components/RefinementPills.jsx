/**
 * WishPilot - Universal Stealth Interview Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

import React, { useState } from 'react';
import { REFINEMENT_TYPES } from '../constants/interviewCategories';

/**
 * RefinementPills Component
 * Quick action buttons rendered right after an answer streams:
 * - "Make Shorter"
 * - "More Technical"
 * - "Give an Example"
 * - "Simpler Language"
 *
 * STRICT REQUIREMENT: ZERO EMOJIS - Strictly custom monochrome vector SVGs.
 */
export default function RefinementPills({
  onRefine,
  isGenerating = false,
  activeType = null,
  compact = false,
  style = {}
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: compact ? '5px' : '7px',
        padding: compact ? '4px 0' : '6px 0',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginRight: '2px',
          fontSize: compact ? '9.5px' : '10.5px',
          fontWeight: '700',
          color: '#71717a',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          userSelect: 'none'
        }}
      >
        <span>Refine</span>
      </div>

      {REFINEMENT_TYPES.map((ref) => {
        const Icon = ref.icon;
        const isHovered = hoveredId === ref.id;
        const isActive = activeType === ref.id;

        return (
          <button
            key={ref.id}
            type="button"
            disabled={isGenerating}
            onClick={() => onRefine && onRefine(ref.id)}
            onMouseEnter={() => setHoveredId(ref.id)}
            onMouseLeave={() => setHoveredId(null)}
            title={ref.description}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: compact ? '5px' : '6px',
              padding: compact ? '3.5px 8px' : '5px 11px',
              borderRadius: '16px',
              border: isActive
                ? '1px solid #ffffff'
                : isHovered && !isGenerating
                ? '1px solid #52525b'
                : '1px solid #27272a',
              background: isActive
                ? '#27272a'
                : isHovered && !isGenerating
                ? '#1e1e22'
                : '#121214',
              color: isActive
                ? '#ffffff'
                : isHovered && !isGenerating
                ? '#ffffff'
                : '#a1a1aa',
              fontSize: compact ? '10.5px' : '11.5px',
              fontWeight: isActive ? '600' : '500',
              fontFamily: 'inherit',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating && !isActive ? 0.45 : 1,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              boxShadow: isHovered && !isGenerating ? '0 2px 6px rgba(0,0,0,0.35)' : 'none',
              userSelect: 'none'
            }}
          >
            <Icon
              size={compact ? 12 : 13}
              style={{
                color: isActive ? '#ffffff' : isHovered ? '#ffffff' : '#a1a1aa',
                transition: 'color 0.15s ease'
              }}
            />
            <span>{compact ? ref.shortLabel : ref.label}</span>
          </button>
        );
      })}
    </div>
  );
}
