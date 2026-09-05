import React from 'react';

// ============================================================================
// CUSTOM MONOCHROME VECTOR ICONS (ZERO EMOJIS - STRICTLY VECTOR SVG)
// ============================================================================

export const CategoryIcons = {
  it: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),

  bpo: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      <path d="M7 21v1a2 2 0 0 0 2 2h4" />
    </svg>
  ),

  finance: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),

  sales: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),

  hr: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  product: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),

  healthcare: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),

  engineering: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),

  custom: ({ size = 16, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};

// ============================================================================
// INSTANT ANSWER REFINEMENT PILLS - VECTOR ICONS (STRICTLY NO EMOJIS)
// ============================================================================

export const RefinementIcons = {
  shorter: ({ size = 13, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <line x1="4" y1="12" x2="11" y2="12" />
      <polyline points="8 9 11 12 8 15" />
      <line x1="20" y1="12" x2="13" y2="12" />
      <polyline points="16 9 13 12 16 15" />
      <line x1="12" y1="4" x2="12" y2="20" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  ),

  technical: ({ size = 13, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),

  example: ({ size = 13, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
    </svg>
  ),

  simpler: ({ size = 13, className = '', style = {} }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </svg>
  )
};

export const REFINEMENT_TYPES = [
  {
    id: 'shorter',
    label: 'Make Shorter',
    shortLabel: 'Shorter',
    icon: RefinementIcons.shorter,
    description: 'Compress into punchy 15-20s elevator pitch',
    directive: 'Compress this answer into an ultra-punchy 15 to 20-second spoken elevator pitch (maximum 2 to 3 sentences). Eliminate all preamble, background fluff, and tangential details. Deliver only the highest-impact direct answer.'
  },
  {
    id: 'technical',
    label: 'More Technical',
    shortLabel: 'Technical',
    icon: RefinementIcons.technical,
    description: 'Inject architectural trade-offs, algorithms, code & metrics',
    directive: 'Elevate this answer to maximum technical depth and architectural rigor. Include specific mechanisms, protocols, trade-offs (e.g. latency vs consistency, CPU vs memory), concrete production metrics, and relevant algorithms or code.'
  },
  {
    id: 'example',
    label: 'Give an Example',
    shortLabel: 'Example',
    icon: RefinementIcons.example,
    description: 'Ground in a concrete production case study with measurable outcomes',
    directive: 'Transform this answer into a concrete, compelling real-world case study or production scenario. Name a realistic project context, a high-stakes challenge faced, the specific technical or operational action taken, and measurable quantitative business/engineering results.'
  },
  {
    id: 'simpler',
    label: 'Simpler Language',
    shortLabel: 'Simpler',
    icon: RefinementIcons.simpler,
    description: 'Clear conversational English with an intuitive analogy',
    directive: 'Rewrite this answer using simple, crystal-clear conversational English and an intuitive real-world analogy. Eliminate dense jargon and obscure acronyms while preserving absolute authority and professional competence.'
  }
];

// ============================================================================
// INTERVIEW CATEGORIES DEFINITION & METADATA
// ============================================================================

export const INTERVIEW_CATEGORIES = [
  {
    id: 'it',
    label: 'IT & Software Development',
    shortLabel: 'IT & Cloud',
    icon: CategoryIcons.it,
    badgeText: 'IT DEV',
    frameworkName: 'System Architecture & Algorithms',
    recommendedAnswerStyle: 'technical',
    description: 'Coding, backend architecture, system design, DevOps, algorithms & database scaling.',
    commonRoles: [
      'Senior Software Engineer',
      'Full Stack Developer',
      'Backend Engineer',
      'Frontend Engineer',
      'DevOps / SRE Engineer',
      'Data Engineer / AI Specialist',
      'QA Automation Engineer'
    ],
    defaultSkills: 'Go, Python, TypeScript, Distributed Systems, Docker, Kubernetes, PostgreSQL, Kafka, Redis, Microservices, CI/CD',
    promptContext: {
      tlDrDirective: 'Provide a confident 10s spoken punchline directly answering the architectural, algorithmic, or technical core of the question.',
      frameworkGuideline: 'Structure answers using technical trade-offs, algorithms, code snippets (if applicable), and distributed edge cases.',
      rules: [
        'For coding questions, provide optimal code with time and space complexity.',
        'For architecture questions, address bottlenecks, caching, data consistency, and failure modes.',
        'Use precise technical terminology without excessive jargon.'
      ]
    },
    mockQuestions: {
      backend: [
        'How do you design an idempotent payment processing service handling 5,000 transactions per second?',
        'Explain how you would resolve a database connection pool exhaustion incident in production under heavy load.',
        'What are the trade-offs between optimistic locking and pessimistic locking in high-throughput updates?',
        'How do Kafka consumer groups handle partition rebalancing during sudden worker crashes?'
      ],
      algorithms: [
        'Given an array of intervals, merge all overlapping intervals in O(N log N) time.',
        'How would you implement an LRU Cache with O(1) get and put operations without using built-in OrderedDict?',
        'Explain how Dijkstra algorithm works versus A* search for shortest path calculations.',
        'How would you detect a cycle in a directed graph using Kahn algorithm (topological sort)?'
      ],
      system_design: [
        'Design a real-time collaborative document editing system like Google Docs using CRDTs or Operational Transformation.',
        'Design a distributed URL shortener (like bit.ly) that scales to 100M daily active redirects.',
        'How would you design a distributed rate limiter that works consistently across multiple geographical regions?',
        'Design a notification delivery engine that guarantees at-least-once delivery to millions of mobile push endpoints.'
      ],
      behavioral: [
        'Tell me about a time you strongly disagreed with a senior architect technical decision. How did you handle it?',
        'Describe a situation where a major bug reached production. How did you remediate and prevent recurrence?',
        'How do you prioritize technical debt versus shipping critical product features when deadlines are aggressive?',
        'Give an example of how you mentored a junior engineer who was struggling with complex architectural concepts.'
      ]
    }
  },

  {
    id: 'bpo',
    label: 'BPO, Voice & Customer Support',
    shortLabel: 'BPO & Support',
    icon: CategoryIcons.bpo,
    badgeText: 'BPO OPS',
    frameworkName: 'LAST Framework (Listen, Apologize, Solve, Thank)',
    recommendedAnswerStyle: 'concise',
    description: 'Customer service, de-escalation, voice/non-voice support, CSAT, FCR & SLA adherence.',
    commonRoles: [
      'Customer Support Executive',
      'Voice Process Specialist',
      'Escalations Specialist',
      'Technical Support Associate',
      'Customer Success Representative',
      'Operations Team Leader',
      'Quality Analyst (BPO)'
    ],
    defaultSkills: 'Customer Empathy, De-escalation, Active Listening, CSAT & NPS Optimization, First Contact Resolution (FCR), CRM (Salesforce/Zendesk), Average Handling Time (AHT) Balance, SLA Adherence',
    promptContext: {
      tlDrDirective: 'Provide an immediate calm spoken opening starting with sincere empathy, stating the clear corrective action and immediate next step.',
      frameworkGuideline: 'Strictly apply the LAST Framework (Listen, Apologize, Solve, Thank). Provide direct spoken dialogue ready for phone or live interaction.',
      rules: [
        'NEVER output programming code or software architecture unless specifically asked about a technical product.',
        'Prioritize customer satisfaction (CSAT), calming irate customers, and clear escalation protocols.',
        'Maintain a reassuring, polite, and authoritative professional tone.'
      ]
    },
    mockQuestions: {
      de_escalation: [
        'An angry customer calls screaming because their critical delivery was delayed by 10 days. How do you handle the first 60 seconds of the call?',
        'A customer refuses to speak with you and repeatedly demands an immediate supervisor. What exact steps and words do you use?',
        'How do you say "no" or decline an unreasonable refund request without frustrating or losing the customer?',
        'Describe a scenario where a caller was using abusive language. How did you maintain professional composure?'
      ],
      call_metrics: [
        'How do you balance achieving low Average Handling Time (AHT) while maintaining high First Contact Resolution (FCR)?',
        'If a customer asks a complex technical question that you do not know the answer to, what do you tell them?',
        'How do you handle a situation where company backend tools or systems crash mid-call with a customer waiting?',
        'What metrics do you monitor most closely on your personal performance scorecard and why?'
      ],
      scenarios: [
        'A customer complains that a previous agent gave them incorrect information and promised a credit that is not documented. How do you resolve this?',
        'Walk me through your step-by-step process for troubleshooting an internet or hardware issue with a non-technical elderly caller.',
        'How do you deliver bad news to a long-standing premium account holder whose contract warranty has expired?',
        'Explain how you transition from resolving a support query into offering a relevant product upgrade or upsell.'
      ],
      behavioral: [
        'Tell me about a time you turned an extremely dissatisfied, hostile customer into a loyal brand advocate.',
        'How do you stay motivated and maintain empathy when handling back-to-back stressful calls for an 8-hour shift?',
        'Describe a time you identified a recurring flaw in the support process and suggested a workflow improvement to your team lead.',
        'How do you handle receiving critical feedback from quality monitoring audits on your recorded calls?'
      ]
    }
  },

  {
    id: 'finance',
    label: 'Finance, Banking & Accounting',
    shortLabel: 'Finance & Banking',
    icon: CategoryIcons.finance,
    badgeText: 'FINANCE',
    frameworkName: '3-Statement Impact & Valuation Modeling',
    recommendedAnswerStyle: 'technical',
    description: 'Financial analysis, DCF, EBITDA, GAAP/IFRS standards, balance sheet logic, risk & compliance.',
    commonRoles: [
      'Financial Analyst (FP&A)',
      'Investment Banking Analyst',
      'Corporate Accountant / Controller',
      'Credit Risk Analyst',
      'Equity Research Associate',
      'Audit & Assurance Specialist',
      'Treasury & Capital Markets Specialist'
    ],
    defaultSkills: 'Financial Modeling, DCF & LBO, 3-Statement Integration, GAAP & IFRS, Variance Analysis, EBITDA & Working Capital, Excel & Financial Tooling, KYC & AML Compliance, Capital Budgeting',
    promptContext: {
      tlDrDirective: 'State the concrete financial metric, balance sheet impact, or valuation conclusion first in 10 seconds.',
      frameworkGuideline: 'Structure answers linking Income Statement, Balance Sheet, and Cash Flow Statement, citing financial formulas and regulatory compliance.',
      rules: [
        'Clarify the directional impact on cash flow, net income, and tax implications.',
        'Cite established accounting standards (GAAP/IFRS) and financial metrics (EBITDA, WACC, IRR, ROIC).',
        'Avoid vague generalities; provide concrete numeric examples and structured steps.'
      ]
    },
    mockQuestions: {
      modeling: [
        'Walk me through how a $10 increase in depreciation affects all three financial statements with a 20% tax rate.',
        'How do you calculate Free Cash Flow to Firm (FCFF) versus Free Cash Flow to Equity (FCFE)?',
        'Explain the step-by-step methodology of building a discounted cash flow (DCF) model and calculating Terminal Value.',
        'If two companies have the exact same EBITDA, why might one be trading at a significantly higher EV/EBITDA multiple?'
      ],
      accounting: [
        'What is the difference between capitalized lease and operating lease accounting under IFRS 16 / ASC 842?',
        'How do changes in Net Working Capital (NWC) impact cash flow from operating activities?',
        'Explain how inventory valuation methods (FIFO vs LIFO) affect reported earnings and tax liability in an inflationary environment.',
        'Walk me through the impairment testing process for Goodwill on the balance sheet.'
      ],
      risk_compliance: [
        'How do you assess credit risk when evaluating a mid-market borrower with volatile seasonal cash flows?',
        'Explain the core pillars of AML (Anti-Money Laundering) and KYC regulatory compliance in institutional banking.',
        'What stress-testing metrics do you apply to evaluate a debt portfolio against sudden interest rate hikes?',
        'How do you hedge foreign currency exchange risk for a multinational corporation with high overseas payables?'
      ],
      behavioral: [
        'Tell me about a complex financial model where you uncovered a critical calculation error before presenting to senior executives.',
        'How do you communicate complex financial variance drivers to non-finance department heads who are exceeding budget?',
        'Describe a time you faced tight deadlines during quarterly earnings or annual audit close. How did you prioritize?',
        'Give an example of a financial investment or cost reduction recommendation you championed that generated measurable ROI.'
      ]
    }
  },

  {
    id: 'sales',
    label: 'Sales, Marketing & Business Development',
    shortLabel: 'Sales & BD',
    icon: CategoryIcons.sales,
    badgeText: 'SALES & BD',
    frameworkName: 'BANT & SPIN Consultative Selling',
    recommendedAnswerStyle: 'concise',
    description: 'B2B/B2C sales, pipeline management, objection handling, lead qualification & closing strategies.',
    commonRoles: [
      'Account Executive (B2B SaaS)',
      'Business Development Representative (BDR/SDR)',
      'Sales Manager / Team Lead',
      'Growth & Digital Marketer',
      'Client Relationship Manager',
      'Enterprise Account Director'
    ],
    defaultSkills: 'BANT & MEDDPICC Qualification, SPIN Selling, Cold Outreach, Objection Handling, Pipeline Forecasting, CRM (Salesforce/HubSpot), CAC vs LTV Optimization, Contract Negotiation',
    promptContext: {
      tlDrDirective: 'Deliver a high-impact, persuasive value statement that reframes the objection and poses an open qualifying question.',
      frameworkGuideline: 'Apply consultative sales methodologies (SPIN, BANT, Challenger). Focus on prospect pain points, ROI, and closing momentum.',
      rules: [
        'Always anchor on commercial value, ROI, and urgency rather than feature lists.',
        'Provide actionable spoken scripts for handling pricing, competitor, and timing objections.',
        'Speak with natural charisma, confidence, and consultative curiosity.'
      ]
    },
    mockQuestions: {
      objections: [
        'A prospective enterprise buyer tells you: "Your product looks great, but your competitor is 40% cheaper." How do you respond?',
        'The prospect says: "We do not have the budget for this until next fiscal year." How do you create urgency?',
        'How do you respond when a decision-maker tells you: "We are satisfied with our current in-house solution and see no need to switch"?',
        'The prospect agrees on value but goes completely unresponsive after receiving the proposal. What is your follow-up cadence?'
      ],
      qualification: [
        'Walk me through your discovery call framework using BANT or MEDDPICC criteria.',
        'How do you identify the true economic decision-maker when navigating a complex multi-stakeholder enterprise account?',
        'What open-ended questions do you ask in the first 5 minutes of a demo call to uncover unstated business pain?',
        'How do you qualify out a tire-kicker lead quickly without wasting valuable sales pipeline hours?'
      ],
      strategy: [
        'How do you build and maintain an outbound prospecting pipeline to consistently exceed your quarterly quota?',
        'Walk me through how you calculate Customer Acquisition Cost (CAC) against Lifetime Value (LTV) in marketing campaigns.',
        'What is your approach to negotiating pricing contracts when the procurement team demands a 20% discount at signing?',
        'Explain how you collaborate with Customer Success to drive account expansion, renewals, and upsells.'
      ],
      behavioral: [
        'Tell me about the largest or most complex deal you closed from cold lead to contract execution.',
        'Describe a time you missed your sales quota. What root cause analysis did you perform, and how did you rebound?',
        'How do you handle a scenario where a client threatens to churn because an onboarding milestone was delayed?',
        'Give an example of how you coached or motivated a struggling peer or team member in your sales team.'
      ]
    }
  },

  {
    id: 'hr',
    label: 'Human Resources & Talent Acquisition',
    shortLabel: 'HR & Talent',
    icon: CategoryIcons.hr,
    badgeText: 'HR & TALENT',
    frameworkName: 'STAR Behavioral & Competency Assessment',
    recommendedAnswerStyle: 'star',
    description: 'Talent recruitment, employee relations, labor compliance, culture fit & conflict mediation.',
    commonRoles: [
      'HR Business Partner (HRBP)',
      'Talent Acquisition Specialist / Recruiter',
      'Employee Relations Manager',
      'People Operations Specialist',
      'Compensation & Benefits Analyst',
      'HR Generalist / Director'
    ],
    defaultSkills: 'Competency-Based Interviewing, Employee Relations, Labor Laws & Compliance, Conflict Resolution, Performance Management, Talent Sourcing & Pipeline, Diversity & Inclusion, Onboarding/Retention',
    promptContext: {
      tlDrDirective: 'State the core ethical or policy principle first, followed by the immediate resolution step and organizational impact.',
      frameworkGuideline: 'Use the STAR methodology (Situation, Task, Action, Result) with clear human empathy, labor compliance, and business alignment.',
      rules: [
        'Focus on fair process, confidentiality, statutory compliance, and organizational culture.',
        'Provide diplomatic and legally sound conflict resolution steps.',
        'Emphasize measurable employee engagement, retention, and hiring metrics.'
      ]
    },
    mockQuestions: {
      employee_relations: [
        'An employee comes to you alleging interpersonal harassment and retaliation from their direct department manager. What are your immediate first 3 steps?',
        'How do you handle an emotional confrontation between two senior team members whose ongoing feud is hurting department morale?',
        'Walk me through the legal and empathetic execution of an involuntary performance termination meeting.',
        'How do you investigate an anonymous complaint regarding toxic leadership without breaching team trust?'
      ],
      talent_acquisition: [
        'How do you source and attract passive niche senior candidates in a hyper-competitive hiring market?',
        'What behavioral interview questions do you ask to accurately assess emotional intelligence (EQ) and cultural contribution?',
        'How do you improve hiring manager alignment when they provide inconsistent feedback on shortlisted candidates?',
        'What metrics do you track to optimize Time-to-Hire, Cost-per-Hire, and candidate drop-off rates in the hiring funnel?'
      ],
      compliance_policy: [
        'How do you ensure company policies remain compliant with evolving labor laws across multiple regions or remote states?',
        'How do you handle a salary disparity review when an employee discovers a newer colleague in the same role earns significantly more?',
        'What steps do you take when rolling out an unpopular company-wide return-to-office or policy change?',
        'How do you design and implement fair Performance Improvement Plans (PIPs) that offer genuine rehabilitation rather than mere documentation?'
      ],
      behavioral: [
        'Tell me about a time you had to deliver difficult organizational news (like layoffs or budget cuts) to employees.',
        'Describe a situation where you had to push back against a C-suite executive who wanted to bypass standard hiring protocol.',
        'How have you successfully improved employee retention or reduced voluntary turnover in a high-churn department?',
        'Give an example of how you championed a successful diversity, equity, and inclusion (DEI) initiative with measurable outcomes.'
      ]
    }
  },

  {
    id: 'product',
    label: 'Product Management & Strategy',
    shortLabel: 'Product & PM',
    icon: CategoryIcons.product,
    badgeText: 'PRODUCT PM',
    frameworkName: 'CIRCLES Method & RICE Prioritization',
    recommendedAnswerStyle: 'star',
    description: 'Product sense, roadmap prioritization, user personas, North Star metrics & go-to-market execution.',
    commonRoles: [
      'Product Manager (PM / Senior PM)',
      'Technical Product Manager (TPM)',
      'Scrum Master / Agile Coach',
      'Product Owner',
      'Group Product Manager (GPM)'
    ],
    defaultSkills: 'Product Strategy, CIRCLES Framework, RICE & MoSCoW Prioritization, North Star Metrics, User Research, Wireframing & PRDs, A/B Testing, Cross-Functional Leadership, Agile/Scrum',
    promptContext: {
      tlDrDirective: 'Clarify the core user problem and state your strategic recommendation and trade-off in 10 seconds.',
      frameworkGuideline: 'Structure using CIRCLES (Comprehend, Identify, Report, Cut, List, Evaluate, Summarize) and RICE prioritization.',
      rules: [
        'Focus on user pain points, business objectives, and verifiable success metrics.',
        'Clearly articulate trade-offs, scope constraints, and MVP boundary decisions.',
        'Balance technical feasibility with market viability and user desirability.'
      ]
    },
    mockQuestions: {
      product_sense: [
        'How would you improve the user retention experience of Uber or Airbnb for first-time users?',
        'Design an automated grocery delivery service specifically tailored for visually impaired or elderly users.',
        'If you were the PM for WhatsApp, what new monetization feature would you introduce without degrading user privacy?',
        'Walk me through your favorite consumer product. What makes it exceptional, and what 3 features would you add next?'
      ],
      prioritization: [
        'Your engineering lead wants to spend a quarter refactoring legacy code while sales demands 3 new enterprise features. How do you decide?',
        'Explain how you apply the RICE framework (Reach, Impact, Confidence, Effort) to prioritize a backlogged roadmap.',
        'How do you define the MVP (Minimum Viable Product) for a high-risk experimental feature?',
        'If your primary North Star metric drops by 12% week-over-week, what is your diagnostic checklist to identify the root cause?'
      ],
      execution: [
        'How do you write a clear, actionable Product Requirements Document (PRD) that engineering and design teams love?',
        'Describe your process for designing, executing, and analyzing statistical significance in an A/B test.',
        'How do you manage a stubborn engineering lead who claims a core requested feature is impossible to build?',
        'Explain how you plan and coordinate a cross-functional Go-To-Market (GTM) launch with marketing, sales, and support.'
      ],
      behavioral: [
        'Tell me about a product feature you shipped that completely failed. What did you learn and how did you pivot?',
        'Describe a time you used qualitative user interviews to invalidate a strongly held assumption by executive leadership.',
        'How do you motivate an agile team that is suffering from burnout after consecutive aggressive release sprints?',
        'Give an example of how you resolved a high-stakes disagreement between design, legal, and engineering teams.'
      ]
    }
  },

  {
    id: 'healthcare',
    label: 'Healthcare & Clinical Operations',
    shortLabel: 'Healthcare',
    icon: CategoryIcons.healthcare,
    badgeText: 'HEALTHCARE',
    frameworkName: 'Patient Safety & Clinical Protocols',
    recommendedAnswerStyle: 'star',
    description: 'Patient care workflows, HIPAA compliance, clinical administration, triage & quality healthcare ops.',
    commonRoles: [
      'Clinical Operations Manager',
      'Healthcare Data Analyst',
      'Medical Practice Administrator',
      'Health Informatics Specialist',
      'Patient Care Coordinator',
      'Clinical Research Coordinator'
    ],
    defaultSkills: 'HIPAA & Patient Confidentiality, Clinical Workflow Optimization, EHR/EMR Systems (Epic/Cerner), Triage & Safety Protocols, Healthcare Quality Standards (JCAHO), Interdisciplinary Collaboration',
    promptContext: {
      tlDrDirective: 'State the immediate patient safety protocol and regulatory compliance step in 10 seconds.',
      frameworkGuideline: 'Structure answers around clinical evidence, patient safety, HIPAA privacy standards, and cross-team communication.',
      rules: [
        'Strictly adhere to medical ethics, patient consent, and healthcare regulatory laws.',
        'Prioritize patient outcome, safety protocols, and clear clinical documentation.',
        'Emphasize empathetic, non-judgmental, and professional bedside communication.'
      ]
    },
    mockQuestions: {
      protocols: [
        'How do you handle a suspected breach of patient privacy or HIPAA compliance within your clinical department?',
        'Describe your step-by-step workflow for managing patient triage during an unexpected influx of emergency admissions.',
        'How do you communicate complex clinical treatment instructions to a distressed patient with low health literacy?',
        'What protocols do you enforce to minimize medical medication administration errors in a fast-paced environment?'
      ],
      operations: [
        'How do you optimize patient throughput and reduce wait times without compromising the quality of bedside care?',
        'Explain your experience with Electronic Health Record (EHR) migration or workflow optimization.',
        'How do you handle staff scheduling and resource allocation during severe clinical nurse/staff shortages?',
        'What quality control measures do you monitor to ensure compliance with healthcare accreditation standards?'
      ],
      behavioral: [
        'Tell me about a high-stress medical emergency or critical incident you coordinated under intense pressure.',
        'How do you handle an emotional confrontation with an angry family member whose loved one is experiencing a medical delay?',
        'Describe a situation where you had to diplomatically question or verify a physician order that appeared questionable.',
        'Give an example of a clinical process improvement you implemented that measurably reduced patient discharge delays.'
      ]
    }
  },

  {
    id: 'engineering',
    label: 'Core Engineering & Manufacturing',
    shortLabel: 'Core Engg',
    icon: CategoryIcons.engineering,
    badgeText: 'CORE ENGG',
    frameworkName: 'Root Cause (5 Whys / FMEA) & Six Sigma',
    recommendedAnswerStyle: 'technical',
    description: 'Mechanical, electrical, civil, manufacturing operations, quality control, CAD & plant safety.',
    commonRoles: [
      'Mechanical Engineer',
      'Electrical / Electronics Engineer',
      'Civil / Structural Engineer',
      'Manufacturing & Production Engineer',
      'Quality Assurance & Safety Specialist',
      'Industrial Operations Manager'
    ],
    defaultSkills: 'Root Cause Analysis (5 Whys/Fishbone), FMEA, CAD/CAM (SolidWorks/AutoCAD), Six Sigma & 5S, Safety & OSHA Standards, Lean Manufacturing, Tolerance Analysis, Project Lifecycle Management',
    promptContext: {
      tlDrDirective: 'State the mechanical/physical failure point, safety protocol, and immediate engineering mitigation in 10 seconds.',
      frameworkGuideline: 'Apply engineering first principles, FMEA, root-cause analysis, and standardized industrial safety norms.',
      rules: [
        'Highlight tolerance analysis, material selection, and structural safety margins.',
        'Use rigorous diagnostic frameworks (5 Whys, Ishikawa diagram, DMAIC).',
        'Emphasize zero-accident safety compliance and preventive maintenance.'
      ]
    },
    mockQuestions: {
      technical: [
        'How do you approach a Failure Mode and Effects Analysis (FMEA) for a new mechanical assembly line?',
        'Walk me through your methodology for selecting materials when designing for high-vibration and cyclic thermal stress.',
        'How do you apply the "5 Whys" methodology to troubleshoot an unexpected hydraulic pressure drop in automated machinery?',
        'What are the primary differences and trade-offs between additive manufacturing (3D printing) versus CNC machining for low-volume production?'
      ],
      quality_safety: [
        'How do you implement and sustain a 5S methodology on a busy manufacturing plant floor?',
        'Describe your process for calculating and maintaining safety factors (SF) in structural load-bearing calculations.',
        'What immediate actions do you take when a critical safety interlock fails on operating plant equipment?',
        'How do you reduce cycle time in a manufacturing cell without increasing component defect rates?'
      ],
      behavioral: [
        'Tell me about a complex engineering project where a prototype failed initial stress testing. How did you diagnose and redesign it?',
        'How do you handle production pressure from plant managers who want to bypass a non-critical quality check to meet shipment deadlines?',
        'Describe a time you collaborated with cross-functional supply chain teams to resolve a critical vendor material defect.',
        'Give an example of an engineering design change you led that reduced manufacturing cost while preserving reliability.'
      ]
    }
  },

  {
    id: 'custom',
    label: 'Custom / Universal (Any Stream)',
    shortLabel: 'Custom Role',
    icon: CategoryIcons.custom,
    badgeText: 'UNIVERSAL',
    frameworkName: 'Custom Tailored Persona',
    recommendedAnswerStyle: 'concise',
    description: 'Universal setup for any unique stream, specialized domain, or non-standard interview role.',
    commonRoles: [
      'General Management Candidate',
      'Executive / C-Suite Candidate',
      'Consultant / Strategy Analyst',
      'Specialized Domain Expert',
      'Custom Role Candidate'
    ],
    defaultSkills: 'Problem Solving, Strategic Thinking, Executive Communication, Cross-Functional Leadership, Adaptability, Domain Expertise',
    promptContext: {
      tlDrDirective: 'Provide a direct, articulate 10s spoken answer addressing the core premise of the question.',
      frameworkGuideline: 'Tailor the response to the candidate custom background, target job description, and requested answer style.',
      rules: [
        'Follow the candidate target role and JD instructions precisely.',
        'Maintain an authentic, professional first-person delivery.',
        'Eliminate all filler and jump straight into ready-to-speak responses.'
      ]
    },
    mockQuestions: {
      general: [
        'Walk me through your background and the key career milestones that make you a great fit for this position.',
        'What is the most significant professional achievement of your career, and what challenges did you overcome?',
        'How do you approach learning and mastering a completely unfamiliar subject or business domain within 30 days?',
        'Where do you see yourself contributing the most strategic value to our organization over the next 12 months?'
      ],
      leadership: [
        'Describe your leadership philosophy when managing a diverse team with conflicting viewpoints.',
        'Tell me about a time you had to make a high-stakes decision with incomplete or ambiguous data.',
        'How do you handle delivering constructive criticism or tough performance reviews to direct reports?',
        'Describe a situation where you had to manage an organizational crisis or unexpected PR issue.'
      ],
      problem_solving: [
        'Walk me through how you deconstruct an ambiguous, unstructured problem into actionable milestones.',
        'How do you evaluate whether a strategic initiative is failing and when it is time to pivot versus persevere?',
        'Tell me about a time you identified a high-impact efficiency gain that saved your organization substantial time or money.',
        'How do you manage stakeholders who have competing agendas or resistance to your proposed strategy?'
      ]
    }
  }
];

export const getCategoryById = (categoryId) => {
  return INTERVIEW_CATEGORIES.find((c) => c.id === categoryId) || INTERVIEW_CATEGORIES[0];
};

export const MOCK_TOPIC_LABELS = {
  backend: 'Backend & Systems',
  algorithms: 'Coding & LeetCode',
  system_design: 'System Design',
  de_escalation: 'De-escalation & Callers',
  call_metrics: 'Call Metrics & SLAs',
  scenarios: 'Real Scenarios & Troubleshooting',
  modeling: '3-Statement & Valuation',
  accounting: 'Accounting & Working Capital',
  risk_compliance: 'Risk & Compliance',
  objections: 'Objection Handling',
  qualification: 'BANT Discovery',
  strategy: 'Pipeline & Closing',
  employee_relations: 'Employee Relations',
  talent_acquisition: 'Talent Sourcing',
  compliance_policy: 'Labor Law & Policy',
  product_sense: 'Product Sense & Personas',
  prioritization: 'RICE Prioritization',
  execution: 'PRDs & Execution',
  protocols: 'Patient Safety & Triage',
  operations: 'Clinical Operations',
  technical: 'Root Cause & Analysis',
  quality_safety: 'Six Sigma & Safety',
  general: 'Career Milestones',
  leadership: 'Crisis & Leadership',
  problem_solving: 'Problem Solving',
  behavioral: 'STAR Behavioral'
};
