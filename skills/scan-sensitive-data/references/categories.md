# Sensitivity categories and legal classification

Use these categories as portable detection vocabulary, not as a company's allow/deny policy. Personal data concerns an identifiable individual, directly or indirectly; the legal status depends on jurisdiction and context. References to GDPR articles below are generic triage labels, not definitive legal determinations.

| Category key          | Detect                                                                               | Typical legal classification                      | Notes                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------- |
| health                | Diagnoses, symptoms, disability, medical treatment, sick leave revealing a condition | special_category_art9                             | Generic absence without health details may not disclose a condition   |
| beliefs               | Religion, philosophical belief, political opinion, trade union membership            | special_category_art9                             | Do not infer beliefs from a name or nationality                       |
| identity_sensitive    | Race or ethnic origin, genetic or biometric data for unique identification           | special_category_art9                             | Avoid demographic inference from appearances/names                    |
| intimate_life         | Sex life or sexual orientation                                                       | special_category_art9                             | Distinguish from ordinary family or relationship references           |
| criminal              | Convictions, offences, allegations and judicial/criminal history                     | criminal_art10 or uncertain                       | Mere civil disputes are not automatically criminal data               |
| national_id           | BSN and similar national personal identifiers; passport or identity-document numbers | national_identifier / regular_personal_data       | Highly restricted in many contexts; validate plausibility and context |
| financial             | Salary, bank account, debts, tax returns, financial hardship                         | regular_personal_data                             | Not inherently Art. 9; organizational rules can prohibit it           |
| employment_hr         | Employment agreements, evaluations, applications, resumes, selection and HR files    | regular_personal_data; sometimes Art. 9           | Contents can include additional sensitive categories                  |
| credentials           | Passwords, recovery codes, access tokens, API keys, private keys                     | confidential_nonpersonal or regular_personal_data | Never reproduce or quote values in findings                           |
| private_contact       | Personal address, phone, personal email, emergency contact, family details           | regular_personal_data                             | May be permissible for a legitimate business purpose                  |
| location_tracking     | Precise location trails, device tracking, personal movement                          | regular_personal_data                             | Sensitivity escalates with granularity and accumulation               |
| student_child         | Information about children, identifiable pupils, learning-support issues             | regular_personal_data; possibly Art. 9            | Treat as high-care context; legal class depends on content            |
| confidential_business | Non-public contracts, financial plans, security incidents or internal strategy       | confidential_nonpersonal; possibly personal       | Organization-defined rules determine allowed storage                  |
| other_contextual      | Information that becomes sensitive through combinations or inferred implications     | uncertain                                         | Explain the inference, do not assert an unproven fact                 |

## Cross-cutting rules

- **Legal class is not policy status.** For example, salary is normally regular personal data but may be disallowed by an organization's AI/CRM policy.
- **Context controls findings.** A fictional exercise about an illness, a general informational question, and a person's disclosed diagnosis are not equivalent.
- **Public vs private is not the sole test.** Public facts can still be personal data and might be excessive to retain.
- **False positives matter.** A word like 'depressie' in an economics article is not evidence of the contact's mental-health condition.
- **Disclosure risk matters.** Prioritize authentication secrets, detailed health history, criminal data and national IDs, but allow caller policy to override risk priorities.
- **No exhaustive guarantee.** The detector can miss nuances; uncertainty should be explicit.
