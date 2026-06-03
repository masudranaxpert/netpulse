import datetime
import calendar
from django.utils import timezone
from django_q.models import Schedule
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from scheduler.constants import SCHEDULER_TASKS, MONTHLY_BILL_TASK, BILL_DUE_DISCONNECT_TASK, BILLING_DATE_UPDATE_TASK
from scheduler.serializers import SchedulerTaskSerializer, SchedulerToggleSerializer
from scheduler.schemas import scheduler_schema_view

def get_next_monthly_run(day_of_month):
    now = timezone.now()
    today = now.date()
    
    try:
        max_days = calendar.monthrange(today.year, today.month)[1]
        target_day = min(day_of_month, max_days)
        candidate = datetime.datetime(today.year, today.month, target_day, 0, 0, 0)
        candidate = timezone.make_aware(candidate, timezone.get_current_timezone())
        if candidate > now:
            return candidate
    except ValueError:
        pass
        
    if today.month == 12:
        next_month = 1
        next_year = today.year + 1
    else:
        next_month = today.month + 1
        next_year = today.year
        
    max_days = calendar.monthrange(next_year, next_month)[1]
    target_day = min(day_of_month, max_days)
    result = datetime.datetime(next_year, next_month, target_day, 0, 0, 0)
    return timezone.make_aware(result, timezone.get_current_timezone())


@scheduler_schema_view
class SchedulerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """List all 3 tasks and their current scheduler status"""
        data = []
        for task_id, cfg in SCHEDULER_TASKS.items():
            schedule = Schedule.objects.filter(func=cfg["func"]).first()
            
            task_status = "not_created"
            next_run = None
            repeats = None
            schedule_type = None
            day_of_month = None
            
            if schedule:
                if schedule.repeats == -1:
                    task_status = "on"
                else:
                    task_status = "off"
                next_run = schedule.next_run
                repeats = schedule.repeats
                schedule_type = schedule.schedule_type
                
                if schedule.schedule_type == 'M' and schedule.next_run:
                    day_of_month = schedule.next_run.day
            
            data.append({
                "task_id": task_id,
                "name": cfg["name"],
                "func": cfg["func"],
                "status": task_status,
                "next_run": next_run,
                "repeats": repeats,
                "schedule_type": schedule_type,
                "day_of_month": day_of_month
            })
            
        serializer = SchedulerTaskSerializer(data, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='create')
    def create_task(self, request, pk=None):
        """Create a scheduler record for a task with repeat=0 (off)"""
        if pk not in SCHEDULER_TASKS:
            return Response({"status": "error", "message": "Invalid task ID"}, status=status.HTTP_400_BAD_REQUEST)
            
        cfg = SCHEDULER_TASKS[pk]
        schedule = Schedule.objects.filter(func=cfg["func"]).first()
        
        if not schedule:
            now = timezone.now()
            schedule = Schedule.objects.create(
                name=cfg["name"],
                func=cfg["func"],
                schedule_type=cfg["default_schedule_type"],
                repeats=0,
                next_run=now
            )
            
        return Response({
            "status": "success",
            "message": f"Task '{cfg['name']}' schedule record initialized (off)"
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='delete')
    def delete_task(self, request, pk=None):
        """Delete a scheduler record for a task from database"""
        if pk not in SCHEDULER_TASKS:
            return Response({"status": "error", "message": "Invalid task ID"}, status=status.HTTP_400_BAD_REQUEST)
            
        cfg = SCHEDULER_TASKS[pk]
        schedule = Schedule.objects.filter(func=cfg["func"]).first()
        
        if schedule:
            schedule.delete()
            return Response({"status": "success", "message": f"Deleted scheduler record for '{cfg['name']}'"})
            
        return Response({"status": "error", "message": "Task schedule record does not exist"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='toggle')
    def toggle_task(self, request, pk=None):
        """Toggle scheduler task on (repeats=-1) or off (repeats=0)"""
        if pk not in SCHEDULER_TASKS:
            return Response({"status": "error", "message": "Invalid task ID"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = SchedulerToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cfg = SCHEDULER_TASKS[pk]
        schedule = Schedule.objects.filter(func=cfg["func"]).first()
        
        if not schedule:
            return Response({
                "status": "error", 
                "message": "Task scheduler record must be created first before toggling."
            }, status=status.HTTP_404_NOT_FOUND)
            
        toggle_status = serializer.validated_data['status']
        
        if toggle_status == 'off':
            schedule.repeats = 0
            schedule.save()
            return Response({"status": "success", "message": f"Task '{cfg['name']}' is now turned off."})
            
        if toggle_status == 'on':
            schedule.repeats = -1
            
            if pk == MONTHLY_BILL_TASK:
                day_of_month = serializer.validated_data.get('day_of_month', 1)
                schedule.next_run = get_next_monthly_run(day_of_month)
                schedule.schedule_type = 'M'
            elif pk == BILL_DUE_DISCONNECT_TASK:
                schedule.next_run = timezone.now() + datetime.timedelta(hours=1)
                schedule.schedule_type = 'H'
            elif pk == BILLING_DATE_UPDATE_TASK:
                tomorrow_midnight = (timezone.now() + datetime.timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
                schedule.next_run = timezone.make_aware(datetime.datetime.combine(tomorrow_midnight.date(), datetime.time.min), timezone.get_current_timezone())
                schedule.schedule_type = 'D'
                
            schedule.save()
            return Response({
                "status": "success",
                "message": f"Task '{cfg['name']}' is now turned on. Next run scheduled at {schedule.next_run}."
            })
