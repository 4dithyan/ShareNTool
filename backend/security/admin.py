from django.contrib import admin
from .models import SecurityVerification, DamageReport

@admin.register(SecurityVerification)
class SecurityVerificationAdmin(admin.ModelAdmin):
    list_display = ('booking', 'verification_type', 'is_verified', 'timestamp')

@admin.register(DamageReport)
class DamageReportAdmin(admin.ModelAdmin):
    list_display = ('issue_title', 'booking', 'reported_by', 'damage_fee_requested', 'status', 'created_at')

