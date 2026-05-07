export const INITIAL_TEMPLATES = {
  'enrollment': {
    name: 'New Course Enrollment',
    subject: 'Welcome to {{course_name}}!',
    body: `Hi {{student_name}},

Congratulations! You have been successfully enrolled in the course: {{course_name}}.

We are excited to have you on board. You can start your learning journey immediately by clicking the link below:

{{login_url}}

Best regards,
The EduCore Learning Team`
  },
  'reminder': {
    name: 'Assignment Due Reminder',
    subject: 'Gentle Reminder: Your assignment for {{course_name}} is due soon',
    body: `Hello {{student_name}},

This is a friendly reminder that your assignment for {{course_name}} is due on {{due_date}}.

Please make sure to submit your work on time to avoid any penalties. If you have any questions, feel free to reach out to {{instructor_name}}.

Good luck!
The EduCore Team`
  },
  'grading': {
    name: 'Grade Published',
    subject: 'Your grade for {{course_name}} has been published',
    body: `Greetings {{student_name}},

Your grade for the recent assessment in {{course_name}} is now available for review.

Log in to your dashboard to see your performance and feedback:
{{login_url}}

Keep up the great work!
Best,
{{instructor_name}}`
  },
  'welcome': {
    name: 'Welcome Email',
    subject: 'Welcome to the EduCore Platform!',
    body: `Hi {{student_name}},

Welcome to EduCore! We are thrilled to have you join our learning community.

To get started, please log in and explore your dashboard:
{{login_url}}

If you need any assistance, our support team is always here to help.

Happy Learning!
The EduCore Team`
  }
};

export const placeholders = ['{{student_name}}', '{{course_name}}', '{{instructor_name}}', '{{login_url}}', '{{due_date}}'];
export const toolbarIcons = ['format_bold', 'format_italic', 'link', 'format_list_bulleted', 'image'];
