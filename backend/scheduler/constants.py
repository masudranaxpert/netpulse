MONTHLY_BILL_TASK = "monthly_bill_job"
BILL_DUE_DISCONNECT_TASK = "bill_due_disconnect_job"
BILLING_DATE_UPDATE_TASK = "billing_date_update_job"

SCHEDULER_TASKS = {
    MONTHLY_BILL_TASK: {
        "name": "Monthly Bill Generator",
        "func": "scheduler.tasks.monthly_bill_job",
        "default_schedule_type": "M"
    },
    BILL_DUE_DISCONNECT_TASK: {
        "name": "Bill Due Disconnector",
        "func": "scheduler.tasks.bill_due_disconnect_job",
        "default_schedule_type": "H"
    },
    BILLING_DATE_UPDATE_TASK: {
        "name": "Billing Date Updater",
        "func": "scheduler.tasks.billing_date_update_job",
        "default_schedule_type": "D"
    }
}
