export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: 'emergency' | 'case-discussion' | 'general' | 'handoff';
  icon: string;
}

export const messageTemplates: MessageTemplate[] = [
  // Emergency Templates
  {
    id: 'EMRG001',
    title: 'Code Blue',
    content: '🚨 CODE BLUE - Room [ROOM_NUMBER] - Immediate assistance required!',
    category: 'emergency',
    icon: '🚨'
  },
  {
    id: 'EMRG002',
    title: 'Trauma Alert',
    content: '🚨 TRAUMA ALERT - ETA [TIME] minutes - [INJURY_TYPE] - All trauma team to ER',
    category: 'emergency',
    icon: '🏥'
  },
  {
    id: 'EMRG003',
    title: 'Rapid Response',
    content: '⚡ RAPID RESPONSE - Room [ROOM_NUMBER] - Patient showing signs of deterioration',
    category: 'emergency',
    icon: '⚡'
  },

  // Case Discussion Templates
  {
    id: 'CASE001',
    title: 'Pre-Op Discussion',
    content: 'Pre-operative discussion for [PATIENT_ID]: [PROCEDURE_NAME] scheduled for [TIME]. Key considerations: [NOTES]',
    category: 'case-discussion',
    icon: '🏥'
  },
  {
    id: 'CASE002',
    title: 'Post-Op Update',
    content: 'Post-operative update for [PATIENT_ID]: [PROCEDURE_NAME] completed successfully. Patient stable, transferred to [LOCATION].',
    category: 'case-discussion',
    icon: '✅'
  },
  {
    id: 'CASE003',
    title: 'Consultation Request',
    content: 'Requesting [SPECIALTY] consultation for [PATIENT_ID] in [LOCATION]. Reason: [CLINICAL_INDICATION]',
    category: 'case-discussion',
    icon: '👨‍⚕️'
  },
  {
    id: 'CASE004',
    title: 'Lab Results Alert',
    content: '📊 Critical lab results for [PATIENT_ID]: [LAB_VALUE] - [NORMAL_RANGE]. Immediate attention required.',
    category: 'case-discussion',
    icon: '📊'
  },

  // Handoff Templates
  {
    id: 'HAND001',
    title: 'Shift Handoff',
    content: 'Shift handoff for [UNIT]: [NUMBER] patients. Key concerns: [PRIORITY_PATIENTS]. Special instructions: [NOTES]',
    category: 'handoff',
    icon: '🔄'
  },
  {
    id: 'HAND002',
    title: 'Patient Transfer',
    content: 'Patient transfer: [PATIENT_ID] from [FROM_UNIT] to [TO_UNIT]. Condition: [STATUS]. Special needs: [REQUIREMENTS]',
    category: 'handoff',
    icon: '🚑'
  },

  // General Templates
  {
    id: 'GEN001',
    title: 'Meeting Reminder',
    content: '📅 Reminder: [MEETING_TYPE] scheduled for [DATE] at [TIME] in [LOCATION]. Agenda: [TOPICS]',
    category: 'general',
    icon: '📅'
  },
  {
    id: 'GEN002',
    title: 'Equipment Issue',
    content: '⚠️ Equipment issue reported: [EQUIPMENT_NAME] in [LOCATION]. Status: [ISSUE_DESCRIPTION]. Maintenance notified.',
    category: 'general',
    icon: '⚠️'
  },
  {
    id: 'GEN003',
    title: 'Policy Update',
    content: '📋 Policy update: [POLICY_NAME] has been revised. Key changes: [CHANGES]. Effective date: [DATE]',
    category: 'general',
    icon: '📋'
  }
];

export const getTemplatesByCategory = (category: MessageTemplate['category']): MessageTemplate[] => {
  return messageTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): MessageTemplate | undefined => {
  return messageTemplates.find(template => template.id === id);
};

export const fillTemplate = (template: MessageTemplate, variables: Record<string, string>): string => {
  let content = template.content;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `[${key.toUpperCase()}]`;
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
};