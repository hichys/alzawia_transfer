app_name = "alzawia_transfer"
app_title = "Alzawia Transfer"
app_publisher = "awad mohamed"
app_description = "manager alzawia company transfers"
app_email = "awd@hotmail.it"
app_license = "mit"

# Apps
# ------------------

required_apps = ["frappe/erpnext"]

# Each item in the list will be shown as an app in the apps page
add_to_apps_screen = [
	{
		"name": "alzawia_transfer",
		"logo": "/assets/alzawia_transfer/logo.png",
		"title": "Alzawia Transfer",
		"route": "/app/alzawia",
	}
]
website_context = {
	"splash_image": "/assets/alzawia_transfer/logo.png",
	"favicon": "/assets/alzawia_transfer/logo.png",
}
fixtures = [
	{"doctype": "Workspace", "filters": [["name", "in", ["Alzawia"]]]},
	{"doctype": "Role", "filters": [["name", "in", ["Alzawia Employee"]]]},
	{"doctype": "DocPerm", "filters": [["role", "=", "Alzawia Employee"]]},
	{"doctype": "Custom DocPerm", "filters": [["role", "in", ["Alzawia Employee"]]]},
	{
		"doctype": "Report",
		"filters": [["name", "in", ["تقرير الارصده", "Custom General Ledger"]]],
	},
	"Page",
]
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/alzawia_transfer/css/alzawia_transfer.css"
# app_include_js = "/assets/alzawia_transfer/js/alzawia_transfer.js"

# include js, css files in header of web template
web_include_css = "/assets/alzawia_transfer/css/alzawia_reports.css"
web_include_js = "/assets/alzawia_transfer/js/alzawia_reports.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "alzawia_transfer/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "alzawia_transfer/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
home_page = "/app/alzawia"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "alzawia_transfer.utils.jinja_methods",
# 	"filters": "alzawia_transfer.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "alzawia_transfer.install.before_install"
# after_install = "alzawia_transfer.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "alzawia_transfer.uninstall.before_uninstall"
# after_uninstall = "alzawia_transfer.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "alzawia_transfer.utils.before_app_install"
# after_app_install = "alzawia_transfer.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "alzawia_transfer.utils.before_app_uninstall"
# after_app_uninstall = "alzawia_transfer.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "alzawia_transfer.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"alzawia_transfer.tasks.all"
# 	],
# 	"daily": [
# 		"alzawia_transfer.tasks.daily"
# 	],
# 	"hourly": [
# 		"alzawia_transfer.tasks.hourly"
# 	],
# 	"weekly": [
# 		"alzawia_transfer.tasks.weekly"
# 	],
# 	"monthly": [
# 		"alzawia_transfer.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "alzawia_transfer.install.before_tests"

# Extend DocType Class
# ------------------------------
#
# Specify custom mixins to extend the standard doctype controller.
# extend_doctype_class = {
# 	"Task": "alzawia_transfer.custom.task.CustomTaskMixin"
# }

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "alzawia_transfer.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "alzawia_transfer.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["alzawia_transfer.utils.before_request"]
# after_request = ["alzawia_transfer.utils.after_request"]

# Job Events
# ----------
# before_job = ["alzawia_transfer.utils.before_job"]
# after_job = ["alzawia_transfer.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"alzawia_transfer.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
