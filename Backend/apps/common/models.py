from django.db import models
from django.conf import settings


# ── PROJECTS ──────────────────────────────────────────────────────────────────

class Subject(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('taken', 'Taken'),
        ('archived', 'Archived'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    year = models.CharField(max_length=10, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='subjects',
        limit_choices_to={'role': 'supervisor'}
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    student = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='project', limit_choices_to={'role': 'student'}
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='supervised_projects',
        limit_choices_to={'role': 'supervisor'}
    )
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Document(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    TARGET_CHOICES = [
        ('supervisor', 'Supervisor'),
        ('jury', 'Jury'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='documents', limit_choices_to={'role': 'student'}
    )
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/%Y/%m/')
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target = models.CharField(max_length=20, choices=TARGET_CHOICES, default='supervisor')
    comment = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'{self.title} v{self.version}'

    @property
    def size(self):
        try:
            return f'{self.file.size / 1024:.1f} KB'
        except Exception:
            return 'N/A'

    @property
    def student_name(self):
        return self.student.name


class DocumentRemark(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='remarks')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class Milestone(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('current', 'Current'),
        ('pending', 'Pending'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'date']

    def __str__(self):
        return self.title


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Rescheduled', 'Rescheduled'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='appointments')
    title = models.CharField(max_length=200)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments_student'
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='appointments_supervisor'
    )
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=50, default='meeting')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True)
    reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f'{self.title} — {self.date}'


class Evaluation(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='evaluation')
    supervisor_score = models.FloatField(null=True, blank=True)
    jury_score = models.FloatField(null=True, blank=True)
    supervisor_comment = models.TextField(blank=True)
    jury_comment = models.TextField(blank=True)
    supervisor_criteria = models.JSONField(null=True, blank=True)
    jury_criteria = models.JSONField(null=True, blank=True)
    supervisor_weight = models.FloatField(default=50)
    jury_weight = models.FloatField(default=50)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Evaluation — {self.project.title}'


class Feedback(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedbacks')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JuryAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='jury_assignments')
    jury_member = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='jury_assignments', limit_choices_to={'role': 'jury'}
    )
    role = models.CharField(max_length=50, default='member')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['project', 'jury_member']

    def __str__(self):
        return f'{self.jury_member.name} → {self.project.title}'


# ── COMMUNICATIONS ────────────────────────────────────────────────────────────

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages'
    )
    subject = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.sender} → {self.recipient}: {self.subject or "No subject"}'


class Notification(models.Model):
    TYPE_CHOICES = [
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('grade', 'Grade'),
        ('defense', 'Defense'),
        ('message', 'Message'),
        ('info', 'Info'),
    ]
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications'
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    link = models.CharField(max_length=200, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} → {self.recipient}'


class AdminNote(models.Model):
    AUDIENCE_CHOICES = [
        ('all', 'All'),
        ('students', 'Students'),
        ('supervisors', 'Supervisors'),
        ('juries', 'Juries'),
    ]
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='all')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return self.title


class Resource(models.Model):
    TYPE_CHOICES = [
        ('document', 'Document'),
        ('video', 'Video'),
        ('link', 'Link'),
        ('template', 'Template'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='resources/%Y/%m/', null=True, blank=True)
    url = models.URLField(blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='document')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
