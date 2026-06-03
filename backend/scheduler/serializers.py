from rest_framework import serializers

class SchedulerTaskSerializer(serializers.Serializer):
    task_id = serializers.CharField()
    name = serializers.CharField()
    func = serializers.CharField()
    status = serializers.CharField()
    next_run = serializers.DateTimeField(allow_null=True)
    repeats = serializers.IntegerField(allow_null=True)
    schedule_type = serializers.CharField(allow_null=True)
    day_of_month = serializers.IntegerField(allow_null=True)

class SchedulerToggleSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[('on', 'On'), ('off', 'Off')])
    day_of_month = serializers.IntegerField(required=False, min_value=1, max_value=31)
